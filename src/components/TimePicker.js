import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { StaticTimePicker } from '@mui/x-date-pickers';

export default function BasicTimePicker({ label, selectedTime, onTimeChange }) {
    // console.log("TIme in time picker " + selectedTime + " " + dayjs(selectedTime, "HH:mm").toISOString());
    if (selectedTime) {
      selectedTime = dayjs(selectedTime, "HH:mm");
    }
    
    // console.log(dayjs(selectedTime).format("HH:mm:ss"))
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker 
            label={label}
            value={selectedTime}
            onChange={(time) => onTimeChange(time)} />
      </DemoContainer>
    </LocalizationProvider>
  );
}