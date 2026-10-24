// src/contexts/AuthContext.js

import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import Hosts from '../config/Hosts';
import moment from 'moment';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const host = Hosts.host;
    const imagePath = `http://localhost:8000/api/image/`;

    const [token, setToken] = useState(null); // null = loading, false = not logged in, true = logged in
    const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false);

    const [user, setUser] = useState({});
    const [loggedCount, setLoggedCount] = useState(0);


    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = JSON.parse(localStorage.getItem('userToken'));
            
            if (!userToken) {
                setToken(false);
                setUser({});
                return;
            }

            try {
                // Fetch the latest user profile to ensure roles are current
                const res = await axios.get(`${host}/api/user/get-logged-user`, {
                    headers: { 'auth-token': userToken }
                });

                if (res.data.success) {
                    setUser(res.data.user);
                    setToken(true);
                } else {
                    localStorage.removeItem('userToken');
                    setToken(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error.message);
                localStorage.removeItem('userToken');
                setToken(false);
            }
        };

        checkAuth();
    }, [loggedCount, host]);




    // Get All Category
    const [dbcategory, setDbCategory] = useState([]);
    const [deletedCategory, setDeleteCategory] = useState(false);



    useEffect(() => {
        axios.get(`${host}/api/admin/getcategory`)
            .then((res) => {
                if (res.data) {
                    setDbCategory(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [deletedCategory, host]);

    // Product 
    const [products, setProducts] = useState([]);
    const [deletedProduct, setDeleteProduct] = useState(false);
    const [productCount, setProductCount] = useState(0);


    useEffect(() => {
        axios.get(`${host}/api/admin/getproduct`)
            .then((res) => {
                if (res.data?.status) {
                    setProducts(res.data?.products);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [deletedProduct, productCount, host]);

    // Carts
    const [carts, setCarts] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userToken')); // or wherever you're storing the token
        axios.get(`${host}/api/user/getCartById`, {
            headers: {
                'auth-token': token
            }
        })
            .then((res) => {
                setCarts(res?.data?.carts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [cartCount, host]);

    // User
    useEffect(() => {
        const tokensss = JSON.parse(localStorage.getItem('userToken'));
        axios.get(`${host}/api/user/get-single-user`, { headers: { 'auth-token': tokensss } })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                console.log("Error : " + err);
            })
    }, [loggedCount, host])

    const [proceedDetail, setProceedDetail] = useState({})
    const [cartOpen, setCartOpen] = useState(false);

    // Initialize state with empty arrays
    const [pendingreq, setPendingRequest] = useState([]);
    const [acceptedreq, setAcceptedRequest] = useState([]);
    const [rejreq, setRejectedRequest] = useState([]);

    const [singleusereq, setSingleUserRequest] = useState([]);
    const [userpendingreq, setUserPendingRequest] = useState([]);
    const [useracceptedreq, setUserAcceptedRequest] = useState([]);
    const [userrejreq, setUserRejectedRequest] = useState([]);

    const [allreq, setAllRequest] = useState([]);
    const [reqCount, setreqCount] = useState(0);

    const [onlinepay, setOnlinePay] = useState([]);
    const [offlinepay, setOfflinePay] = useState([]);
    const [orders, setOrders] = useState([]);
    const [useronlinepay, setUserOnlinePay] = useState([]);
    const [userofflinepay, setUserOfflinePay] = useState([]);
    const [userorders, setUserOrders] = useState([]);

    useEffect(() => {
        axios.get(`${host}/api/user/getRequests`)
            .then((res) => {
                const allreqs = res?.data?.allreq || [];
                setAllRequest(allreqs);
                setPendingRequest(res?.data?.pendingreq || []);
                setAcceptedRequest(res?.data?.acceptedreq || []);
                setRejectedRequest(res?.data?.rejectedreq || []);
                
                setOrders(allreqs);
                setOnlinePay(allreqs.filter(req => req.method?.toLowerCase() === 'online'));
                setOfflinePay(allreqs.filter(req => req.method?.toLowerCase() !== 'online'));
            })
            .catch((err) => {
                console.error('Error fetching requests:', err.message);
            });

        const token = JSON.parse(localStorage.getItem('userToken'));
        if (token) {
            axios.get(`${host}/api/user/getRequestsByUserId`, {
                headers: { 'auth-token': token }
            })
                .then((res) => {
                    const userreqs = res?.data?.allreq || [];
                    setSingleUserRequest(userreqs);
                    setUserPendingRequest(res?.data?.pendingreq || []);
                    setUserAcceptedRequest(res?.data?.acceptedreq || []);
                    setUserRejectedRequest(res?.data?.rejectedreq || []);
                    
                    setUserOrders(userreqs);
                    setUserOnlinePay(userreqs.filter(req => req.method?.toLowerCase() === 'online'));
                    setUserOfflinePay(userreqs.filter(req => req.method?.toLowerCase() !== 'online'));
                })
                .catch((err) => {
                    console.error('Error fetching requests by user:', err.message);
                });
        }
    }, [reqCount, cartCount, host]);
    
    const [selectedProductItem, setSelectedProductItem] = useState(null);
    const [checkoutItems, setCheckoutItems] = useState([]);

    const addToCheckout = (product) => {
        setCheckoutItems(prev => {
            const exists = prev.find(item => item._id === product._id);
            if (exists) {
                return prev.map(item => 
                    item._id === product._id 
                    ? { ...item, quantity: (item.quantity || 1) + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setCheckoutModalOpen(true);
    };

    const removeFromCheckout = (productId) => {
        setCheckoutItems(prev => prev.filter(item => item._id !== productId));
    };

    const updateCheckoutQuantity = (productId, delta) => {
        setCheckoutItems(prev => prev.map(item => 
            item._id === productId 
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } 
            : item
        ));
    };

    const [alluser, setAllUser] = useState([]);
    const [alluserCount, setAllUserCount] = useState(0);

    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [deliveryCount, setDeliveryCount] = useState(0);

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('adminToken'));
        if (token) {
            axios.get(`${host}/api/admin/getDeliveryUsers`, { headers: { 'auth-token': token } })
                .then((res) => {
                    setDeliveryBoys(res?.data?.deliveries || []);
                })
                .catch((err) => {
                    console.error('Error fetching delivery users:', err.message);
                });
        }
    }, [host, deliveryCount]);

    const [deliveryOrders, setDeliveryOrders] = useState([]);
    const [assignedCount, setAssignedCount] = useState(0);

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('deliveryToken'));
        if (token) {
            axios.get(`${host}/api/user/getDeliveryOrders`, { headers: { 'auth-token': token } })
                .then((res) => {
                    setDeliveryOrders(res?.data?.assignedOrders || []);
                })
                .catch((err) => {
                    console.error('Error fetching assigned orders:', err.message);
                });
        }
    }, [host, assignedCount, reqCount]);

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('adminToken'));
        if (token) {
            axios.get(`${host}/api/admin/getusers`, { headers: { 'auth-token': token } })
                .then((res) => {
                    setAllUser(res?.data?.users || []);
                })
                .catch((err) => {
                    console.error('Error fetching users:', err.message);
                });
        }
    }, [host, alluserCount]);

    const updateUserRole = async (userId, role) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('adminToken'));
            const res = await axios.put(`${host}/api/admin/updateUserRole`, { userId, role }, { headers: { 'auth-token': token } });
            if (res.data.success) {
                setAllUserCount(prev => prev + 1);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating user role:', error.message);
            return false;
        }
    };

    const assignDeliveryBoy = async (requestId, deliveryBoyId) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('adminToken'));
            const res = await axios.put(`${host}/api/admin/assignDeliveryBoy`, { requestId, deliveryBoyId }, { headers: { 'auth-token': token } });
            if (res.data.success) {
                setreqCount(prev => prev + 1);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error assigning delivery boy:', error.message);
            return false;
        }
    };

    const addDeliveryUser = async (deliveryData) => {
        try {
            const token = JSON.parse(sessionStorage.getItem('adminToken'));
            const res = await axios.post(`${host}/api/admin/addDeliveryUser`, deliveryData, { 
                headers: { 'auth-token': token } 
            });
            if (res.data.success) {
                setDeliveryCount(prev => prev + 1);
                return { success: true, message: res.data.message };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            console.error('Error adding delivery user:', error.message);
            return { success: false, message: error.response?.data?.message || 'Server error' };
        }
    };

    return (
        <AuthContext.Provider value={{
            host, imagePath,
            token, setToken,
            checkoutModalOpen, setCheckoutModalOpen,
            drawerOpen, setDrawerOpen, handleDrawerOpen, handleDrawerClose,
            //  Categories
            dbcategory, setDbCategory, deletedCategory, setDeleteCategory,

            // Product
            products, setProducts,
            deletedProduct, setDeleteProduct,
            productCount, setProductCount,
            
            // Cart
            carts, setCarts, cartCount, setCartCount,

            // User
            user, setLoggedCount,

            proceedDetail, setProceedDetail,
            cartOpen, setCartOpen,

            // Request For Admin
            pendingreq, setPendingRequest,
            allreq, setAllRequest, rejreq,
            acceptedreq, setAcceptedRequest,
            selectedProductItem, setSelectedProductItem, setreqCount,

            // Request for User
            singleusereq,
            userpendingreq,
            useracceptedreq,
            userrejreq,

            // Order for User
            useronlinepay,
            userofflinepay,
            userorders,

            // Orders
            onlinepay,
            offlinepay,
            orders, setOrders,

            // Alluser
            alluser, updateUserRole, addDeliveryUser, deliveryBoys,
            assignDeliveryBoy, deliveryOrders, setAssignedCount,

            // New Checkout List
            checkoutItems, setCheckoutItems, addToCheckout, removeFromCheckout, updateCheckoutQuantity
        }}>
            {children}
        </AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider };
