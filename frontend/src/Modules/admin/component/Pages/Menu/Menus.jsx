import { 
    Box, 
    Typography, 
    IconButton, 
    Button, 
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
    Tooltip
} from '@mui/material';
import React, { useState, useContext } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import { AuthContext } from '../../../../GlobalContext';
import Hosts from '../../../../../config/Hosts';
import axios from 'axios';

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

export default function ManageMenus() {
    const host = Hosts.host;
    const { products, deletedProduct, setDeleteProduct, setProductCount } = useContext(AuthContext);
    const [open1, setOpen1] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleOpen = () => setOpen1(true);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete Product?',
            text: 'This item will be removed from your menu.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            borderRadius: '20px'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = JSON.parse(sessionStorage.getItem('adminToken'));
                axios.delete(`${host}/api/admin/deleteproduct/${id}`, { headers: { 'auth-token': token } })
                    .then(() => {
                        setDeleteProduct(!deletedProduct);
                        toast.success('Product deleted successfully');
                    })
                    .catch((err) => {
                        console.error(err);
                        toast.error('Failed to delete product');
                    });
            }
        });
    };

    const handleEdit = (product) => {
        setEditingCategory(product);
        setEditOpen(true);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Toaster position="top-right" />
            
            {/* Header Section */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                        Menu Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Oversee and update your restaurant's food and beverage offerings.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddRoundedIcon />} 
                    onClick={handleOpen}
                    sx={{ 
                        borderRadius: '14px', 
                        px: 3, 
                        py: 1.5, 
                        fontWeight: 700, 
                        textTransform: 'none',
                        bgcolor: '#6366f1',
                        '&:hover': { bgcolor: '#4f46e5' }
                    }}
                >
                    Add Menu Item
                </Button>
            </Stack>

            <TableContainer 
                component={Paper} 
                elevation={0} 
                sx={{ 
                    borderRadius: '24px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden'
                }}
            >
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width="5%">#</StyledTableCell>
                            <StyledTableCell width="10%">Preview</StyledTableCell>
                            <StyledTableCell sx={{ textAlign: 'left !important' }}>Name</StyledTableCell>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>Discount</StyledTableCell>
                            <StyledTableCell width="12%">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products?.length === 0 ? (
                            <TableRow>
                                <StyledTableCell colSpan={7} sx={{ py: 10 }}>
                                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>No menu items found.</Typography>
                                </StyledTableCell>
                            </TableRow>
                        ) : (
                            products?.map((product, index) => (
                                <StyledTableRow key={product._id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Avatar 
                                                src={`http://localhost:8000/api/image/${product.image}`} 
                                                variant="rounded"
                                                sx={{ width: 50, height: 50, borderRadius: '12px', border: '1px solid #f1f5f9' }}
                                            />
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ textAlign: 'left !important' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                            {product.name}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Chip 
                                            label={product.category.title} 
                                            size="small" 
                                            sx={{ fontWeight: 600, bgcolor: '#f1f5f9', color: '#475569' }} 
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#10b981' }}>
                                            ₹{product.price.toFixed(2)}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ec4899' }}>
                                            {product.discount}% OFF
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Edit Item">
                                                <IconButton 
                                                    onClick={() => handleEdit(product)}
                                                    sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.05)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' } }}
                                                >
                                                    <EditRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Item">
                                                <IconButton 
                                                    onClick={() => handleDelete(product._id)}
                                                    sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                                >
                                                    <DeleteOutlineRoundedIcon fontSize="small" />
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

            <AddProduct
                open={open1}
                setOpen={setOpen1}
                setCount={setProductCount}
            />

            <EditProduct
                open={editOpen}
                setOpen={setEditOpen}
                editingCategory={editingCategory}
                setCount={setProductCount}
            />
        </Box>
    );
}
