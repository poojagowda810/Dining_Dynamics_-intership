// import React from 'react';
// import { Grid, Typography } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import Table from './Table';
// import moment from 'moment';

// const TableGrid = ({ tables, onTableClick }) => {
//     const theme = useTheme(); // Get theme here

//     return (
//         <Grid container spacing={2} sx={{ mt: 2 }}>
//             {tables?.length === 0 ? (
//                 <Grid item xs={12}>
//                     <Typography variant="h3" sx={{ color: theme.palette.text.main, textAlign: 'center' }}>
//                         No table found
//                     </Typography>
//                 </Grid>
//             ) : (
//                 tables?.map((table, index) => {
//                     const createdDate = moment(table?.createdAt).format('ddd DD YYYY');
//                     return (
//                         <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//                             <Table
//                                 name={table?.name}
//                                 seats={table?.seats}
//                                 theme={theme}
//                                 onClick={() => onTableClick(table)}
//                                 createDate={createdDate}
//                             />
//                         </Grid>
//                     );
//                 })
//             )}
//         </Grid>
//     );
// };

// export default TableGrid;
