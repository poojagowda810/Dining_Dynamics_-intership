// import React, { useState } from 'react';
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

// const AddTable = ({ open, setOpen, setTables }) => {
//   const host = Hosts.host;
//   const [newTable, setNewTable] = useState({ name: '', seats: '' });
//   const [error, setError] = useState('');

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

// // Validate inputs
// if (!name || name.length > 50) {
//   setError('Table name must be below 10 characters');
//   return;
// }
//     // Validate inputs
//     if (!name || !seats || isNaN(seats) || seats <= 0) {
//       setError('Seats must be a positive number');
//       return;
//     }

//     try {
//       // Clear any previous error
//       setError('');
//       const response = await axios.post(`${host}/api/admin/addtable`, newTable);
//       // Handle response and update state
//       if (response.data.status) {
//         toast.success('Table Added Successfully');

//         setTables(prevTables => [...prevTables, response.data.table]);
//     handleClose();
//       }else {
//         toast.error(response.data.message);
//         setError(response.data.message);
//     }

//     } catch (error) {
//       console.error('Error adding table:', error);
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
//                 New Table
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
//                 type="number" // Optionally, set the input type to "number"
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ mt: 2, borderRadius: '10px' }}
//                 onClick={handleSave}
//                 fullWidth
//               >
//                 Save
//               </Button>
//             </Box>
//           </Fade>
//         </Modal>
//       </Box>

//       <Toaster position="top-center" reverseOrder={true} />

//     </Box>
//   );
// };

// export default AddTable;
