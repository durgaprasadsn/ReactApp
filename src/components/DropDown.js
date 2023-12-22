import React, { useState, useRef } from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';

export default function SelectBasic({ options, value, onChange, labelKey }) {
  const [val, setValue] = useState(value);
  const action = useRef(null);
  function operation(e, newValue) {
    console.log("Selected Project " + e, options[e.target.selectedIndex]);
    setValue(newValue);
    onChange(newValue);
  }
  return (
    <Select
      action={action}
      value={val}
      placeholder="Select a Project"
      onChange={(e, newValue) => operation(e, newValue)}
      {...(value && {
        // When the user has selected a value, the button is displayed, and the select indicator is removed.
        endDecorator: (
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onMouseDown={(event) => {
              // stops the popup from appearing when this button is clicked
              event.stopPropagation();
            }}
            onClick={() => {
            //   setValue(null);
              action.current?.focusVisible();
            }}
          >
            <CloseRounded />
          </IconButton>
        ),
        // indicator: null,
      })}
      sx={{ minWidth: 50 }}
    >
    <Option value={null}>Select a Project</Option>
    {options.map((option, index) => (
    <Option key={index} value={option}>
        {option[labelKey]}
    </Option>
    ))}
      {/* <Option value="tesla">Tesla</Option>
      <Option value="bmw">BMW</Option>
      <Option value="bentley">Bentley</Option>
      <Option value="bugatti">Bugatti</Option> */}
    </Select>
  );
}