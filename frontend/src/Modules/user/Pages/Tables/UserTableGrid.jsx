import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import Table from './UserTable';
import UserTableModal from './TableModal';
import theme from '../../../../Theme/theme';
import moment from 'moment';
import { AuthContext } from '../../../GlobalContext';

const TableGrid = ({ reservation }) => {
    const { token,tables, openuserTable, setOpenuserTable, setSelectedTable, acceptedreq } = useContext(AuthContext);
    const navigate = useNavigate();

    const getDisabledTables = () => {
        // Convert reservation time to a Date object
        const parseTime = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return new Date().setHours(hours, minutes, 0, 0); // Today’s date with given time
        };
        const reservationTime = parseTime(reservation.time);
        return acceptedreq
            .filter(req => {
                const reqTime = parseTime(req.reservation.time);
                const timeDifference = Math.abs(reqTime - reservationTime);
                const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
                // Check if the reservation is on the same date and within 1 hour range
                return req.reservation.date === reservation.date && timeDifference <= oneHourInMs;
            })
            .map(req => req.table);
    };

    const disabledTableIds = getDisabledTables();
    const onTableClick = (selectedTable) => {
        if(token){
            setSelectedTable(selectedTable);
            setOpenuserTable(true);
           }else{
             navigate('/login')
           }
       
    };

    const handleClose = () => {
        setOpenuserTable(false);
        setSelectedTable(null);
    };

    return (
        <>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {tables?.length === 0 ? (
                    <Typography variant="h2" sx={{ color: "grey", pl: 4 }}>
                        No table found
                    </Typography>
                ) : (
                    tables?.map((table, index) => {
                        const createdDate = moment(table?.createdAt).format('ddd DD YYYY');
                        const isDisabled = disabledTableIds.includes(table._id);
                        return (
                            <Grid item xs={10} sm={3} md={3} lg={3} key={index}>
                                <Table
                                    name={table?.name}
                                    seats={table?.seats}
                                    theme={theme}
                                    onClick={() => !isDisabled && onTableClick(table)}
                                    createDate={createdDate}
                                    disabled={isDisabled}
                                />
                            </Grid>
                        );
                    })
                )}
            </Grid>
            <UserTableModal
                open={openuserTable}
                onClose={handleClose}
                reservation={reservation}
            />
        </>
    );
};

export default TableGrid;
