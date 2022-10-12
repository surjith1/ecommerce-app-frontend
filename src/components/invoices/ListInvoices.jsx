import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Typography,Button,Container,Box,LinearProgress,Table,TableBody,TableCell,TableHead,TableContainer,TableRow,Dialog,DialogTitle,DialogContent, DialogContentText, DialogActions} from '@mui/material';
import {API_ORDERS} from '../../Utilities';
import { toast } from 'react-toastify';
import {LoadingButton} from '@mui/lab';

export default function Invoices(){

    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const [invoices,setInvoices]=useState([]);
    const [loading,setLoading]=useState(true);
    const [deleted,setDeleted]=useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteDialog,setDeleteDialog]=useState(false);

    const handleDeleteButton=(id)=>{
        setDeleteDialog(true);
        setDeleteId(id);
    }

    const closeDeleteDialog=()=>setDeleteDialog(false);

    const deleteInvoice=async()=>{
        if(deleteId!==null) {
            setLoading(true);
            await axios.delete(`${API_ORDERS}/${deleteId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                console.log(res);
                if(res.status===200) {
                    toast.success('Order deleted successfully');
                    closeDeleteDialog();
                    setDeleted(deleteId);
                }
            }).catch(function(err){
                console.log(err);
                toast.error('Order delete failed');
            })
            setLoading(false);
        }
    }

    useEffect(()=>{
        
        async function getInvoices(){
            setLoading(true);
            await axios.get(API_ORDERS,{
                headers:{auth:authToken},
            }).then(function(res){
                console.log(res.data);
                setInvoices(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        getInvoices();
          
    },[authToken,deleted])

    return(
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container>
        <Box sx={{mt:2,width:'100%'}}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">

        </Stack>    
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Typography variant="h4" sx={{marginRight:'auto'}}>Invoices</Typography>
            <Button variant="contained" color="primary" size="large" onClick={()=>history.push(`/invoices/add`)}>Add invoice</Button>
        </Stack>
        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
            <TableHead>
            <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Invoice no</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
           {(invoices.length>0)? invoices.map((invoice,index)=>{
               return(
                    <TableRow key={index}>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.no}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.subtotal}</TableCell>
                        <TableCell>{invoice.tax}</TableCell>
                        <TableCell>{invoice.total}</TableCell>
                        <TableCell>
                        <Stack direction="row" spacing={1} sx={{height:'auto'}}>
                                <Button onClick={()=>history.push(`/invoices/edit/${invoice._id}`)} variant="outlined" color="secondary" size="small">Edit</Button>
                                <Button onClick={()=>handleDeleteButton(invoice._id)} variant="outlined" color="error" size="small">Delete</Button>
                        </Stack>
                        </TableCell>
                        </TableRow>
               )
              
           }):<></>}
           {/* loading?<p>{`Loading invoices`}</p>:<p>{`No invoices to display`}</p> */}
           </TableBody>
            </Table>
            </TableContainer>
        </Box>
        </Container>
        <Dialog
            open={deleteDialog}
            onClose={closeDeleteDialog}
        >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent><DialogContentText>Are you sure to delete selected invoice? This cannot be undone</DialogContentText></DialogContent>
        <DialogActions>
            <LoadingButton onClick={closeDeleteDialog} color="primary">No, don't delete</LoadingButton>
            <LoadingButton loading={loading} onClick={deleteInvoice} color="error" variant="contained">Yes, delete</LoadingButton>
        </DialogActions>
        </Dialog>
        </>
    )

}