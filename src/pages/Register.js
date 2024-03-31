import React, { useState, useEffect } from 'react';
import NavbarSimple from '../components/Navbar';
import SelectBasic from '../components/DropDown';
import { auth, db } from '../services/firebase';
import { onValue, ref, update } from '@firebase/database';
import TextField from '@mui/material/TextField';
import Input from '../components/Input';
import { Button } from '@mui/material';
import { Alert } from '@mui/material';
import { select } from '@material-tailwind/react';

const Register = () => {
    // State to store the fetched data
    const [registerState, setRegisterState] = useState({});
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);

    const handleChange=(e)=>{
      
      const tempProject = {};
      const key = e.target.id;
      console.log("Check " + selectedProject[key]["Item"]);
      tempProject["Item"] = selectedProject[key]["Item"];
      tempProject["Qty"] = selectedProject[key]["Qty"];
      tempProject["Unit"] = selectedProject[key]["Unit"];
      tempProject[selectedProject[key]["Item"]] = e.target.value;
      const total = selectedProject[key]["Qty"] * e.target.value;
      tempProject['Total'] = total;
      setRegisterState({...registerState, [key]:tempProject});

      console.log("handle change " + JSON.stringify(tempProject));
      // const updatedRegisterState = { ...registerState }; // Create a copy to avoid mutation
      //   updatedRegisterState[e.target.id] = e.target.value;
      //   setRegisterState(updatedRegisterState);

      //   // Calculate and update the total (assuming selectedProject is available)
      //   if (selectedProject) {
      //       const key = e.target.id; // Get the key from the target id
      //       const qty = selectedProject[key]["Qty"]; // Access the quantity from selectedProject
      //       const total = qty * updatedRegisterState[key]; // Calculate the total
      //       updatedRegisterState[key + 'Total'] = total; // Add the total to the state with a suffix
      //   }
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

    // Function to handle project selection
  const handleProjectSelect = (project) => {
    console.log("Project selected " + JSON.stringify(project));
    console.log(registerState);
    setSelectedProject(project);
    // console.log("Project name and user id " + project.projectName + " " + auth.currentUser.uid)
    if (project) {
      const checkRegistration = ref(db, project.projectName + '/' + auth.currentUser.uid)
      onValue(checkRegistration, (snapshot) => {
        const dataFromDB = snapshot.val();
        if (!!dataFromDB) {
          console.log("Project is already registered " + JSON.stringify(dataFromDB));
          // TO DO Make sure to change this back to false once the testing is done
          setIsRegistered(true);
        } else {
          console.log("Data not found");
          setIsRegistered(true);
        }
      });
    }
    
    setRegisterState({});
    setSuccessAlertVisible(false);
  };

  // Function to update project details
  const handleUpdate = async () => {
    if (selectedProject) {
        console.log(registerState);
        console.log("On Click of Update " + selectedProject.projectName + " " + auth.currentUser.uid);
        // const projectRef = ref(db, `${selectedProject.projectName}/${auth.currentUser.uid}`);
        const path_update = selectedProject.projectName + "/" + auth.currentUser.uid;
        const updates = {}
        updates[path_update] = registerState;
        update(ref(db), updates).then( () => {
            console.log("SUCCESS");
            setSuccessAlertVisible(true);
            // setRegisterState({});
            setSelectedProject(null);
          } ) .catch((error) => {
            console.log(error)
          } )
    }
  };
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
      {selectedProject && isRegistered && (
        <div>
            <br></br>
          {/* <h2>{selectedProject.projectName}</h2> */}
          {/* Dynamically generate input fields based on keys */}
          {selectedProject && Object.keys(selectedProject).map((key, value) => (
            key !== "projectName" && 
            (<>
            <div className="flex justify-center py-1.5" key={key}>
              <TextField
                id={key}
                label={selectedProject[key]["Item"] + " Rate"}
                variant="outlined"
                onChange={handleChange}
                inputProps={{ type: 'number' }}
              />
              <div className='flex items-center'>
                <p>{' '} X {selectedProject[key]["Qty"]} {selectedProject[key]["Unit"]}</p>
                <p>
                    {'.  '}Total{' '}
                    {registerState[key] && registerState[key]['Total']
                ? registerState[key]['Total']
                : 0}
                </p>
              </div>
            </div>
             
            
            </>)
          ))}
          <div className="flex justify-center">
            <Button variant="contained" onClick={handleUpdate}>
              Update Project
            </Button>
          </div>
          {/* <Button className='mx-auto my-4 flex justify-center' variant="contained" onClick={handleUpdate}>Update Project</Button> */}
        </div>
      )}
      {!isRegistered && <>
      <div className="flex justify-center">
        You have already been registered for this project
      </div>
      </>}
      {isSuccessAlertVisible && (
        <Alert severity="success">
          {/* <AlertTitle>Success</AlertTitle> */}
          Successfully Updated.
        </Alert>)}
      </>
  );
};

export default Register;


{/* <Input
                key={selectedProject[key]["Item"]}
                handleChange={handleChange}
                // value={selectedProject[key]}
                labelText={selectedProject[key]["Item"]}
                labelFor={selectedProject[key]["Item"]}
                id={selectedProject[key]["Item"]}
                name={selectedProject[key]["Item"]}
                inputProps={{ type: 'number' }}
                isRequired={true}
                placeholder={selectedProject[key]["Item"]}
                /> */}