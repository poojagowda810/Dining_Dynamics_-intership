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
    Chip,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Tooltip
} from '@mui/material';
import React, { useContext, useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { AuthContext } from '../../../../GlobalContext';
import { 
    PersonRounded, 
    EmailRounded, 
    PhoneRounded, 
    AdminPanelSettingsRounded as AdminIcon,
    DirectionsBikeRounded as DeliveryIcon,
    AccountCircleRounded as UserIcon,
    HistoryRounded,
    RefreshRounded
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

const RoleChip = ({ role }) => {
    const config = {
        admin: { label: 'Administrator', icon: <AdminIcon sx={{ fontSize: 16 }} />, color: '#6366f1', bg: '#f5f7ff', border: '#e0e7ff' },
        delivery: { label: 'Delivery Boy', icon: <DeliveryIcon sx={{ fontSize: 16 }} />, color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7' },
        user: { label: 'Customer', icon: <UserIcon sx={{ fontSize: 16 }} />, color: '#10b981', bg: '#f0fdf4', border: '#dcfce7' },
    };

    const style = config[role] || config.user;

    return (
        <Chip 
            icon={style.icon}
            label={style.label}
            size="small"
            sx={{ 
                fontWeight: 800, 
                fontSize: '0.65rem', 
                color: style.color, 
                bgcolor: style.bg, 
                border: `1px solid ${style.border}`,
                '& .MuiChip-icon': { color: 'inherit' }
            }}
        />
    );
};

export default function ManageUsers() {
    const { alluser, updateUserRole } = useContext(AuthContext);
    const [loading, setLoading] = useState(null);

    const handleRoleChange = async (userId, newRole) => {
        setLoading(userId);
        const success = await updateUserRole(userId, newRole);
        if (success) {
            toast.success(`Role updated to ${newRole.toUpperCase()}! 🚀`);
        } else {
            toast.error('Failed to update role. Try again.');
        }
        setLoading(null);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Toaster position="top-right" />
            
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                        User Database
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        View and manage staff roles and customer accounts.
                    </Typography>
                </Box>
                <Tooltip title="Refresh Database">
                    <IconButton sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <RefreshRounded sx={{ color: '#6366f1' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    borderRadius: '24px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden'
                }}
            >
                <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width="5%">#</StyledTableCell>
                            <StyledTableCell width="30%" sx={{ textAlign: 'left !important' }}>Identity</StyledTableCell>
                            <StyledTableCell>Contact</StyledTableCell>
                            <StyledTableCell width="25%">Current Role</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alluser?.length === 0 ? (
                            <TableRow>
                                <StyledTableCell colSpan={4} sx={{ py: 10 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <HistoryRounded sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                                        <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>No users found.</Typography>
                                    </Box>
                                </StyledTableCell>
                            </TableRow>
                        ) : (
                            alluser?.map((user, index) => (
                                <StyledTableRow key={user?._id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell sx={{ textAlign: 'left !important' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: '#6366f1', width: 40, height: 40, fontSize: '14px', fontWeight: 700, borderRadius: '12px' }}>
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    {user?.name || 'Guest User'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Stack spacing={0.5} sx={{ textAlign: 'left' }}>
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569', fontWeight: 600 }}>
                                                <EmailRounded sx={{ fontSize: '16px', color: '#6366f1' }} /> {user?.email}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                                                <PhoneRounded sx={{ fontSize: '14px' }} /> {user?.phone || 'No phone'}
                                            </Typography>
                                        </Stack>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <RoleChip role={user?.role} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
