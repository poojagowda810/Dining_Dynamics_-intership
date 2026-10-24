import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Table = ({ name, seats, theme, onClick, createDate, disabled }) => (
    <Paper
        onClick={() => !disabled && onClick()} // Disable click functionality if disabled
        elevation={0}
        sx={{
            p: 2,
            color: '#fff',
            boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.1)',
            borderRadius: '15px',
            position: 'relative',
            backgroundColor: disabled ? 'lightgrey' : theme?.palette?.background?.default, // Adjust background color if disabled
            cursor: disabled ? 'not-allowed' : 'pointer', // Change cursor if disabled
            opacity: disabled ? 0.6 : 1, // Adjust opacity if disabled
        }}
    >
        <Typography variant="h5" sx={{ color: theme?.palette?.text?.main, fontSize: "29px", overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <EventSeatIcon sx={{ color: theme?.palette?.text?.secondary, mr: 1 }} />
            <Typography variant="body1" sx={{ color: theme?.palette?.text?.secondary }}>
                {seats}
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <AccessTimeIcon sx={{ color: theme?.palette?.text?.secondary, mr: 1, fontSize: '14px' }} />
            <Typography variant="body1" sx={{ color: theme?.palette?.text?.secondary, fontSize: '14px' }}>
                {createDate}
            </Typography>
        </Box>
        {disabled && (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '15px',
                }}
            >
                <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                    Reserved
                </Typography>
            </Box>
        )}
    </Paper>
);

export default Table;
