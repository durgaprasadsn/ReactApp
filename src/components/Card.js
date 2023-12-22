import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { auth } from '../services/firebase';
import Input from './Input';

export default function CardSimple({ uid, data, flag }) {
    // console.log("Card Simple " + value);
  return (
    <Card className="bg-white rounded-lg overflow-auto shadow-md p-6 mb-4 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
      
      <CardContent>
        <div>
            <Typography variant="body2" color="text.secondary">
                UID: {uid}
            </Typography>
            {!flag && Object.entries(data).map(([key, value]) => (
                <Typography variant="body2" color="text.secondary" key={key}>
                Check {key}: {value}
                </Typography>
            ))}
            {flag && Object.entries(data).map(([key, value]) => (
                <Typography variant="body2" color="text.secondary" key={key}>
                {key}: {value}
                </Typography>
            ))}
            
        </div>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}