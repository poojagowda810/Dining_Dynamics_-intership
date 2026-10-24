import React, { useContext, useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Backdrop,
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../../GlobalContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import scanner from "../../Images/Scanner.png"
import { useNavigate } from 'react-router-dom';

const CheckoutModal = ({ }) => {
    const { 
        checkoutModalOpen, setCheckoutModalOpen, handleDrawerClose, 
        setCartCount, host, user, proceedDetail, setProceedDetail, 
        selectedProductItem, checkoutItems, setCheckoutItems, 
        removeFromCheckout, updateCheckoutQuantity 
    } = useContext(AuthContext);
    const [step, setStep] = useState('summary'); // 'summary', 'form', 'method', or 'payment'
    const [transactionId, setTransactionId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();

    const onClose = () => {
        setCheckoutModalOpen(false);
        setStep('summary');
        setTransactionId('');
    };

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        if (user && checkoutModalOpen) {
            setFormData({
                name: user.name || '',
                address: user.address || '',
                phone: user.phone || '',
                email: user.email || '',
                city: '', // Users might not have city/zip in profile usually
                postalCode: ''
            });
        }
    }, [user, checkoutModalOpen]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        // Safely check fields by casting to String in case they are numeric (like phone)
        const name = String(formData.name || '').trim();
        const address = String(formData.address || '').trim();
        const phone = String(formData.phone || '').trim();
        const email = String(formData.email || '').trim();
        const city = String(formData.city || '').trim();
        const postalCode = String(formData.postalCode || '').trim();

        if (!name) newErrors.name = 'Name is required';
        if (!address) newErrors.address = 'Address is required';
        
        if (!phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Phone must be 10 digits';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!city) newErrors.city = 'City is required';
        if (!postalCode) newErrors.postalCode = 'Zip code is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOrder = (status, method, tid) => {
        let selectedProducts = checkoutItems.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            image: item.image,
        }))

        const totalAmount = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const Data = {
            status,
            products: proceedDetail?.items || selectedProducts,
            user: user?._id,
            formData: formData,
            totalamount: proceedDetail?.totalAmount || totalAmount,
            method: method,
            transactionId: tid
        };

        const token = JSON.parse(localStorage.getItem('userToken'));
        axios.post(`${host}/api/user/addRequest`, Data, { headers: { 'auth-token': token } })
            .then((res) => {
                if (res.data.success) {
                    const orderId = res.data.orderId;
                    toast.success('Order placed successfully! 🎉');
                    // Navigate FIRST before closing/cleanup to avoid unmount issues
                    setTimeout(() => {
                        setCheckoutModalOpen(false);
                        setFormData({});
                        setProceedDetail({});
                        setCheckoutItems([]);
                        setCartCount((prev) => prev + 1);
                        handleDrawerClose();
                        navigate(`/track-order/${orderId}`);
                    }, 500);
                } else {
                    toast.error(res.data.message || 'Failed to place order');
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to place order. Please try again.');
            });
    };


    const handleProceedToPayment = () => {
        if (validate()) {
            setStep('method');
        } else {
            toast.error('Please fix the errors in the form before proceeding.');
        }
    };

    const handleProceedFromSummary = () => {
        const token = localStorage.getItem('userToken');
        if (token && token !== "null" && token !== "undefined") {
            setStep('method');
        } else {
            setStep('form');
        }
    }

    const handleSelectMethod = (method) => {
        setPaymentMethod(method);
        if (method === 'online') {
            setStep('payment');
        } else {
            handleOrder('pending', 'cash on delivery', '');
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Modal
                open={checkoutModalOpen}
                onClose={onClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                sx={{ zIndex: 1200 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 450 },
                        bgcolor: 'background.paper',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        p: 4,
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                            {step === 'summary' ? 'Order Summary' : (step === 'form' ? 'Checkout' : (step === 'method' ? 'Payment Method' : 'Submit Payment'))}
                        </Typography>
                        <IconButton onClick={onClose} sx={{ color: '#9ca3af' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {step === 'summary' ? (
                        <Box sx={{ pb: 2 }}>
                            <Stack spacing={3}>
                                {checkoutItems.length > 0 ? (
                                    checkoutItems.map((item) => (
                                        <Box key={item._id} sx={{ 
                                            display: 'flex', 
                                            gap: 2, 
                                            p: 2, 
                                            bgcolor: '#f9fafb', 
                                            borderRadius: '16px',
                                            border: '1px solid #f3f4f6',
                                            position: 'relative'
                                        }}>
                                            <img 
                                                src={`${host}/api/image/${item.image}`} 
                                                alt={item.name} 
                                                style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{item.name}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                    <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 700 }}>₹{item.price * item.quantity}</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => updateCheckoutQuantity(item._id, -1)}
                                                            sx={{ border: '1px solid #e5e7eb', borderRadius: '6px', p: 0.5 }}
                                                        >
                                                            -
                                                        </IconButton>
                                                        <Typography variant="body2" sx={{ fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</Typography>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => updateCheckoutQuantity(item._id, 1)}
                                                            sx={{ border: '1px solid #e5e7eb', borderRadius: '6px', p: 0.5 }}
                                                        >
                                                            +
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            onClick={() => removeFromCheckout(item._id)}
                                                            sx={{ ml: 1, color: '#ef4444' }}
                                                        >
                                                            <CloseIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body1" sx={{ color: '#9ca3af' }}>Your order list is empty.</Typography>
                                        <Button onClick={onClose} sx={{ mt: 2, textTransform: 'none', color: '#6366f1', fontWeight: 700 }}>Back to Menu</Button>
                                    </Box>
                                )}

                                {checkoutItems.length > 0 && (
                                    <>
                                        <Box sx={{ borderTop: '1px dashed #e5e7eb', pt: 2, mt: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle1" sx={{ color: '#6b7280', fontWeight: 600 }}>Grand Total</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 900, color: '#111827' }}>
                                                    ₹{checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={2}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleProceedFromSummary}
                                                sx={{ 
                                                    py: 1.5, 
                                                    borderRadius: '12px', 
                                                    fontWeight: 700, 
                                                    textTransform: 'none',
                                                    bgcolor: '#6366f1',
                                                    '&:hover': { bgcolor: '#4f46e5' }
                                                }}
                                            >
                                                Proceed to Checkout
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={onClose}
                                                sx={{ 
                                                    py: 1.2, 
                                                    borderRadius: '12px', 
                                                    fontWeight: 700, 
                                                    textTransform: 'none',
                                                    borderColor: '#e5e7eb',
                                                    color: '#6b7280',
                                                    '&:hover': { borderColor: '#d1d5db', bgcolor: '#f9fafb' }
                                                }}
                                            >
                                                Add More Items
                                            </Button>
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    ) : step === 'form' ? (
                        <>
                            <Stack spacing={2}>
                                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} />
                                <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} />
                                <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} />
                                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} />
                                    <TextField fullWidth label="Zip" name="postalCode" value={formData.postalCode} onChange={handleChange} error={!!errors.postalCode} helperText={errors.postalCode} />
                                </Box>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleProceedToPayment}
                                    sx={{ 
                                        py: 1.5, 
                                        borderRadius: '12px', 
                                        fontWeight: 700, 
                                        fontSize: '1rem', 
                                        textTransform: 'none',
                                        bgcolor: '#6366f1',
                                        '&:hover': { bgcolor: '#4f46e5' }
                                    }}
                                >
                                    Proceed to Payment
                                </Button>
                            </Stack>
                        </>
                    ) : step === 'method' ? (
                        <Box sx={{ pb: 2 }}>
                            <Typography variant="body1" sx={{ color: '#4b5563', mb: 4, textAlign: 'center' }}>
                                Excellent choice! How would you like to settle your bill today?
                            </Typography>
                            <Stack spacing={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleSelectMethod('online')}
                                    sx={{ 
                                        py: 2.5, 
                                        borderRadius: '18px', 
                                        border: '2px solid #6366f1',
                                        color: '#6366f1',
                                        fontWeight: 800, 
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        '&:hover': { border: '2px solid #4f46e5', bgcolor: 'rgba(99, 102, 241, 0.05)' }
                                    }}
                                >
                                    Pay Online (QR Scan)
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleSelectMethod('cash on delivery')}
                                    sx={{ 
                                        py: 2.5, 
                                        borderRadius: '18px', 
                                        border: '2px solid #10b981',
                                        color: '#10b981',
                                        fontWeight: 800, 
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        '&:hover': { border: '2px solid #059669', bgcolor: 'rgba(16, 185, 129, 0.05)' }
                                    }}
                                >
                                    Cash on Delivery
                                </Button>
                                <Button 
                                    fullWidth 
                                    onClick={() => setStep('form')}
                                    sx={{ mt: 2, color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}
                                >
                                    Back to Details
                                </Button>
                            </Stack>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                                Scan the QR code below and enter your Transaction ID to confirm your meal.
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: '#f3f4f6', borderRadius: '16px', mb: 3 }}>
                                <img src={scanner} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block', margin: '0 auto' }} />
                            </Box>
                            <TextField
                                fullWidth
                                placeholder="Enter 10-digit Transaction ID"
                                value={transactionId}
                                label="Transaction ID"
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setTransactionId(val);
                                }}
                                error={transactionId.length > 0 && transactionId.length !== 10}
                                helperText={transactionId.length > 0 && transactionId.length !== 10 ? "Must be exactly 10 digits" : ""}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                autoFocus
                                inputProps={{ maxLength: 10 }}
                            />
                            <Stack direction="row" spacing={2}>
                                <Button fullWidth variant="outlined" onClick={() => setStep('form')} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>Back</Button>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    disabled={transactionId.length !== 10}
                                    onClick={() => handleOrder('pending', 'online', transactionId)}
                                    sx={{ 
                                        borderRadius: '12px', 
                                        textTransform: 'none', 
                                        fontWeight: 700,
                                        bgcolor: transactionId.length === 10 ? '#6366f1' : '#cbd5e1',
                                        '&:hover': { bgcolor: '#4f46e5' }
                                    }}
                                >
                                    Confirm Payment
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default CheckoutModal;