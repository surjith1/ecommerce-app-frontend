import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Typography,Button,Container,Box,LinearProgress,Table,TableBody,TableCell,TableHead,TableContainer,TableRow,Dialog,DialogTitle,DialogContent, DialogContentText, DialogActions} from '@mui/material';
import {API_CUSTOMERS} from '../../Utilities';
import { toast } from 'react-toastify';
import {LoadingButton} from '@mui/lab';

export default function Customers(){

    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const [customers,setCustomers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [deleted,setDeleted]=useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteDialog,setDeleteDialog]=useState(false);

    const handleDeleteButton=(id)=>{
        setDeleteDialog(true);
        setDeleteId(id);
    }

    const closeDeleteDialog=()=>setDeleteDialog(false);

    const deleteCustomer=async()=>{
        if(deleteId!==null) {
            setLoading(true);
            await axios.delete(`${API_CUSTOMERS}/${deleteId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                console.log(res);
                if(res.status===200) {
                    toast.success('Customer deleted successfully');
                    closeDeleteDialog();
                    setDeleted(deleteId);
                }
            }).catch(function(err){
                console.log(err);
                toast.error('Customer delete failed');
            })
            setLoading(false);
        }
    }

    useEffect(()=>{
        
        async function getCustomers(){
            setLoading(true);
            await axios.get(API_CUSTOMERS,{
                headers:{auth:authToken},
            }).then(function(res){
                setCustomers(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        getCustomers();
          
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
            <Typography variant="h4" sx={{marginRight:'auto'}}>Customers</Typography>
            <Button variant="contained" color="primary" size="large" onClick={()=>history.push(`/customers/add`)}>Add customer</Button>
        </Stack>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
           {(customers.length>0)? customers.map((customer,index)=>{
               return(
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {customer.name}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{customer.state}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                        <Stack direction="row" spacing={1} sx={{height:'auto'}}>
                                <Button onClick={()=>history.push(`/customers/edit/${customer._id}`)} variant="outlined" color="secondary" size="small">Edit</Button>
                                <Button onClick={()=>handleDeleteButton(customer._id)} variant="outlined" color="error" size="small">Delete</Button>
                        </Stack>
                        </TableCell>
                        </TableRow>
               )
               
           }):loading?<p>{`Loading customers`}</p>:<p>{`No customers to display`}</p>}
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
        <DialogContent><DialogContentText>Are you sure to delete selected customer? This cannot be undone</DialogContentText></DialogContent>
        <DialogActions>
            <LoadingButton onClick={closeDeleteDialog} color="primary">No, don't delete</LoadingButton>
            <LoadingButton loading={loading} onClick={deleteCustomer} color="error" variant="contained">Yes, delete</LoadingButton>
        </DialogActions>
        </Dialog>
        </>
    )

}