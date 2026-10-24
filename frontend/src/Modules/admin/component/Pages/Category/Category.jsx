import { 
    Box, 
    TextField, 
    Grid, 
    Typography, 
    IconButton, 
    Modal, 
    Fade, 
    Backdrop, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    styled,
    Avatar,
    Stack,
    Tooltip
} from '@mui/material';
import React, { useState, useRef, useContext } from 'react';
import { tableCellClasses } from '@mui/material/TableCell';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import Hosts from '../../../../../config/Hosts';
import axios from 'axios';
import { AuthContext } from '../../../../GlobalContext';

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

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450 },
    bgcolor: 'background.paper',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: 4,
    outline: 'none',
    border: '1px solid rgba(0, 0, 0, 0.05)'
};

export default function ManageCategory() {
    const host = Hosts.host;
    const { dbcategory, deletedCategory, setDeleteCategory } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleImage = (e) => setImage(e.target.files[0]);
    const handletitleChange = (event) => setTitle(event.target.value);

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        const Data = new FormData();
        Data.append('title', title);
        if (image) Data.append('image', image);

        try {
            const token = JSON.parse(sessionStorage.getItem('adminToken'));
            if (editingCategory) {
                await axios.put(`${host}/api/admin/updateCategory/${editingCategory._id}`, Data, { headers: { 'auth-token': token } });
                toast.success('Category Updated Successfully');
                handleClose();
            } else {
                await axios.post(`${host}/api/admin/insertcategory`, Data, { headers: { 'auth-token': token } });
                toast.success('Category Added Successfully');
            }
            resetForm();
            setDeleteCategory(!deletedCategory);
        } catch (err) {
            console.error(err);
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete Category?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            borderRadius: '20px'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = JSON.parse(sessionStorage.getItem('adminToken'));
                    await axios.delete(`${host}/api/admin/deleteCategory/${id}`, { headers: { 'auth-token': token } });
                    setDeleteCategory(!deletedCategory);
                    Swal.fire('Deleted!', 'Category has been removed.', 'success');
                } catch (err) {
                    toast.error('Failed to delete');
                }
            }
        });
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setTitle(category.title);
        setOpen(true);
    };

    const resetForm = () => {
        setTitle('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
        resetForm();
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Toaster position="top-right" />
            
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                    Menu Categories
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Manage the departments and sections of your restaurant menu.
                </Typography>
            </Box>

            {/* Quick Add Section */}
            {!editingCategory && (
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        borderRadius: '24px', 
                        mb: 5, 
                        border: '1px solid #e2e8f0',
                        bgcolor: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Category Title"
                                fullWidth
                                variant="outlined"
                                value={title}
                                onChange={handletitleChange}
                                placeholder="e.g. Main Course, Desserts"
                                InputProps={{ sx: { borderRadius: '14px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                type="file"
                                fullWidth
                                label="Upload Icon/Image"
                                InputLabelProps={{ shrink: true }}
                                inputRef={fileInputRef}
                                onChange={handleImage}
                                InputProps={{ sx: { borderRadius: '14px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                startIcon={<AddRoundedIcon />}
                                onClick={handleSubmit}
                                sx={{ 
                                    py: 1.5, 
                                    borderRadius: '14px', 
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' }
                                }}
                            >
                                Add Category
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Table Section */}
            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    borderRadius: '24px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden'
                }}
            >
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width="10%">#</StyledTableCell>
                            <StyledTableCell width="20%">Preview</StyledTableCell>
                            <StyledTableCell sx={{ textAlign: 'left !important' }}>Category Title</StyledTableCell>
                            <StyledTableCell width="15%">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dbcategory.length === 0 ? (
                            <TableRow>
                                <StyledTableCell colSpan={4} sx={{ py: 10 }}>
                                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>No categories created yet.</Typography>
                                </StyledTableCell>
                            </TableRow>
                        ) : (
                            dbcategory.map((category, index) => (
                                <StyledTableRow key={category._id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Avatar 
                                                src={`http://localhost:8000/api/image/${category.image}`} 
                                                variant="rounded"
                                                sx={{ width: 50, height: 50, borderRadius: '12px', border: '1px solid #f1f5f9' }}
                                            />
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ textAlign: 'left !important' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                            {category.title}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Edit">
                                                <IconButton 
                                                    onClick={() => handleEdit(category)}
                                                    sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.05)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' } }}
                                                >
                                                    <EditRoundedIcon size="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton 
                                                    onClick={() => handleDelete(category._id)}
                                                    sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                                >
                                                    <DeleteRoundedIcon size="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
                            Edit Category
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                            Update the title and image for this category.
                        </Typography>
                        
                        <Stack spacing={3}>
                            <TextField
                                label="Category Title"
                                fullWidth
                                variant="outlined"
                                value={title}
                                onChange={handletitleChange}
                                InputProps={{ sx: { borderRadius: '14px' } }}
                            />
                            <TextField
                                type="file"
                                fullWidth
                                label="New Icon/Image"
                                InputLabelProps={{ shrink: true }}
                                onChange={handleImage}
                                InputProps={{ sx: { borderRadius: '14px' } }}
                            />
                            <Box sx={{ pt: 2, display: 'flex', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    onClick={handleSubmit}
                                    sx={{ py: 1.5, borderRadius: '14px', fontWeight: 700, bgcolor: '#6366f1' }}
                                >
                                    Update
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    onClick={handleClose}
                                    sx={{ py: 1.5, borderRadius: '14px', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b' }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}
