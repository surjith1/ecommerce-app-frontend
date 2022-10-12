import React,{useEffect, useState} from 'react';
import { Container,Box,Typography,TextField,Stack,LinearProgress,FormControl,FormControlLabel,Radio,RadioGroup, FormLabel,Button } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import Appbar from "../Appbar";
import {API_PRODUCTS,BASE_URL} from '../../Utilities';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddProduct({props}){

    const path=props.path;
    const productId=props.computedMatch.params.id;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const productDefaults={name:'',price:'',salePrice:'',tax:'',hsn:'',stock:'',description:'',assured:false,deliveryCharge:0,img:'/prod-default.jpg'}
    const [productDetails,setProductDetails]=useState(productDefaults);
    const [loading,setLoading]=useState(false);
    const [requestType,setRequestType]=useState('Add');
    const [bulletPoints,setBulletPoints]=useState(['']);

    const handleChange=({target:{name,value}})=>setProductDetails({...productDetails,[name]:value});
    
    const handleBulletPointAdd=()=>{
        if(bulletPoints.length>4) { toast.error('You can add maximum of 5 bullet points')}
        else setBulletPoints([...bulletPoints,'']);
    }
    const handleBulletPointRemove=(index)=>{
        if(bulletPoints.length<=1) { toast.error('Add atleast one bullet point')}
        else {const tempBulletPoints=[...bulletPoints];
        tempBulletPoints.splice(index,1);
        setBulletPoints(tempBulletPoints);}
    }
    const handleBulletPointText=({target:{name,value}})=>{
        const tempBulletPoints=[...bulletPoints];
        tempBulletPoints[name]=value;
        setBulletPoints(tempBulletPoints);
    }

    // const handleUploadClick = event => {
    //     console.log();
    //     var file = event.target.files[0];
    //     const reader = new FileReader();
    //     var url =  reader.readAsDataURL(file);       
    // }

    // const uploadImg=async({target:{name,value}})=>{
    //     console.log(name,value);
      
    //     const formData=new FormData();
    //     formData.append('prod-img',name);
    //     const config={
    //         headers:{
    //             'content-type':'multipart/form-data'
    //         }
    //     }
    //     await axios.post(`${API_PRODUCTS}/img`,formData,config).then((response=>{
    //         console.log('uploaded',response);
    //     }).catch((error)=>{
    //         console.log(error);
    //     }))
    //     // await axios.post(`${API_PRODUCTS}/img`,{
    //     //     formData,
    //     // },{
    //     //     headers:{auth:authToken,config:config}
    //     // }).then(function(res){
    //     //     if(res.status===200) {
    //     //         //setAlert({...alert,show:true,message:`${eventDetails.type} added successfully`,type:'success'});
    //     //        toast.success(`Product added successfully`);
    //     //        clearInputFields();
    //     //        history.push('/products');
    //     //     }
    //     // }).catch(function(err){
    //     //     console.log(err.response);
    //     //     if(err.response.status===401) {
    //     //         toast.error('Log in to continue, redirecting');
    //     //         history.push('/login');
    //     //     } else{
    //     //        toast.error(err.response.data.message);
    //     //         setLoading(false);
    //     //     }
            
    //     // })

    //     //setProductDetails({...productDetails,img:value});

    // }

    const addProduct=async()=>{
        setLoading(true);
        await axios.post(API_PRODUCTS,{
            ...productDetails,bulletPoints,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200) {
                //setAlert({...alert,show:true,message:`${eventDetails.type} added successfully`,type:'success'});
               toast.success(`Product added successfully`);
               clearInputFields();
               history.push('/products');
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

    const updateProduct=async()=>{
        setLoading(true);
        await axios.put(`${API_PRODUCTS}/${productId}`,{
            ...productDetails,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200){
                //setAlert({...alert,show:true,message:`${eventDetails.type} updated successfully`,type:'success'});
                toast.success(`Product updated successfully`);
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

    const clearInputFields=()=>setProductDetails(productDefaults);

    const uploadHandler=async(event)=> {
        const data = new FormData();
        data.append('file', event.target.files[0]);
       await axios.post(`${API_PRODUCTS}/img`, data)
          .then((res) => {
            console.log(res.data);
            setProductDetails({...productDetails,img:`${BASE_URL}/${res.data.filename}` })
          });
      }

    // const imgSubmit=async(event)=>{
    //     event.preventDefault();
    //     console.log(event.target.value);

    //     await axios.post(`${API_PRODUCTS}/imgSubmit`,event.target.value).then(
    //         function(response){
    //             console.log(response);
    //         }).catch(function(error){
    //             console.log(error);
    //         })
    // }

    useEffect(()=>{

        function findType(){
            if(path==='/products/edit/:id') {
                setRequestType('Edit');
                getProductById(productId);
            }
        }

        async function getProductById(productId){
            await axios.get(`${API_PRODUCTS}/id/${productId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    console.log(res.data);
                    delete res.data._id;
                    delete res.data.userId;
                    delete res.data.createdAt;
                    console.log(res.data);
                    setProductDetails({...res.data});
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }

        findType();

    },[path,productId,authToken])

    return (
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container sx={{mt:2}}>
            <Box>
                <Typography variant="h4">{requestType} product</Typography>
            </Box>
            <Stack direction="column" spacing={2} sx={{mt:2}}>
                <Stack direction="row" spacing={2}>
                    <TextField onChange={handleChange} value={productDetails.name} fullWidth type="text" required variant="filled" name="name" label="Name"></TextField>
                    <TextField onChange={handleChange} value={productDetails.price} fullWidth type="text" variant="filled" required name="price" label="Price (₹)"></TextField>
                    <TextField onChange={handleChange} value={productDetails.salePrice} fullWidth type="text" variant="filled" required name="salePrice" label="Sale Price (₹)"></TextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField onChange={handleChange} value={productDetails.tax} required fullWidth variant="filled" name="tax" label="Tax %"></TextField>
                    <TextField onChange={handleChange} value={productDetails.hsn} fullWidth variant="filled" name="hsn" label="HSN code"></TextField>
                    <TextField onChange={handleChange} value={productDetails.stock} required fullWidth variant="filled" name="stock" label="Stock in hand"></TextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField onChange={handleChange} value={productDetails.deliveryCharge} required fullWidth variant="filled" name="deliveryCharge" label="Delivery charges"></TextField>
                    <TextField onChange={handleChange} value={productDetails.description} fullWidth variant="filled" name="description" label="Description"></TextField>
                </Stack>
                <Stack direction="column" spacing={2}>
                    <Typography>Product bullet points</Typography>
                    {bulletPoints.map((point,index)=>{
                        return (
                        <Stack direction="row" spacing={2} key={index}>
                            <TextField size="small" onChange={handleBulletPointText} value={point} fullWidth variant="filled" name={index} label="Bullet point"></TextField>
                            <Button size="small" color="error" variant="contained" onClick={()=>{handleBulletPointRemove(index)}}>Remove</Button>
                        </Stack>)
                    })}
                    <Stack maxWidth="10%">
                        <Button size="small" color="primary" variant="contained" onClick={()=>{handleBulletPointAdd()}}>Add</Button>
                    </Stack>
                </Stack>
                <Typography>Product image</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <img alt="prod-img" src={productDetails.img} width="280px" height="240px"></img>
                    {/* <label htmlFor="contained-button-file"> */}
                        {/* <Input onChange={uploadImg} accept="image/*" id="contained-button-file" type="file" /> */}
                        {/* <Button component="span">Upload image</Button> */}
                        {/* <Input
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleUploadClick}
                        /> */}
                    {/* </label> */}
                    <input type="file" name="file" onChange={uploadHandler}/>
                    <Button color="error">Remove image</Button>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                <FormLabel>Assured</FormLabel>
                <FormControl>
                    <RadioGroup row>
                        <FormControlLabel onChange={handleChange} value="yes" name="assured" label="Yes" control={<Radio/>}></FormControlLabel>
                        <FormControlLabel onChange={handleChange} value="no"  name="assured" label="No" control={<Radio/>}></FormControlLabel>
                    </RadioGroup>
                </FormControl>
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {requestType==='Add'
                    ?<LoadingButton onClick={addProduct} loading={loading} variant="outlined" size="large" color="primary">Add product</LoadingButton>
                    :<LoadingButton onClick={updateProduct} loading={loading} variant="outlined" size="large">Update product</LoadingButton>}
                    <LoadingButton  onClick={()=>setProductDetails(productDefaults)} variant="outlined" size="large" color="warning">Clear</LoadingButton>
                    <LoadingButton onClick={()=>history.push(`/products`)} variant="outlined" size="large" color="error">Close</LoadingButton>
                </Stack>
            </Stack>
        </Container>
        </>
    )

}