import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Modal, 
    TextField, 
    Fade, 
    Backdrop, 
    Alert, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl,
    Stack,
    Grid,
    IconButton,
    Avatar
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import axios from 'axios';
import Hosts from '../../../../../config/Hosts';
import toast from 'react-hot-toast';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '600px' },
    bgcolor: 'background.paper',
    borderRadius: '28px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: { xs: 3, md: 5 },
    maxHeight: '90vh',
    overflowY: 'auto',
    outline: 'none',
};

const EditProduct = ({ open, setOpen, editingCategory, setCount }) => {
    const host = Hosts.host;
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        discount: '0',
    });
    const [productCategory, setProductCategory] = useState({ id: '', name: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`${host}/api/admin/getcategory`)
            .then((res) => {
                if (res.data) setCategories(res.data);
            })
            .catch((err) => console.log(err));
    }, [host]);

    useEffect(() => {
        if (editingCategory) {
            setNewProduct({
                name: editingCategory.name || '',
                price: editingCategory.price || '',
                description: editingCategory.description || '',
                discount: editingCategory.discount || '0',
            });
            setProductCategory({
                id: editingCategory?.category?._id || '',
                name: editingCategory?.category?.title || '',
            });
            // Show current image from server as initial preview
            if (editingCategory.image) {
                setPreview(`http://localhost:8000/api/image/${editingCategory.image}`);
                setImage(editingCategory.image); // Keep the string reference for submission if not changed
            }
        }
    }, [editingCategory]);

    const handleClose = () => {
        setOpen(false);
        setError('');
        setImage(null);
        setPreview(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
        setProductCategory({
            id: selectedCategoryId,
            name: selectedCategory ? selectedCategory.title : ''
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const { name, price, description, discount } = newProduct;
        
        if (!name || name.length > 40) return setError('Product name required (max 40 chars)');
        if (!price || price <= 0) return setError('Please enter a valid price');
        if (!productCategory?.id) return setError('Please select a category');

        try {
            setError('');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('discount', discount);
            formData.append('category', productCategory.id);
            
            // Only append image if it's a new File object
            if (image instanceof File) {
                formData.append('image', image);
            }

            const token = JSON.parse(sessionStorage.getItem('adminToken'));
            const response = await axios.put(`${host}/api/admin/updateproduct/${editingCategory?._id}`, formData, { headers: { 'auth-token': token } });

            if (response.data.status) {
                toast.success('Menu item updated!');
                setCount((prev) => prev + 1);
                handleClose();
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Update failed. Check connection.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, sx: { backdropFilter: 'blur(8px)', bgcolor: 'rgba(15, 23, 42, 0.6)' } }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Edit Menu Item
                        </Typography>
                        <IconButton onClick={handleClose} sx={{ color: '#94a3b8' }}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                label="Product Name"
                                name="name"
                                fullWidth
                                variant="outlined"
                                value={newProduct.name}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price (₹)"
                                name="price"
                                fullWidth
                                type="number"
                                value={newProduct.price}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Discount (%)"
                                name="discount"
                                fullWidth
                                type="number"
                                value={newProduct.discount}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select Category</InputLabel>
                                <Select
                                    value={productCategory.id}
                                    onChange={handleCategoryChange}
                                    label="Select Category"
                                    sx={{ borderRadius: '12px' }}
                                >
                                    {categories.map(cat => (
                                        <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Box 
                                sx={{ 
                                    border: '2px dashed #e2e8f0', 
                                    borderRadius: '16px', 
                                    p: 3, 
                                    textAlign: 'center',
                                    bgcolor: '#f8fafc',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    '&:hover': { borderColor: '#6366f1', bgcolor: '#f1f5f9' }
                                }}
                                component="label"
                            >
                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                                {preview ? (
                                    <Box sx={{ position: 'relative', width: '100px', height: '100px', mx: 'auto' }}>
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                        <Box sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#6366f1', p: 0.5, borderRadius: '50%', color: 'white' }}>
                                            <CloudUploadRoundedIcon sx={{ fontSize: 16 }} />
                                        </Box>
                                    </Box>
                                ) : (
                                    <Stack spacing={1} alignItems="center">
                                        <CloudUploadRoundedIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                                            Update product image
                                        </Typography>
                                    </Stack>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={3}
                                value={newProduct.description}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                fullWidth
                                sx={{ 
                                    py: 2, 
                                    borderRadius: '16px', 
                                    bgcolor: '#6366f1', 
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                Update Category Info
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </Modal>
    );
};

export default EditProduct;
