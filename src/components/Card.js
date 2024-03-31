import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { ref, onValue, update } from '@firebase/database';
import { auth, db } from '../services/firebase';
import { Alert } from '@mui/material';

export default function CardSimple({ selectedProject, data, flag }) {
    // console.log("Card Simple " + handleChange + " " + handleUpdate);
    // console.log("Data recevied in card simple " + JSON.stringify(data) + " " + uid + " " + flag);
    const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
    const [registerState, setRegisterState] = useState({});
    const [updatedState, setUpdatedState] = useState(false);
    
    const handleChange = (e) => {
      e.preventDefault();
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
      console.log("Check the updated value " + JSON.stringify(tempProject));
    }

    

    const handleUpdate=(e)=>{
      console.log("Handle Update");
      e.preventDefault();
      // console.log(cardState + " " + selectedProject.projectName + " " + auth.currentUser.uid);
      const path_update = selectedProject.projectName + "/" + auth.currentUser.uid;
      
      const mergedObject = {
          ...data,
          ...registerState
        };
      delete mergedObject.uid;
      console.log("Merged object " + JSON.stringify(mergedObject));
      const updates = {}
      updates[path_update] = mergedObject;

      update(ref(db), updates).then( () => {
          console.log("SUCCESS");
          setUpdatedState(true);
          setInterval(() => {
            setUpdatedState(false);
          }, 2000);
        } ) .catch((error) => {
          console.log(error)
        } )
    }

  return (
    <>
    <Card className="bg-white rounded-lg overflow-auto shadow-md p-6 mb-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      
      <CardContent>
        <div>
          
            {!flag && Object.entries(data).map(([key, value]) => (
                key !== 'uid' &&
                <>
                {updatedState && <div className='flex justify-center'>
                  <p style={{ color: 'green' }}>Successfully Updated</p>
                </div>}
                <Typography className="py-1.5" variant="body2" color="text.secondary" key={key}>
                  <div className="flex justify-center py-1.5">
                    <TextField
                      id={key}
                      onChange={handleChange}
                      label={value["Item"]}
                      defaultValue={value[value["Item"]]}
                      />
                      <div className='flex items-center'>
                        <p>{' '} X {value["Qty"]} {value["Unit"]}</p>
                        <p>
                            {'.  '}Total{' '}
                            {registerState[key] && registerState[key]['Total']
                        ? registerState[key]['Total']
                        : 0}
                        </p>
                      </div>
                  </div>
                  <br></br>
                </Typography>
                </>
            ))}
            {flag && Object.entries(data).map(([key, value]) => (
                key !== 'uid' &&
                <Typography variant="body2" color="text.secondary" key={key}>
                {value["Item"]}: {value[value["Item"]]}
                </Typography>
            ))}
            
        </div>
      </CardContent>
      {!flag && 
      <CardActions>
        <Button id="btn" type="submit" variant="contained" size="small" onClick={handleUpdate}>Update</Button>
      </CardActions>}
    </Card>
    {isSuccessAlertVisible && (
      <p severity="success">
      {/* <AlertTitle>Success</AlertTitle> */}
      Successfully Updated.
      </p>)}
    </>
  );
}