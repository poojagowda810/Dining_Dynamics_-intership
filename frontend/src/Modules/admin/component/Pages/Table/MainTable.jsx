// import React, { useContext, useState } from 'react';
// import { Box, Button, Typography } from '@mui/material';
// import { AuthContext } from '../../../../GlobalContext';
// import AddTable from './AddTable';
// import EditTable from './EditTable';
// import TableGrid from './TableGrid';

// const MainTable = () => {
//     const [open, setOpen] = useState(false);
//     const [editOpen, setEditOpen] = useState(false);
//     const { tables, setTables } = useContext(AuthContext);
//     const [selectedTable, setSelectedTable] = useState(null);

//     const handleOpen = () => setOpen(true);
//     const handleEditOpen = (table) => {
//         setSelectedTable(table);
//         setEditOpen(true);
//     };

//     return (
//         <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 3 }}>
//             <Box sx={{ flexGrow: 1 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Box>
//                         <Typography variant="h4" gutterBottom>
//                             Manage Table
//                         </Typography>
//                         <Typography variant="h5" color={"grey"} sx={{ fontSize: '17px' }} gutterBottom>
//                             Manage and configure table arrangements and availability. Easily update table statuses and optimize seating to enhance the dining experience.
//                         </Typography>
//                     </Box>
//                     <Button variant="outlined" sx={{ borderRadius: '10px' }} onClick={handleOpen}>
//                         Add
//                     </Button>
//                 </Box>
//                 <TableGrid tables={tables} onTableClick={handleEditOpen} />
//             </Box>
//             <AddTable open={open} setOpen={setOpen} setTables={setTables} />
//             <EditTable open={editOpen} setOpen={setEditOpen} table={selectedTable} setTables={setTables} />
//         </Box>
//     );
// };

// export default MainTable;
