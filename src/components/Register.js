import React, { useState, useEffect } from 'react';
import NavbarSimple from './Navbar';
import SelectBasic from './DropDown';
import { auth, db } from '../services/firebase';
import { onValue, ref, get, child, update } from '@firebase/database';
import { insert, onValueFromDB } from '../services/authService';
import Input from './Input';
import { ButtonDefault } from './Button';
import { Button } from '@mui/material';
import { Alert } from '@mui/material';

const Register = () => {
    // State to store the fetched data
    const [registerState, setRegisterState] = useState({});
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);

    const handleChange=(e)=>{
        setRegisterState({...registerState,[e.target.id]:e.target.value})
    }
    const reference = ref(db, "projects/");
    
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
    // onValue(reference, (snapshot) => {
    //     const dataFromDB = snapshot.val();
    //     if (!!dataFromDB) {
    //         // console.log(data);
    //         setData(dataFromDB);
    //         for (const [key, value] of Object.entries(dataFromDB)) {
    //             console.log(key, value);
    //         }
    //     } else {
    //         console.log("Data not found");
    //     }
    // })

    // Function to handle project selection
  const handleProjectSelect = (project) => {
    console.log("Project selected " + JSON.stringify(project));
    console.log(registerState);
    setSelectedProject(project);
  };

  // Function to update project details
  const handleUpdate = async () => {
    if (selectedProject) {
        console.log(registerState);
        console.log("On Click of Update " + selectedProject.projectName + " " + auth.currentUser.uid);
        // const projectRef = ref(db, `${selectedProject.projectName}/${auth.currentUser.uid}`);
        const path_update = "ProjectBids/" + selectedProject.projectName + "/" + auth.currentUser.uid;
        const updates = {}
        updates[path_update] = registerState;
        update(ref(db), updates).then( () => {
            console.log("SUCCESS");
            setSuccessAlertVisible(true);
            // setRegisterState({});
            // setSelectedProject(null);
          } ) .catch((error) => {
            console.log(error)
          } )
        // Update the project details in the database
    //   update(projectRef, {
    //     bid_amount: selectedProject.bid_amount,
    //     company_name: selectedProject.company_name,
    //     owner_name: selectedProject.owner_name,
    //   }).then(() => {
    //     console.log(`Project ${selectedProject.projectName} updated successfully!`);
    //   }).catch((error) => {
    //     console.error('Error updating project:', error);
    //   });
    }
  };
    // TO DO Learn DB onValue from firebase
    // const dataFromDB = onValueFromDB("projects/");
    // console.log("Data " + dataFromDB);

    // const value = getFromDB("projects/");
    // console.log("Value here " + value);

    // get(child(ref(db), 'projects/')).then((snapshot) => {
    //     if (snapshot.exists()) {
    //       let data = snapshot.val();
    //       console.log(data);
    //     } else {
    //       console.log("Data not available");
    //     }
    //   }).catch((error) => {
    //     console.error(error);
    //   });
  return (<>
      <NavbarSimple />
      {/* Dropdown to select a project */}
      <SelectBasic
        options={projects}
        onChange={handleProjectSelect}
        value={selectedProject}
        labelKey="projectName"
      />

      {/* Input fields to update project details */}
      {selectedProject && (
        <div>
            <br></br>
          {/* <h2>{selectedProject.projectName}</h2> */}
          {/* Dynamically generate input fields based on keys */}
          {Object.keys(selectedProject).map((key, value) => (
            key !== "projectName" && (<div key={key}>
              <Input
                            key={key}
                            handleChange={handleChange}
                            // value={selectedProject[key]}
                            labelText={key}
                            labelFor={key}
                            id={key}
                            name={key}
                            // type={Text}
                            isRequired={true}
                            placeholder={key}
                            />
              {/* <input
                type="text"
                value={selectedProject[key]}
                onChange={(e) => setSelectedProject({
                  ...selectedProject,
                  [key]: e.target.value,
                })}
              /> */}
            </div>)
          ))}
          <Button variant="contained" onClick={handleUpdate}>Update Project</Button>
        </div>
      )}
      {isSuccessAlertVisible && (
        <Alert severity="success">
          {/* <AlertTitle>Success</AlertTitle> */}
          Successfully Updated.
        </Alert>)}
      </>
  );
};

export default Register;