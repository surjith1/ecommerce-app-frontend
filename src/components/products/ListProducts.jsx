import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Typography,Button,Container,Box,LinearProgress,Table,TableBody,TableCell,TableHead,TableContainer,TableRow,Dialog,DialogTitle,DialogContent, DialogContentText, DialogActions} from '@mui/material';
import {API_PRODUCTS} from '../../Utilities';
import { toast } from 'react-toastify';
import {LoadingButton} from '@mui/lab';

export default function Products(){

    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const [products,setProducts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [deleted,setDeleted]=useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteDialog,setDeleteDialog]=useState(false);

    const handleDeleteButton=(id)=>{
        setDeleteDialog(true);
        setDeleteId(id);
    }

    const closeDeleteDialog=()=>setDeleteDialog(false);

    const deleteProduct=async()=>{
        if(deleteId!==null){
            setLoading(true);
            await axios.delete(`${API_PRODUCTS}/${deleteId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                console.log(res);
                if(res.status===200) {
                    toast.success('Product deleted successfully');
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
        
        async function getProducts(){
            setLoading(true);
            await axios.get(API_PRODUCTS,{
                headers:{auth:authToken},
            }).then(function(res){
                setProducts(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        getProducts();
          
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
            <Typography variant="h4" sx={{marginRight:'auto'}}>Products</Typography>
            <Button variant="contained" color="primary" size="large" onClick={()=>history.push(`/products/add`)}>Add product</Button>
        </Stack>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price (₹)</TableCell>
                <TableCell>Tax %</TableCell>
                <TableCell>HSN code</TableCell>
                <TableCell>Stock in hand</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
           {(products.length>0)? products.map((product,index)=>{
               return(
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {product.name}
                        </TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.tax}</TableCell>
                        <TableCell>{product.hsn}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                        <Stack direction="row" spacing={1} sx={{height:'auto'}}>
                                <Button onClick={()=>history.push(`/products/edit/${product._id}`)} variant="outlined" color="secondary" size="small">Edit</Button>
                                <Button onClick={()=>handleDeleteButton(product._id)} variant="outlined" color="error" size="small">Delete</Button>
                        </Stack>
                        </TableCell>
                        </TableRow>
               )
               
           }):loading?<p>{`Loading products`}</p>:<p>{`No products to display`}</p>}
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
        <DialogContent><DialogContentText>Are you sure to delete selected product? This cannot be undone</DialogContentText></DialogContent>
        <DialogActions>
            <LoadingButton onClick={closeDeleteDialog} color="primary">No, don't delete</LoadingButton>
            <LoadingButton loading={loading} onClick={deleteProduct} color="error" variant="contained">Yes, delete</LoadingButton>
        </DialogActions>
        </Dialog>
        </>
    )

}