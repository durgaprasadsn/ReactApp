import React, { useState, useEffect } from 'react';
import SelectBasic from '../components/DropDown';
import AdminNavBarSimple from '../components/AdminNavbar'
import { ref, onValue, update } from '@firebase/database';
import { auth, db } from '../services/firebase';
import DatePickerCustom from '../components/DatePicker';
import BasicTimePicker from '../components/TimePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [displayState, setDisplayState] = useState(null);
    const [selectedBid, setSelectedBid] = useState(null);
    const [selectDate, setSelectDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);

    const reference = ref(db, "projects/");
    const admin_ref = ref(db, "admin/");
    const [currentTime, setCurrentTime] = useState(new Date());
    // console.log(dayjs().format('YYYY-MM-DD'));
    useEffect(() => {
        // Subscribe to changes in the database
        const unsubscribe = onValue(reference, (snapshot) => {
            const dataFromDB = snapshot.val();
            if (!!dataFromDB) {
                // Convert the object into an array of projects
                const projectsArray = Object.entries(dataFromDB).map(([key, value]) => ({
                    projectName: key,
                    ...value,
                }));
                console.log(projectsArray);
                setProjects(projectsArray);
            } else {
                console.log("Data not found");
                setProjects([]);
            }
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    // if (JSON.stringify(displayState) !== '{}') {
    //     console.log("True " + JSON.stringify(displayState));
    // } else {
    //     console.log("False");
    // }
    // console.log("Current User " + auth.currentUser.uid);
    useEffect(() => {
        const fetchData = async () => {
            if (selectedProject != null) {
                const ref_proj = ref(db, selectedProject.projectName);
                const snapshot = await onValue(ref_proj, (snapshot) => {
                    const data = snapshot.val()
                    if (!!data) {
                        // console.log("Loggg " + JSON.stringify(data));
                        const bidArray = Object.entries(data).map(([key, value]) => ({
                            uid: key,
                            ...value,
                        }));
                        console.log("Bid Array " + JSON.stringify(bidArray));
                        const desiredUid = auth.currentUser.uid;
                        bidArray.sort((a, b) => (a.uid === desiredUid ? -1 : b.uid === desiredUid ? 1 : 0));
                        setDisplayState(bidArray);
                    }
                });
                console.log(snapshot);
                
            }
        };

        fetchData();

        // Cleanup function not required for this useEffect
    }, [selectedProject, selectDate]); // Run this effect whenever selectedProject changes

    const [cardState,setCardState]=React.useState(null);
    var isUpdate = false;
    // var successAlertVisible = false;
    function updateState(e) {
        isUpdate = true;
        setCardState({ 
            ...cardState,[e.target.id]:e.target.value
        })
    }
    const handleChange = (e) => {
        e.preventDefault();
        updateState(e);
    }

    const handleUpdate=(e)=>{
        console.log("Handle Update");
        e.preventDefault();
        // console.log(cardState + " " + selectedProject.projectName + " " + auth.currentUser.uid);
        const path_update = selectedProject.projectName + "/" + auth.currentUser.uid;
        
        const mergedObject = {
            ...displayState[0],
            ...cardState
          };
        delete mergedObject.uid;

        const updates = {}
        updates[path_update] = mergedObject;

        update(ref(db), updates).then( () => {
            console.log("SUCCESS");
          } ) .catch((error) => {
            console.log(error)
          } )
      }

    const handleProjectSelect = async (project) => {
        console.log("Project selected " + JSON.stringify(project));
        setSelectedProject(project);
        setSuccessAlertVisible(false);
        setStartTime(null);
        setEndTime(null);
        setSelectDate(null);
        if (project) {
            const ref_proj = ref(db, "admin/" + project.projectName);
            onValue(ref_proj, (snapshot) => {
                const data = snapshot.val()
                if (!!data) {
                    // console.log("Loggg " + JSON.stringify(data));
                    console.log("Check the time " + data.start_time)
                    setSelectDate(dayjs(data.date, "YYYY-MM-DD"));
                    console.log("Date updated in selectDate " + selectDate)
                    setStartTime(data.start_time);
                    setEndTime(data.end_time);
                }
            });
        }
    };

    function updateDate(date) {
        console.log("Start Date " +  date + dayjs(dayjs(date).format('YYYY-MM-DD')));
        
        const date_selected = dayjs(dayjs(date).format('YYYY-MM-DD'));
        setSelectDate(date_selected);
        
    }

    function updateStartTime(time) {
        console.log("Start Time " + dayjs(time).format('HH:mm:ss'));
        const start_time = dayjs(time).format('HH:mm:ss')
        setStartTime(start_time);
        console.log("Check the date state " + selectDate);
    }

    function updateEndTime(time) {
        console.log("End Time " + dayjs(time).format('HH:mm:ss'));
        const end_time = dayjs(time).format('HH:mm:ss')
        setEndTime(end_time);
    }
    const updateProject = async () => {
        console.log("Update Project " + dayjs(selectDate.format("YYYY-MM-DD")) + " start " + startTime + " end " + endTime + " selected Project " + selectedProject.projectName);
        const path_update = "admin/" + selectedProject.projectName;
        const updates = {};
        updates[path_update] = {
            date: dayjs(selectDate).format('YYYY-MM-DD'),
            start_time: startTime,
            end_time: endTime
        }
        console.log("Updates " + JSON.stringify(updates));
        update(ref(db), updates).then( () => {
            setSuccessAlertVisible(true);
            console.log("SUCCESS");
            setSelectedProject(null);
            setSelectDate(null);
            setStartTime(null);
            setEndTime(null);
            // alert("Successfully Updated"); 
        });
    }

    return (
        <>
            <AdminNavBarSimple />
            
                <>
                    <SelectBasic
                        options={projects}
                        onChange={handleProjectSelect}
                        value={selectedProject}
                        labelKey="projectName"
                    />

                    {/* {displayState && Object.keys(displayState).map((key) => ( 
                        (<div key={key} className='flex justify-center'>
                        <CardSimple handleChange={handleChange} handleUpdate={handleUpdate} uid={key} data={displayState[key]} flag={displayState[key].uid !== auth.currentUser.uid} />
                        </div>
                        )
                    ))}  */}
                    {selectedProject && <>
                        <DatePickerCustom label="Date" selectedDate={selectDate}  onDateChange={updateDate}/>
                            <div className='flex justify-center'>
                                <div className='mr-4'>
                                    <BasicTimePicker label='Start Time' selectedTime={startTime}  onTimeChange={updateStartTime} />
                                </div>
                                <div>
                                    <BasicTimePicker label='End Time' selectedTime={endTime}  onTimeChange={updateEndTime} />
                                </div>
                        </div>
                        <div className='flex justify-center p-3'>
                            <Button id="btn" type="submit" variant="contained" onClick={updateProject}>Update</Button>
                        </div>
                        </>
                    }
                    {isSuccessAlertVisible && (
                        <Alert severity="success">
                        {/* <AlertTitle>Success</AlertTitle> */}
                        Successfully Updated.
                        </Alert>)
                    }
                </>       
            {/* {displayState && <CardSimple value={JSON.stringify(displayState)} />} */}
        </>
    );
};

export default Home;
