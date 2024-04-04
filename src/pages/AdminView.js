import React, { useState, useEffect } from 'react';
import NavbarSimple from '../components/Navbar';
import CardSimple from '../components/Card';
import SelectBasic from '../components/DropDown';
import { ref, onValue, update, get, child } from '@firebase/database';
import { auth, db } from '../services/firebase';
import moment from 'moment';
import AdminNavbarSimple from '../components/AdminNavbar';
const AdminView = () => {
    // console.log("Check Authentication " + isAuthenticated());
    
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [displayState, setDisplayState] = useState(null);
    const [selectedBid, setSelectedBid] = useState(null);
    const [projectDisplay, setProjectDisplay] = useState(false);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState(null);

    const reference = ref(db, "projects/");
    // const admin_ref = ref(db, "admin/");
    
    const current = moment();
    const [currentTime, setCurrentTime] = useState(current.format('HH:mm'));
    const [currentDate, setCurrentDate] = useState(current.format('YYYY-MM-DD'));

    useEffect(() => {
        // Update the current time every second
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
            const currentDate = moment();
            setCurrentDate(currentDate.format('YYYY-MM-DD'));
            setCurrentTime(currentDate.format('HH:mm'));
            // console.log(formattedDate + " " + formattedTime);
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
                // console.log(currTime.toLocaleDateString() + " " + currTime.toLocaleTimeString());
                console.log(time_data.date + " " + time_data.start_time + " " + time_data.end_time);
                console.log("Boolean check " + (currentDate < time_data.date) + " " + (currentTime < time_data.start_time));
                scheduled_time = time_data.date + " between " + time_data.start_time + " & " + time_data.end_time;
                start_time = time_data.start_time;
                end_time = time_data.end_time;
                setMessage("Scheduled time : " + scheduled_time);
                if (currentDate === time_data.date) {
                    if (currentTime >= time_data.start_time) {
                        console.log("Correct");
                        setProjectDisplay(true);
                    }
                    if (currentTime >= time_data.end_time) {
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

        const users_ref = ref(db, "users/");
        onValue(users_ref, (snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                console.log("Users present in db " + JSON.stringify(users));
                setUsers(users);
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
                console.log("selected project here " + JSON.stringify(selectedProject) + JSON.stringify(selectedProject[0]));
                const ref_proj = ref(db, selectedProject.projectName);
                await onValue(ref_proj, (snapshot) => {
                    const data = snapshot.val()
                    if (!!data) {
                        console.log("Data here");
                        if (Object.entries(data).length > 0) {
                            console.log("Loggg " + JSON.stringify(data));
                            const bidArray = Object.entries(data).map(([key, value]) => ({
                                uid: key,
                                ...value,
                            }));
                            console.log("Bid Array " + JSON.stringify(bidArray));
                            const desiredUid = auth.currentUser.uid;
                            bidArray.sort((a, b) => (a.uid === desiredUid ? -1 : b.uid === desiredUid ? 1 : 0));
                            setDisplayState(bidArray);
                        } else {
                            setMessage("Nobody has registered yet");
                            setProjectDisplay(false);
                        }
                        
                    } else {
                        console.log("Check the value ehre ")
                        setMessage("Nobody has registered yet");
                        setProjectDisplay(false);
                    }
                });
                
                
            }
        };

        fetchData();

        // Cleanup function not required for this useEffect
    }, [selectedProject]); // Run this effect whenever selectedProject changes

    const handleProjectSelect = (project) => {
        console.log("Project selected " + JSON.stringify(project));
        setSelectedProject(project);
        setProjectDisplay(false);
        if (project) {
            checkDateTime(project.projectName);
        }
        setDisplayState(null);
        // if (project) {
        //     get(child(ref(db), project.projectName)).then((snapshot) => {
        //         if (snapshot.exists()) {
        //             console.log("Snapshot in get " + JSON.stringify(snapshot.val()));
        //             const data = snapshot.val();
        //             if (data.keys().length > 0) {
        //                 setMessage("User has not registered");
        //             }
        //         } else {
        //             console.log("Nobody has registered");
        //             setMessage("Nobody has registered");
        //         }
        //     });
        // }
    };

    return (
        <>
            <AdminNavbarSimple />
                <>
                    <SelectBasic
                        options={projects}
                        onChange={handleProjectSelect}
                        value={selectedProject}
                        labelKey="projectName"
                    />
                    {projectDisplay ? (displayState && Object.keys(displayState).map((key) => ( 
                        (<>
                            <div className='flex justify-center'>
                                <p>{users[displayState[key]['uid']]['companyName']}</p>
                            </div>
                            <div key={key} className='flex justify-center'>
                                <CardSimple selectedProject={selectedProject} data={displayState[key]} flag={displayState[key].uid !== auth.currentUser.uid} />
                            </div>
                        </>
                        )
                    ))): (selectedProject &&  message && <>
                    <div className='flex justify-center h-screen'>
                        <h3>{message}</h3>
                    </div></>)} 
                </>      
            {/* {displayState && <CardSimple value={JSON.stringify(displayState)} />} */}
        </>
    );
};

export default AdminView;
