import React,{useEffect, useState} from 'react';
import { Container,Box,Typography,TextField,Stack,LinearProgress,FormControl,InputLabel,Select,MenuItem } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import Appbar from "../Appbar";
import {API_CUSTOMERS} from '../../Utilities';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddCustomer({props}){

    const path=props.path;
    const contactId=props.computedMatch.params.id;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const customerDefaults={name:'',email:'',phone:'',address:'',state:''}
    const [customerDetails,setCustomerDetails]=useState(customerDefaults);
    const [loading,setLoading]=useState(false);
    const [requestType,setRequestType]=useState('Add');
    const [states,setStates]=useState([]);

    const handleChange=({target:{name,value}})=>setCustomerDetails({...customerDetails,[name]:value});
    

    const addCustomer=async()=>{
        console.log(customerDetails);
        setLoading(true);
        await axios.post(API_CUSTOMERS,{
            ...customerDetails,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200) {
                //setAlert({...alert,show:true,message:`${eventDetails.type} added successfully`,type:'success'});
               toast.success(`Customer added successfully`);
               clearInputFields();
               history.push('/customers');
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

    const updateContact=async()=>{
        setLoading(true);
        await axios.put(`${API_CUSTOMERS}/${contactId}`,{
            ...customerDetails,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200){
                //setAlert({...alert,show:true,message:`${eventDetails.type} updated successfully`,type:'success'});
                toast.success(`Customer updated successfully`);
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

    const clearInputFields=()=>setCustomerDetails(customerDefaults);

    useEffect(()=>{

        function findType(){
            if(path==='/customers/edit/:id') {
                setRequestType('Edit');
                getContactById(contactId);
            }
        }

        async function getContactById(contactId){
            await axios.get(`${API_CUSTOMERS}/id/${contactId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    console.log(res.data);
                    delete res.data._id;
                    delete res.data.userId;
                    delete res.data.createdAt;
                    console.log(res.data);
                    setCustomerDetails({...res.data});
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }

        findType();
        setStates([ "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttarakhand",
        "Uttar Pradesh",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli",
        "Daman and Diu",
        "Delhi",
        "Lakshadweep",
        "Puducherry"])

    },[path,contactId,authToken])

    return (
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container sx={{mt:2}}>
            <Box>
                <Typography variant="h4">{requestType} customer</Typography>
            </Box>
            <Stack direction="column" spacing={2} sx={{mt:2}}>
                <Stack direction="row" spacing={2}>
                    <TextField onChange={handleChange} value={customerDetails.name} fullWidth type="text" required variant="filled" name="name" label="Name"></TextField>
                    <TextField onChange={handleChange} value={customerDetails.email} fullWidth type="email" variant="filled" required name="email" label="Email"></TextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                <TextField onChange={handleChange} value={customerDetails.phone} fullWidth variant="filled" name="phone" label="Phone"></TextField>
                <FormControl fullWidth required>
                        <InputLabel id="event-state-label">State</InputLabel>
                        <Select
                            labelId="event-state-label"
                            id="event-state"
                            value={customerDetails.state}
                            name="state"
                            onChange={handleChange}
                            label="State"
                            variant="filled"
                        >
                            {states.map((state,index)=>{
                                return <MenuItem key={index} value={state}>{state}</MenuItem>
                            })}
                        </Select>
                </FormControl>
                </Stack>
                <TextField required onChange={handleChange} value={customerDetails.address} fullWidth multiline rows={4} variant="filled" name="address" label="Address"></TextField>    
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {requestType==='Add'
                    ?<LoadingButton onClick={addCustomer} loading={loading} variant="outlined" size="large" color="primary">Add customer</LoadingButton>
                    :<LoadingButton onClick={updateContact} loading={loading} variant="outlined" size="large">Update customer</LoadingButton>}
                    <LoadingButton  onClick={()=>setCustomerDetails(customerDefaults)} variant="outlined" size="large" color="warning">Clear</LoadingButton>
                    <LoadingButton onClick={()=>history.push(`/customers`)} variant="outlined" size="large" color="error">Close</LoadingButton>
                </Stack>
            </Stack>
        </Container>
        </>
    )

}