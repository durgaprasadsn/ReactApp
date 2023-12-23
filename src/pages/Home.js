import React, { useState, useEffect } from 'react';
import NavbarSimple from '../components/Navbar';
import CardSimple from '../components/Card';
import SelectBasic from '../components/DropDown';
import { ref, onValue, update } from '@firebase/database';
import { auth, db } from '../services/firebase';
import { isAuthenticated } from '../services/authService';
import { useNavigate } from 'react-router';

const Home = () => {
    // console.log("Check Authentication " + isAuthenticated());
    
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [displayState, setDisplayState] = useState(null);
    const [selectedBid, setSelectedBid] = useState(null);
    const [projectDisplay, setProjectDisplay] = useState(false);
    const [message, setMessage] = useState("");

    const reference = ref(db, "projects/");
    // const admin_ref = ref(db, "admin/");

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update the current time every second
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
            console.log("Callinggggg at " + new Date() + " " + selectedProject);
            if(selectedProject) {
                checkDateTime(selectedProject.projectName);
            }
        }, 10000);
        return () => clearInterval(intervalId);
    }, [selectedProject]);

    // const [time, setTime] = useState(null);
    var condition = false;
    var scheduled_time = "";
    var start_time = "";
    var end_time = "";
    const checkDateTime = (project_name) => {
        const admin_ref = ref(db, "admin/" + project_name);
        console.log("Check Date and Time");
        const currTime = new Date();
        onValue(admin_ref, (snapshot) => {
            if (snapshot.exists()) {
                const time_data = snapshot.val();
                console.log(JSON.stringify(time_data));
                const today = new Date();
                const comp = new Date(2023, 12, 23, 12, 30, 45);
                console.log(currTime.toLocaleDateString() + " " + currTime.toLocaleTimeString());
                console.log(time_data.date + " " + time_data.start_time + " " + time_data.end_time);
                console.log("Boolean check " + (currTime.toLocaleDateString() < time_data.date) + " " + (currTime.toLocaleTimeString() < time_data.start_time));
                scheduled_time = time_data.date + " between " + time_data.start_time + " & " + time_data.end_time;
                start_time = time_data.start_time;
                end_time = time_data.end_time;
                setMessage(scheduled_time);
                if (currTime.toLocaleDateString() === time_data.date) {
                    if (currTime.toLocaleTimeString() >= time_data.start_time) {
                        console.log("Correct");
                        setProjectDisplay(true);
                    }
                    if (currTime.toLocaleTimeString() >= time_data.end_time) {
                        console.log("Not Correct");
                        setProjectDisplay(false);
                    }
                }
            }
        });
    }
    
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
    }, [selectedProject]); // Run this effect whenever selectedProject changes

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

    const handleProjectSelect = (project) => {
        console.log("Project selected " + JSON.stringify(project));
        setSelectedProject(project);
        setProjectDisplay(false);
        if (project) {
            checkDateTime(project.projectName);
        }
        setDisplayState(null);
    };

    return (
        <>
            <NavbarSimple />
                <>
                    <SelectBasic
                        options={projects}
                        onChange={handleProjectSelect}
                        value={selectedProject}
                        labelKey="projectName"
                    />
                    {projectDisplay ? (displayState && Object.keys(displayState).map((key) => ( 
                        (<div key={key} className='flex justify-center'>
                        <CardSimple handleChange={handleChange} handleUpdate={handleUpdate} uid={key} data={displayState[key]} flag={displayState[key].uid !== auth.currentUser.uid} />
                        </div>
                        )
                    ))): (selectedProject && <>
                    <div className='flex justify-center h-screen'>
                        <h3>Scheduled time : {message}</h3>
                    </div></>)} 
                </>      
            {/* {displayState && <CardSimple value={JSON.stringify(displayState)} />} */}
        </>
    );
};

export default Home;
