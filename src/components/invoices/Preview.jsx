
import React from 'react';
import {useLocation,useHistory} from 'react-router-dom';
import { formatDate } from '../../Utilities';
import { Container,Typography,Stack,Box,Table,TableHead,TableContainer,TableRow,TableCell,TableBody,Button } from '@mui/material';
import Pdf from 'react-to-pdf';
import ReactToPrint from 'react-to-print';

const ref=React.createRef();

export default function Preview(){
    
    const location=useLocation();
    const history=useHistory();
    const invoiceDetails=location.state.invoiceDetails;
    const customerDetails=location.state.customerDetails;
    const invoiceNo=location.state.invoiceNo;

    const linkToPrint=()=>{
        return (
            <Button variant="outlined">Print</Button>
        )
    }

    const componentRef=React.useRef();

    return(
        <>
        <Container sx={{width:800}} ref={ref}>
        <Container ref={componentRef}>
            <Typography sx={{backgroundColor:'skyblue',padding:2,fontSize:24,textAlign:'center',mt:1}}>Invoice</Typography>
            <Stack direction="row" justifyContent="space-between">
                <Stack>
                    <Box sx={{padding:2}}>
                        <Typography sx={{fontWeight:'bold'}}>To M/S</Typography>
                        <Typography>{customerDetails.name}</Typography>
                        <Typography>{customerDetails.phone}</Typography>
                        <Typography>{customerDetails.email}</Typography>
                        <Typography>{customerDetails.address}</Typography>
                        <Typography>{customerDetails.state}</Typography>
                    </Box>
                </Stack>
                <Stack>
                    <Box sx={{padding:2}}>
                        <Typography>Invoice no  : {invoiceNo}</Typography>
                        <Typography>Date        : {formatDate(invoiceDetails.date)}</Typography>
                    </Box>
                </Stack>
            </Stack>
            <hr/>
            <Box>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight:'bold'}}>Description</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Price (₹)</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Tax %</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>HSN</TableCell>
                                <TableCell sx={{fontWeight:'bold'}}>Quantity</TableCell>
                                <TableCell align='right' sx={{fontWeight:'bold'}}>Amount (₹)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoiceDetails.products.map((product,index)=>{
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.tax}</TableCell>
                                        <TableCell>{product.hsn}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell align='right'>{product.amount}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        <hr/>
        <Stack direction="row" justifyContent="flex-end" spacing={3}>
                <Stack direction="column" spacing={2}>
                   <Typography variant="h6">Subtotal:</Typography>
                   <Typography variant="h6">Tax:</Typography>
                   <Typography variant="h6">Total:</Typography>
                </Stack>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h6" fontWeight="bold">₹ {invoiceDetails.subtotal}</Typography>
                   <Typography variant="h6" fontWeight="bold">₹ {invoiceDetails.tax}</Typography>
                   <Typography variant="h6" fontWeight="bold">₹ {invoiceDetails.total}</Typography>
                </Stack>
        </Stack>
        </Container>
        </Container>
        <Container sx={{width:800}}>
            <Stack sx={{width:300}} alignItems='center' direction="row" spacing={1}>
                <ReactToPrint trigger={linkToPrint} content={() => componentRef.current} />
                <Pdf targetRef={ref} filename={`invoice-${invoiceNo}`}>
                    {({ toPdf }) => <Button color="secondary" variant="outlined" onClick={toPdf}>Save as PDF</Button>}
                </Pdf>
                <Button onClick={()=>{history.push('/invoices/add')}} color="error" variant="outlined">Close</Button>
                </Stack>
        </Container>                    
                            
    </>
    )

}