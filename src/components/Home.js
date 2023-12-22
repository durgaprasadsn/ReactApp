import React, { useState, useEffect } from 'react';
import NavbarSimple from './Navbar';
import CardSimple from './Card';
import SelectBasic from './DropDown';
import { ref, onValue } from '@firebase/database';
import { auth, db } from '../services/firebase';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [displayState, setDisplayState] = useState(null);
    const [selectedBid, setSelectedBid] = useState(null);

    const reference = ref(db, "projects/");
    const admin_ref = ref(db, "admin/");

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update the current time every second
        const intervalId = setInterval(() => {
        setCurrentTime(new Date());
        }, 10000);
        if(condition) {
            clearInterval(intervalId);
        }
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // const [time, setTime] = useState(null);
    var condition = false;
    var scheduled_time = "";
    onValue(admin_ref, (snapshot) => {
        if (snapshot.exists()) {
            const time_data = snapshot.val();
            console.log(JSON.stringify(time_data));
            const today = new Date();
            const comp = new Date(2023, 12, 23, 12, 30, 45);
            console.log(currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString());
            console.log(time_data.date + " " + time_data.start_time + " " + time_data.end_time);
            console.log("Boolean check " + (currentTime.toLocaleDateString() < time_data.date) + " " + (currentTime.toLocaleTimeString() < time_data.start_time));
            scheduled_time = time_data.date + " " + time_data.start_time;
            if (currentTime.toLocaleDateString() === time_data.date) {
                if (currentTime.toLocaleTimeString() >= time_data.start_time) {
                    console.log("Correct");
                    condition = true;
                }
                if (currentTime.toLocaleTimeString() >= time_data.end_time) {
                    console.log("Not Correct");
                    condition = false;
                }
            }
        }
    });
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
                        // console.log("Bid Array " + JSON.stringify(bidArray));
                        setDisplayState(bidArray);
                        console.log("Current User " + auth.currentUser.uid + " " + displayState);
                        Object.keys(bidArray).map((key) => {
                            console.log("Check the details " + bidArray[key].uid !== auth.currentUser.uid);
                        })
                        Object.entries(bidArray).map((key, value) => {
                            console.log("Check the details " + key[1]);
                        })
                    }
                });
                console.log(snapshot);
                
            }
        };

        fetchData();

        // Cleanup function not required for this useEffect
    }, [selectedProject]); // Run this effect whenever selectedProject changes

    const handleProjectSelect = (project) => {
        console.log("Project selected " + JSON.stringify(project));
        setSelectedProject(project);
    };

    return (
        <>
            <NavbarSimple />
            {condition ? (
                <>
                    <SelectBasic
                        options={projects}
                        onChange={handleProjectSelect}
                        value={selectedProject}
                        labelKey="projectName"
                    />

                    {displayState && Object.keys(displayState).map((key) => ( 
                        (<div key={key}>
                        <CardSimple uid={key} data={displayState[key]} flag={displayState[key].uid !== auth.currentUser.uid} />
                        </div>
                        )
                    ))} 
                </>
            ) : (<>
                <p>Scehduled at {scheduled_time}</p>
            </>
            )}         
            {/* {displayState && <CardSimple value={JSON.stringify(displayState)} />} */}
        </>
    );
};

export default Home;
