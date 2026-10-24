// import React from 'react';
// import { Box, Paper, Typography } from '@mui/material';
// import EventSeatIcon from '@mui/icons-material/EventSeat';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';

// const Table = ({ name, seats, theme, onClick, createDate }) => (
//     <Paper
//         onClick={onClick}
//         elevation={0}
//         sx={{
//             p: 2,
//             color: '#fff',
//             boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.1)',
//             borderRadius: '15px',
//             position: 'relative',
//             backgroundColor: theme.palette.background.default,
//         }}
//     >
//         <Typography variant="h5" sx={{ color: theme.palette.text.main, fontSize: "29px", overflow: 'hidden', textOverflow: 'ellipsis' }}>
//             {name}
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//             <EventSeatIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
//             <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
//                 {seats}
//             </Typography>
//         </Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//             <AccessTimeIcon sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: '14px' }} />
//             <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: '14px' }}>
//                 {createDate}
//             </Typography>
//         </Box>
//     </Paper>
// );

// export default Table;
