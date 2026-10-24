// import React, { useState, useEffect } from 'react';
// import { Box, Button, Typography, Modal, TextField, Fade, Backdrop, Alert } from '@mui/material';
// import axios from 'axios';
// import Hosts from '../../../../../config/Hosts';
// import toast, { Toaster } from 'react-hot-toast';


// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: 300, sm: 400 },
//   bgcolor: 'background.paper',
//   borderRadius: '30px',
//   boxShadow: 1,
//   p: 6,
// };

// const EditTable = ({ open, setOpen, table, setTables }) => {
//   const host = Hosts.host;
//   const [newTable, setNewTable] = useState({ name: '', seats: '' });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (table) {
//       setNewTable({ name: table.name, seats: table.seats });
//     }
//   }, [table]);

//   const handleClose = () => {
//     setOpen(false);
//     setError('');
//     setNewTable({ name: '', seats: '' });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewTable(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSave = async () => {
//     const { name, seats } = newTable;

//     if (!name || name.length > 50) {
//       setError('Table name must be below 10 characters');
//       return;
//     }

//     if (!name || !seats || isNaN(seats) || seats <= 0) {
//       setError('Seats must be a positive number');
//       return;
//     }
    
//     try {
//       setError('');
//       const response = await axios.put(`${host}/api/admin/updatetable/${table?._id}`, { ...newTable});
//       if (response.data.status) {
//         toast.success('Table Updated Successfully');
//         setTables(prevTables => prevTables.map(t => t._id === table._id ? response.data.table : t));
//         handleClose();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error updating table:', error);
//       toast.error("Error updating table");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//         let tableId=table?._id
//       const response = await axios.delete(`${host}/api/admin/deletetable/${tableId}`);
//       if (response.data.status) {
//         toast.success('Table Deleted Successfully');
//         setTables(prevTables => prevTables?.filter(t => t?._id !== tableId));
//         handleClose()
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting table:', error);
//       toast.error("Error deleting table");
//     }
//   };
  
  

//   return (
//     <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         <Modal
//           open={open}
//           onClose={handleClose}
//           closeAfterTransition
//           BackdropComponent={Backdrop}
//           BackdropProps={{
//             timeout: 1000,
//           }}
//         >
//           <Fade in={open}>
//             <Box sx={style}>
//               <Typography variant="h6" component="h2">
//                 Edit Table
//               </Typography>
//               {error && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {error}
//                 </Alert>
//               )}
//               <TextField
//                 label="Table Name"
//                 name="name"
//                 fullWidth
//                 value={newTable.name}
//                 onChange={handleChange}
//                 margin="normal"
//               />
//               <TextField
//                 label="Number of Seats"
//                 name="seats"
//                 fullWidth
//                 value={newTable.seats}
//                 onChange={handleChange}
//                 margin="normal"
//                 type="number"
//               />
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 sx={{ mt: 2, borderRadius: '10px' }}
//                 onClick={handleSave}
//                 fullWidth
//               >
//                 Save
//               </Button>
//               <Button
//                 color="error"
//               variant='contained'
//                 sx={{ mt: 2, borderRadius: '10px' }}
//                 onClick={handleDelete}
//                 fullWidth
//               >
//                 Delete
//               </Button>
//             </Box>
//           </Fade>
//         </Modal>
//       </Box>
//       <Toaster position="top-center" reverseOrder={true} />
//     </Box>
//   );
// };

// export default EditTable;
