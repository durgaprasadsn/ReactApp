import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { insert } from '../services/authService';

const DynamicForm = () => {
  const [formFields, setFormFields] = useState([{ id: 1, value: '' }]);

  const addFormField = () => {
    const newField = { id: formFields.length + 1, value: '' };
    setFormFields([...formFields, newField]);
  };

  const removeFormField = (id) => {
    const updatedFields = formFields.filter((field) => field.id !== id);
    setFormFields(updatedFields);
  };

  const handleInputChange = (id, value) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setFormFields(updatedFields);
  };

  const handleSubmit = () => {
    // Perform actions to store the form data, e.g., send to an API
    console.log('Form Data:', JSON.stringify(formFields));
    const newSet = {};
    const projectName = document.getElementById('project_name').value;
    for (const [key, value] of Object.entries(formFields)) {
        console.log("Key and Value " + key + " " + value.value);
        newSet[value.value] = "";
    }
    const status = insert("projects/" + projectName, newSet);
    console.log("Status " + status);
    
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded">
        <div>
        <TextField
            id="project_name"
            label={'Project Name'}
            variant="outlined"
            fullWidth
            />
        </div>
        <br></br>
      {formFields.map((field) => (
        <div key={field.id} className="flex items-center space-x-2 mb-4">
            <div>
          <TextField
            label={`Field ${field.id}`}
            variant="outlined"
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
          />
          </div>
          <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => removeFormField(field.id)}
            startIcon={<RemoveIcon />}
          >
            Remove
          </Button>
          </div>
        </div>
      ))}
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={addFormField}
        startIcon={<AddIcon />}
        className="mb-4"
      >
        Add Field
      </Button>
      </div>
      <br></br>
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={formFields.length === 0}
      >
        Submit
      </Button>
      </div>
    </div>
  );
};

export default DynamicForm;
