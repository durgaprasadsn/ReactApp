import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function DatePickerCustom({ label, selectedDate, onDateChange }) {
    // const customdate = dayjs("12/12/2010");
    // console.log("Date Picker value " + label + " " + selectedDate);
    return (
        <div className="flex justify-center items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                        id='date_element'
                        value={selectedDate}
                        onChange={(date) => onDateChange(date)}
                        label={label}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}

