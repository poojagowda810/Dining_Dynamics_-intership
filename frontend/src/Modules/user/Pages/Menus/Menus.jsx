import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FoodCard from './FoodCard'; // Ensure correct import path
import { AuthContext } from '../../../GlobalContext';
import axios from 'axios';
import CheckoutModal from '../../Navbar/Cart/Checkout';

const Menus = () => {
  const {
    token, dbcategory, products, host, setCartCount, user, imagePath,
    setCheckoutModalOpen, cartOpen, setCartOpen, selectedProductItem,
    setSelectedProductItem, addToCheckout
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [message, setMessage] = useState({ type: '', message: '' });
  const [selectedCategory, setSelectedCategory] = useState(null); // State to manage selected category
  const [searchQuery, setSearchQuery] = useState(''); // State to manage search query

  const handleCardClick = (productItem) => {
    if (token) {
      setSelectedProductItem(productItem);
      setCartOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleClose = () => {
    setCartOpen(false);
  };

  const handleAddToCart = async (productItem) => {
    try {
      const productId = productItem?._id;
      const userId = user?._id;
      if (!productId) {
        console.error("Product ID or Category ID is missing");
        return;
      }
      // Prepare the data to be sent in the request
      const cartData = {
        product: productId,
        user: userId,
      };
      const response = await axios.post(`${host}/api/user/addtocart`, cartData);
      if (response.data.success) {
        let message = response.data.message;
        setMessage({ type: 'success', message: message });
        setCartCount((prev) => prev + 1);
      } else {
        let errorMessage = response.data.message;
        setMessage({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const handleBuy = (productItem) => {
    if (!token) {
      navigate('/login');
      return;
    }
    addToCheckout(productItem);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset message when component mounts
      setMessage({ type: '', message: '' });
    }, 900);
    return () => clearTimeout(timer);
  }, [message]);

  // Filter products based on selected category _id and search query
  const filteredProducts = products?.filter((productItem) => {
    const matchesCategory = selectedCategory ? productItem.category._id === selectedCategory : true;
    const matchesSearch = searchQuery
      ? productItem.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'all') {
      // Show all categories
      setSelectedCategory(null);
    } else {
      // Toggle category selection
      setSelectedCategory((prevCategory) => (prevCategory === categoryId ? null : categoryId));
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 10, mb: 10, ml: 5 }}>
        <CssBaseline />
        <Grid container sx={{ flexGrow: 1, gap: 5, mt: 5 }}>
          <Grid item xs={12}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/" color="inherit">
                Home
              </Link>
              <Typography color="text.primary">Products</Typography>
            </Breadcrumbs>
            {/* Search bar */}
            <TextField
              sx={{
                borderRadius: '20px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'grey',
                  },
                },
                '& .MuiInputAdornment-root': {
                  color: 'grey',
                },
              }}
              fullWidth
              variant="outlined"
              placeholder="Search..."
              value={searchQuery} // Bind value to searchQuery state
              onChange={handleSearchChange} // Add onChange handler
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'grey' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid container spacing={0}>
            <Grid item xs={12} sm={3} md={2} sx={{ border: '0.5px solid grey', borderRadius: '10px', borderTopLeftRadius: '0px' }}>
              <Typography variant="h3" gutterBottom sx={{ borderBottom: '0.5px solid grey', p: 2 }}>
                Filter Category
              </Typography>
              <List>
                <ListItem
                  button
                  selected={selectedCategory === null} // Highlight "Show All" when no category is selected
                  onClick={() => handleCategoryClick('all')} // Show all categories
                >
                  <ListItemText primary="All" />
                </ListItem>
                {dbcategory?.map((category, index) => (
                  <ListItem
                    button
                    key={index}
                    selected={selectedCategory === category._id} // Highlight selected category
                    onClick={() => handleCategoryClick(category._id)} // Add click handler
                  >
                    <ListItemText primary={`${index + 1} - ${category?.title}`} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={9} md={10} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {filteredProducts?.length === 0 && (
                  <Typography variant="h5" sx={{ color: "grey", pl: 4 ,fontSize:'20px'}}>
                    No Product found
                  </Typography>
                )}
                {filteredProducts?.map((productItem, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '15px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        overflow: 'hidden', // Ensures content stays within bounds
                        '&:hover': {
                          '& .MuiCardActions-root': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="150"
                        image={`${imagePath}/${productItem?.image}`}
                        alt={productItem?.name}
                        onClick={() => handleCardClick(productItem)}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6">
                          {productItem?.name}
                        </Typography>
                        <Typography color="green">
                          {productItem?.discount ? `Discount: ${productItem?.discount}%` : 'No Discount'}
                        </Typography>
                        <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="green">
                            Price ₹{productItem?.price}
                          </Typography>
                          <Button variant="contained" color="secondary" onClick={() => handleBuy(productItem)}>
                            Buy
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <FoodCard
          open={cartOpen}
          handleClose={handleClose}
          productItem={selectedProductItem}
          handleBuy={handleBuy}
          message={message}
        />

      </Box>

      <CheckoutModal />
    </>
  );
};

export default Menus;
