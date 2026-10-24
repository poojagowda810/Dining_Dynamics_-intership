const express=require('express');
const { TableInsert, GetTables, TableUpdate, DeleteTable } = require('../Controller/Admin/Table');
const { AdminLogin } = require('../Controller/Admin/Login');
const upload = require('../Middleware/upload'); // Adjust the path as necessary
const {CategoryInsert,GetCategory,DeleteCategory,UpdateCategory}=require("../Controller/Admin/Category");
const { addProduct, getProducts, deleteProduct, updateProduct } = require('../Controller/Admin/Product');
const router=express.Router();
const { fetchAdmin } = require('../Middleware/middleware');

router.post('/login',AdminLogin);
router.get('/gettable',GetTables);
router.post('/addtable', fetchAdmin, TableInsert);
router.put('/updatetable/:id', fetchAdmin, TableUpdate);
router.delete('/deletetable/:id', fetchAdmin, DeleteTable);

//Category
router.post('/insertcategory', fetchAdmin, upload.single('image'),CategoryInsert);
router.get('/getcategory', GetCategory);
router.delete('/deleteCategory/:id', fetchAdmin, DeleteCategory);
router.put('/updateCategory/:id', fetchAdmin, upload.single('image'),UpdateCategory);

// Product
router.post('/addproduct', fetchAdmin, upload.single('image'),addProduct);
router.get('/getproduct', getProducts);
router.delete('/deleteproduct/:id', fetchAdmin, deleteProduct);
router.put('/updateproduct/:id', fetchAdmin, upload.single('image'),updateProduct);

// User Management
const { updateUserRole, getAllUsers, addDeliveryUser, getDeliveryUsers } = require('../Controller/Admin/User');
router.get('/getusers', fetchAdmin, getAllUsers);
router.put('/updateUserRole', fetchAdmin, updateUserRole);
router.post('/addDeliveryUser', fetchAdmin, addDeliveryUser);
router.get('/getDeliveryUsers', fetchAdmin, getDeliveryUsers);

// Requests
const { updateRequest, assignDeliveryBoy } = require('../Controller/User/Request');
router.put('/updateRequest/:id', fetchAdmin, updateRequest);
router.put('/assignDeliveryBoy', fetchAdmin, assignDeliveryBoy);


module.exports=router;
