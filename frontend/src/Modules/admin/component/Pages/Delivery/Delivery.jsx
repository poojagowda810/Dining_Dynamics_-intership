import { 
    Box, 
    Typography, 
    Table, 
    TableBody, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    styled,
    Avatar,
    Stack,
    TextField,
    Button,
    Card,
    Grid,
    InputAdornment,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material';
import React, { useContext, useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { AuthContext } from '../../../../GlobalContext';
import { 
    EmailRounded, 
    PhoneRounded, 
    PersonRounded,
    LockRounded,
    DirectionsBikeRounded,
    AddRounded,
    DeleteRounded,
    BadgeRounded,
    ContentCopyRounded,
    CheckCircleOutlineRounded
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#f8fafc",
        color: "#475569",
        fontWeight: 700,
        fontSize: '0.85rem',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '1px solid #e2e8f0',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.9rem',
        textAlign: 'center',
        color: '#1e293b',
        padding: '16px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#f1f5f9',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function DeliveryManagement() {
    const { deliveryBoys, addDeliveryUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: ''
    });
    const [showCredentials, setShowCredentials] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Email and Password are required');
            return;
        }

        setLoading(true);
        const result = await addDeliveryUser(formData);
        if (result.success) {
            toast.success('Delivery Boy added successfully! 🛵');
            // Store credentials to show in modal before clearing form
            setShowCredentials({
                email: formData.email,
                password: formData.password,
                name: formData.name
            });
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                address: ''
            });
        } else {
            toast.error(result.message || 'Failed to add delivery boy');
        }
        setLoading(false);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard!');
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Toaster position="top-right" />
            
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                    Delivery Fleet
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Register and manage your delivery personnel.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Registration Form */}
                <Grid item xs={12} lg={4}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            borderRadius: '24px', 
                            border: '1px solid #e2e8f0',
                            position: 'sticky',
                            top: 100
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddRounded sx={{ color: '#6366f1' }} /> Add New Delivery Boy
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2.5}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PersonRounded sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="delivery@example.com"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><EmailRounded sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="10-digit number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PhoneRounded sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Operation Address"
                                    name="address"
                                    multiline
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="City or Area"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><BadgeRounded sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    type="submit"
                                    disabled={loading}
                                    sx={{ 
                                        py: 1.5, 
                                        borderRadius: '12px', 
                                        bgcolor: '#6366f1',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                                        '&:hover': { bgcolor: '#4f46e5' }
                                    }}
                                >
                                    {loading ? 'Processing...' : 'Register Delivery Boy'}
                                </Button>
                            </Stack>
                        </form>
                    </Card>
                </Grid>

                {/* Delivery List */}
                <Grid item xs={12} lg={8}>
                    <TableContainer 
                        component={Paper} 
                        elevation={0} 
                        sx={{ 
                            borderRadius: '24px', 
                            border: '1px solid #e2e8f0', 
                            overflow: 'hidden'
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Identity</StyledTableCell>
                                    <StyledTableCell>Contact</StyledTableCell>
                                    <StyledTableCell>Location</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deliveryBoys.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell colSpan={4} sx={{ py: 10 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <DirectionsBikeRounded sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                                                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>No delivery personnel found.</Typography>
                                            </Box>
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    deliveryBoys.map((boy) => (
                                        <StyledTableRow key={boy._id}>
                                            <StyledTableCell>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ bgcolor: '#f59e0b', width: 40, height: 40, borderRadius: '12px' }}>
                                                        <DirectionsBikeRounded />
                                                    </Avatar>
                                                    <Box sx={{ textAlign: 'left' }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{boy.name || 'Unnamed'}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>ID: {boy._id.slice(-6).toUpperCase()}</Typography>
                                                    </Box>
                                                </Stack>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Stack spacing={0.5} sx={{ textAlign: 'left' }}>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                        <EmailRounded sx={{ fontSize: 16, color: '#6366f1' }} /> {boy.email}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                                                        <PhoneRounded sx={{ fontSize: 14 }} /> {boy.phone || 'N/A'}
                                                    </Typography>
                                                </Stack>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography variant="body2" sx={{ color: '#64748b' }}>{boy.address || 'Not specified'}</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Tooltip title="Remove (Coming Soon)">
                                                    <IconButton size="small" sx={{ color: '#ef4444' }}>
                                                        <DeleteRounded />
                                                    </IconButton>
                                                </Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            {/* Credentials Modal */}
            <Dialog 
                open={Boolean(showCredentials)} 
                onClose={() => setShowCredentials(null)}
                PaperProps={{
                    sx: { borderRadius: '20px', p: 1, maxWidth: '400px', width: '100%' }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
                    <Avatar sx={{ bgcolor: '#dcfce7', color: '#22c55e', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        <CheckCircleOutlineRounded sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Registration Success!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                        Credential for {showCredentials?.name} have been generated.
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                                Email Address
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {showCredentials?.email}
                                </Typography>
                                <IconButton size="small" onClick={() => handleCopy(showCredentials?.email)} sx={{ color: '#6366f1' }}>
                                    <ContentCopyRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Stack>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                                Password
                            </Typography>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {showCredentials?.password}
                                </Typography>
                                <IconButton size="small" onClick={() => handleCopy(showCredentials?.password)} sx={{ color: '#6366f1' }}>
                                    <ContentCopyRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => {
                            toast.success(`Credentials mailed to ${showCredentials?.name || 'the delivery boy'}! 📮`, {
                                duration: 4000,
                                icon: '📧'
                            });
                            setShowCredentials(null);
                        }}
                        sx={{ 
                            borderRadius: '12px', 
                            bgcolor: '#1e293b', 
                            py: 1.5,
                            '&:hover': { bgcolor: '#0f172a' }
                        }}
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
