import React,{useEffect, useState} from 'react';
import { Container,Box,Typography,TextField,Stack,FormControl,MenuItem,InputLabel,Select,LinearProgress,TableContainer,TableBody,TableRow,TableCell,Button,Table,TableHead,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@mui/material"
import { DatePicker,LocalizationProvider,LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Appbar from "../Appbar";
import {API_CUSTOMERS,API_INVOICES,API_PRODUCTS} from '../../Utilities';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddInvoice({props}){

    const INVOICE='invoice';
    // const PURCHASE='purchase';
    // const QUOTE='quote';
    const path=props.path;
    const invoiceId=props.computedMatch.params.id;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const invoiceDefaults={no:'',date:new Date(),customer:'',products:[],subtotal:'',tax:'',total:'',type:'sales'}
    const [invoiceDetails,setInvoiceDetails]=useState(invoiceDefaults);
    const [customers,setCustomers]=useState([]);
    const [customerDetails,setCustomerDetails]=useState({phone:'',address:'',name:'',state:''});
    const [loading,setLoading]=useState(true);
    const [requestType,setRequestType]=useState('Add');
    const [invoiceType,setInvoiceType]=useState(INVOICE);
    const [addProductDialog,setAddProductDialog] =useState(false);
    const [products,setProducts]=useState([]);
    const [selectedProduct,setSelectedProduct]=useState({name:'',price:'',tax:'',hsn:'',stock:'',quantity:'',amount:''});
    const [invoiceNo,setInvoiceNo]=useState();

    // const handleChange=({target:{name,value}})=>setInvoiceDetails({...invoiceDetails,[name]:value});

    const addInvoice=async()=>{
        //const no=await getInvoiceNo();
        console.log('invoice details',invoiceDetails);
        setLoading(true);
        await axios.post(API_INVOICES,{
            ...invoiceDetails,no:invoiceNo,type:invoiceId,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200) {
                toast.success(`Invoice added successfully`);
                history.push(
                    {pathname:`/preview`,
                    state:{invoiceNo,invoiceDetails,customerDetails}}
                    );
                clearInputFields();
                setInvoiceDetails({...invoiceDetails,no:(invoiceDetails.no+1)});
            }
        }).catch(function(err){
            console.log(err.response);
            if(err.response.status===401) {
                toast.error('Log in to continue, redirecting');
                history.push('/login');
            } else{
                toast.error(err.response.data.message);
                setLoading(false);
            }
            
        })
        setLoading(false);
    }

    const updateInvoice=async()=>{
        setLoading(true);
        await axios.put(`${API_INVOICES}/${invoiceId}`,{
            ...invoiceDetails,type:invoiceType,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200){
                toast.success(`Invoice updated successfully`);
               // history.push(`/${invoiceType}s`);
               history.push(
                {pathname:`/preview`,
                state:{invoiceNo,invoiceDetails,customerDetails}}
                );
                clearInputFields();
            }
        }).catch(function(err){
            console.log(err.response);
            if(err.response.status===401) {
                toast.error('Log in to continue, redirecting');
                history.push('/login');
            } else{
                toast.error(err.response.data.message);
            }
            
        })
        setLoading(false);
    }

    const getCustomerDetails=async(e)=>{
        console.log(e.target.value);
        setInvoiceDetails({...invoiceDetails,customer:e.target.value});
        setLoading(true);
            await axios.get(`${API_CUSTOMERS}/id/${e.target.value}`,{
                headers:{auth:authToken}
            }).then(function(res){
                setCustomerDetails({...res.data});
            }).catch(function(err){
                console.log(err);
            })
        setLoading(false);
    }

    const productSelected=async(e)=>{
        console.log(e.target.value);
        setLoading(true);
            await axios.get(`${API_PRODUCTS}/id/${e.target.value}`,{
                headers:{auth:authToken}
            }).then(function(res){
                setSelectedProduct({...res.data,quantity:1,amount:0});
            }).catch(function(err){
                console.log(err);
            })
        setLoading(false);
    }

    const addProduct=()=>{
        invoiceDetails.products.push(selectedProduct);
        invoiceDetails.products.map((product)=>{
            return product.amount=parseFloat(product.quantity)*parseFloat(product.price);
          })
        addProductDialogClose();
        calculateTotals();
    }

    const calculateTotals=()=>{
        let subtotal=0;
        let tax=0;
        let total=0;
        invoiceDetails.products.map(product=>{
            tax+=(parseFloat(product.amount)*parseFloat(product.tax)/100)
            return subtotal+=parseFloat(product.amount)
        })
       total=subtotal+tax;
       setInvoiceDetails({...invoiceDetails,subtotal,tax,total});
    }

    const removeAddedProduct=(id)=>{
        const idMatch=(product)=>product._id===id;
        const index=invoiceDetails.products.findIndex(idMatch);
        invoiceDetails.products.splice(index,1);
        calculateTotals();
        addProductDialogOpen();
    }

    const updateQtyAmt=(e)=>setSelectedProduct({...selectedProduct,quantity:e.target.value});
    const changeInvoiceNo=(e)=>setInvoiceNo(e.target.value);
    const addProductDialogOpen=()=>setAddProductDialog(true);
    const addProductDialogClose=()=>setAddProductDialog(false);

    const clearInputFields=()=>setInvoiceDetails({...invoiceDetails,invoiceDefaults});

    useEffect(()=>{
        
        async function getCustomers(){
            setLoading(true);
            await axios.get(API_CUSTOMERS,{
                headers:{auth:authToken}
            }).then(function(res){
                setCustomers(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        async function getProducts(){
            setLoading(true);
            await axios.get(API_PRODUCTS,{
                headers:{auth:authToken}
            }).then(function(res){
                setProducts(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        function findType(){
            if(path==='/invoices/add') {
                setInvoiceType(INVOICE);
                getInvoiceNo();
            }
            // if(path==='/purchase/add') setInvoiceType(PURCHASE);
            // if(path==='/quote/add') setInvoiceType(QUOTE);
            if(path==='/invoices/edit/:id') {
                setRequestType('Edit');
                setInvoiceType(INVOICE);
                getInvoiceById(invoiceId);
            }
        }

        async function getInvoiceNo(){
            let prevNo=0;
           setLoading(true);
            await axios.get(`${API_INVOICES}/no`,{
                headers:{auth:authToken}
            }).then(function(res){
               prevNo= res.data[0].no;
            }).catch(function(err){
                prevNo=0;
                console.log(err);
            })
           setLoading(false);
           setInvoiceNo(prevNo+1);
        }

        async function getInvoiceById(id){
            await axios.get(`${API_INVOICES}/id/${id}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    delete res.data._id;
                    delete res.data.userId;
                    delete res.data.createdAt;
                    console.log('get invoice edit',res.data);
                    setInvoiceDetails({...res.data});
                    setInvoiceNo(res.data.no);
                    getCustomerDetailsById(res.data.customer);
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }

        async function getCustomerDetailsById(id){
            await axios.get(`${API_CUSTOMERS}/id/${id}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    delete res.data._id;
                    delete res.data.userId;
                    delete res.data.createdAt;
                    console.log('customer details edit',res.data);
                    setCustomerDetails({...res.data});
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }
    

        getCustomers();
        getProducts();
        findType();

    },[authToken,path,invoiceId])

    return (
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container sx={{mt:2}}>
            <Box>
                {/* <Typography variant="h4">{requestType} {invoiceDetails.type}</Typography> */}
                <Typography variant="h4">{requestType} invoice</Typography>
            </Box>
            <Stack direction="column" spacing={2} sx={{mt:2}}>
            <Stack direction="row" spacing={1} justifyContent="space-between">
             <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2}>
                <FormControl fullWidth required sx={{minWidth:240}}>
                        <InputLabel id="invoice-customer-label">Customer</InputLabel>
                            <Select
                                labelId="invoice-customer-label"
                                id="invoice-customer"
                                label="Customer"
                                name="customer"
                                value={invoiceDetails.customer}
                                onChange={getCustomerDetails}
                                variant="filled">
                                {customers.map((customer,index)=>{
                                    return <MenuItem key={index} value={customer._id}>{customer.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <TextField disabled value={customerDetails.phone} fullWidth variant="filled" name="phone" label="Phone"></TextField>
                        <TextField disabled value={customerDetails.state} fullWidth variant="filled" name="state" label="State"></TextField>
                        </Stack>
                         <TextField disabled value={customerDetails.address} fullWidth multiline rows={2} variant="filled" name="address" label="Address"></TextField>                 
                    </Stack>
                    <Stack spacing={2}>
                    <TextField onChange={changeInvoiceNo} value={invoiceNo} fullWidth required variant="filled" name="no" label="Invoice No"></TextField>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                        label="Invoice date"
                        value={invoiceDetails.date}
                        inputFormat='dd-MM-yyyy'
                        onChange={(newDate)=>{
                            setInvoiceDetails({...invoiceDetails,date:newDate});
                          }}
                        renderInput={(params)=><TextField fullWidth required variant="filled" {...params}/>}
                        ></DatePicker>
                    </LocalizationProvider>
                    
                    </Stack>
                </Stack>
                <hr/>
            <TableContainer>
            <Table sx={{minWidth: 650}} aria-label="products-table">
            <TableHead>
            <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price (₹)</TableCell>
                <TableCell>Tax %</TableCell>
                <TableCell>HSN code</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell align='right'>Amount</TableCell>
                <TableCell align='right'>Actions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
           {(invoiceDetails.products.length>0)? invoiceDetails.products.map((product,index)=>{
               return(
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th':{border:0}}}>
                        <TableCell component="th" scope="row">{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.tax}</TableCell>
                        <TableCell>{product.hsn}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell align='right'>{product.amount}</TableCell>
                        <TableCell align='right'>
                            <Button onClick={()=>{removeAddedProduct(product._id)}} variant="outlined" color="error" size="small">Delete</Button>
                        </TableCell>
                    </TableRow>
               )}):<></>
            }
            </TableBody>
            </Table>
            </TableContainer>
            <LoadingButton onClick={addProductDialogOpen} loading={loading} variant="outlined" size="large" color="primary">Add product</LoadingButton>

            <Dialog size="md"
                open={addProductDialog}
                onClose={addProductDialogClose}
                aria-labelledby="alert-add-product"
                aria-describedby="alert-add-product">

                <DialogTitle id="add-product-title">
                {"Add product"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-add-product">
                        Select a product to add
                    </DialogContentText>
                <Stack direction="row" spacing={1}>
                <FormControl fullWidth required sx={{minWidth:240}}>
                        <InputLabel id="invoice-product-label">Product</InputLabel>
                            <Select
                                labelId="invoice-product-label"
                                id="invoice-product"
                                label="product"
                                name="product"
                                onChange={productSelected}
                                variant="filled">
                                {products.map((product,index)=>{
                                    return <MenuItem key={index} value={product._id}>{product.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <TextField disabled value={selectedProduct.price} fullWidth variant="filled" name="price" label="Price"></TextField>
                        <TextField disabled value={selectedProduct.tax} fullWidth variant="filled" name="tax" label="Tax"></TextField>
                        <TextField disabled value={selectedProduct.hsn} fullWidth variant="filled" name="hsn" label="HSN"></TextField>
                        <TextField onChange={updateQtyAmt} value={selectedProduct.quantity} fullWidth variant="filled" name="qty" label="Quantity"></TextField>
                </Stack>
                </DialogContent>
                <DialogActions>
                <Button onClick={addProductDialogClose}>Close</Button>
                <Button onClick={addProduct} autoFocus>
                    Add product
                </Button>
                </DialogActions>
            </Dialog>
            <hr/>

            <Stack direction="row" justifyContent="flex-end" spacing={3}>
                <Stack direction="column" spacing={2}>
                   <Typography variant="h6">Subtotal</Typography>
                   <Typography variant="h6">Tax</Typography>
                   <Typography variant="h6">Total</Typography>
                </Stack>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h5" fontWeight="bold">{invoiceDetails.subtotal}</Typography>
                   <Typography variant="h5" fontWeight="bold">{invoiceDetails.tax}</Typography>
                   <Typography variant="h5" fontWeight="bold">{invoiceDetails.total}</Typography>
                </Stack>
            </Stack>

                <Stack spacing={2}>
                    {/* {invoiceDetails.type===MEETING?<TextField onChange={handleChange} value={invoiceDetails.link} fullWidth variant="outlined" name="link" label="Link"></TextField>:<></>}
                    {invoiceDetails.type===APPOINTMENT?<TextField onChange={handleChange} value={invoiceDetails.location} fullWidth variant="outlined" name="location" label="Location"></TextField>:<></>} */}
                    {/* {invoiceType===PURCHASE?<TextField onChange={handleChange} value={invoiceDetails.link} fullWidth variant="outlined" name="link" label="Link"></TextField>:<></>}
                    {invoiceType===QUOTE?<TextField onChange={handleChange} value={invoiceDetails.location} fullWidth variant="outlined" name="location" label="Location"></TextField>:<></>} */}
                    {/* {requestType==='Edit'?<FormControl fullWidth required>
                        <InputLabel id="event-status-label">Status</InputLabel>
                        <Select
                            labelId="event-status-label"
                            id="event-status"
                            value={invoiceDetails.status}
                            name="status"
                            onChange={handleChange}
                            label="Status"
                        >
                            <MenuItem sx={{color:"green"}} value={'Completed'}>Completed</MenuItem>
                            <MenuItem sx={{color:"magenta"}} value={'In progress'}>In progress</MenuItem>
                            <MenuItem sx={{color:"blue"}} value={'Scheduled'}>Scheduled</MenuItem>
                            <MenuItem sx={{color:"red"}} value={'Cancelled'}>Cancelled</MenuItem>
                        </Select>
                    </FormControl>:<></>} */}
                   
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {requestType==='Add'
                    ?<LoadingButton onClick={addInvoice} loading={loading} variant="outlined" size="large" color="primary">Add {invoiceType}</LoadingButton>
                    :<LoadingButton onClick={updateInvoice} loading={loading} variant="outlined" size="large">Update {invoiceType}</LoadingButton>}
                    <LoadingButton  variant="outlined" size="large" color="warning">Clear</LoadingButton>
                    <LoadingButton onClick={()=>history.push(`/invoices`)} variant="outlined" size="large" color="error">Close</LoadingButton>
                </Stack>
            </Stack>
        </Container>
        </>
    )

}