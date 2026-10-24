import React, { useContext, useState } from 'react';
import { Box, Button, Grid, Typography, TextField, Divider } from '@mui/material';
import TableGrid from './UserTableGrid';
import moment from 'moment';
import { AuthContext } from '../../../GlobalContext';
const MainTable = () => {
    const {reservation, setReservation}=useContext(AuthContext)
   
    const getCurrentDate = () => {
        return moment().format('YYYY-MM-DD');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 3, mt: 10, minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Reserve Your Table at Our Restaurant
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                    Discover the perfect table for your dining experience. Browse through our available tables below to find the ideal spot for your meal. Whether it's a cozy corner or a spacious area, we've got you covered. To reserve a table, simply select it from the list and follow the instructions.
                </Typography>
                <Grid container spacing={1} m={1} mt={5}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Select Date"
                            type="date"
                            value={reservation.date}
                            onChange={(e) => setReservation(prev => ({ ...prev, date: e.target.value }))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: getCurrentDate(), // Set minimum date to today's date
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Select Time"
                            type="time"
                            value={reservation.time}
                            onChange={(e) => setReservation(prev => ({ ...prev, time: e.target.value }))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} mt={2}>
                        <Typography variant="h3" sx={{ mb: 3 }}>
                            Checking for {moment(reservation.time, 'HH:mm').format('h:mm A')} on {moment(reservation.date).format('MMMM D, YYYY')}
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} mt={1}>
                        <TableGrid reservation={reservation} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MainTable;
