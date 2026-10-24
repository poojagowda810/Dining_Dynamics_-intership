import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material';
import DeliveryDashboard from '../DeliveryDashboard';
import DeliveryOrders from '../Pages/Orders';

export default function DeliveryRoute() {
    const deliveryToken = sessionStorage.getItem('deliveryToken');
    if (!deliveryToken || deliveryToken === "null" || deliveryToken === "undefined") {
        return <Navigate to="/delivery/login" replace />;
    }

    return (
        <Box>
            <Routes>
                <Route exact path="/" element={<DeliveryOrders />} />
                <Route exact path="/dashboard" element={<DeliveryDashboard />} />
            </Routes>
        </Box>
    );
}
