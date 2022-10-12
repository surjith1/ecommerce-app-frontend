
import Appbar from './Appbar';
import {TextField,Grid,Stack,Card,Typography,Radio,RadioGroup,FormControl,FormControlLabel} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CartPrices from './CartPrices';
import { API_ORDERS, BASE_URL } from '../Utilities';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

export default function Checkout(){

    const history=useHistory();

    const authToken=localStorage.getItem('auth-token');
    const [checkout,setCheckout]=useState({name:'',phone:'',email:'',address:'',pincode:''})

    const cartItems=JSON.parse(localStorage.getItem('cartItems'));

    const handleChange=({target:{name,value}})=>setCheckout({...checkout,[name]:value});

    const calculatePrice=()=>{
        let sum=0;
        cartItems.map(item=>{
            return sum+=parseFloat(item.price);
        })
        return sum.toFixed(2);
    }

    const calculateDiscount=()=>{
        let sum=0;
        cartItems.map(item=>{
            return sum+=parseFloat(item.price)-parseFloat(item.salePrice);
        })
        return sum.toFixed(2);
    }

    const calcaulateDeliveryCharges=()=>{
        let sum=0;
        cartItems.map(item=>{
            return sum+=parseFloat(item.deliveryCharge);
        })
        return sum.toFixed(2);
    }

    const calculateTotal=()=>(parseFloat(calculatePrice())-parseFloat(calculateDiscount())+parseFloat(calcaulateDeliveryCharges())).toFixed(2);

    const loadScript=(src)=>{
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const validateCheckout=()=>{
        if(checkout.name.length===0) toast.error('Enter your name')
        else if (checkout.phone.length===0 || checkout.phone.length>10) toast.error('Enter a valid phone number');
        else if(checkout.address.length===0) toast.error('Enter an address');
        else if (checkout.email.length===0) toast.error('Enter your email address');
        else if (checkout.pincode.length===0 || checkout.pincode.length!==6) toast.error('Enter a valid pincode');
        else razorpayPayment();
    }

    const razorpayPayment=async()=>{



        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Razorpay SDK failed to load, try again");
            return;
        }
        // creating a new order
        // const result= await axios.post(`${BASE_URL}/orders/payment`,{
        //     amount:10000,
        // },{
        //     headers:{auth:authToken}
        // }).then(function(res){
        //     if(res.status===200) {
              
        //     }
        // }).catch(function(err){
        //     console.log(err.response);
            
        // })
        const result = await axios.post(`${BASE_URL}/orders/payment`,{amount:calculateTotal()*100});
        if (!result) {
            alert("Server error,try again");
            return;
        }
        const { amount, id: order_id, currency } = result.data;
        const options = {
            key: "rzp_test_Vp7VdGZjjSATY3",
            amount: amount.toString(),
            currency: currency,
            name: checkout.name,
            description: "Demo Transaction",
            //image: { logo },
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post(`${BASE_URL}/orders/payment/success`, data);
                //console.log('payment callback',result);
                if(result.data.msg==='success') {
                    await axios.post(API_ORDERS,{
                        ...checkout,cartItems,
                    },{
                        headers:{auth:authToken}
                    }).then(function(res){
                        if(res.status===200) {
                            localStorage.setItem('cartItems',JSON.stringify([]));
                            history.push('/order-received');
                        }
                    }).catch(function(err){
                        console.log(err.response);
                        if(err.response.status===401) {
                            toast.error('Payment failed or cancelled , try again later');
                            history.push('/checkout');
                        } else{
                           toast.error(err.response.data.message);
                        }
                        
                    })
                }
            },
            prefill: {
                name: checkout.name,
                email: checkout.email,
                contact:checkout.phone,
            },
            notes: {
                address: checkout.address,
            },
            theme: {
                color: "#3674f0",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    }

    return(
        <>
            <Appbar/>
            <Grid>
                <Stack sx={{padding:'40px'}} direction="row" spacing={1}>
                    <Stack sx={{padding:'20px',minWidth:'70%'}} spacing={1}> 
                        <Card sx={{padding:'20px',minWidth:'70%'}}>
                            <Stack sx={{maxWidth:'50%'}} spacing={2}>
                                <Typography variant="h5">Delivery address</Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField onChange={handleChange} required size="small" placeholder="Name" variant="outlined" name="name" ></TextField>
                                    <TextField onChange={handleChange} required size="small" placeholder="Phone number" variant="outlined" name="phone" ></TextField>
                                </Stack>
                                <Stack>
                                    <TextField onChange={handleChange} required size="small" placeholder="Address" cols={20} rows={5} variant="outlined" name="address" ></TextField>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                <TextField onChange={handleChange} required size="small" placeholder="Email address" variant="outlined" name="email" ></TextField>
                                <TextField onChange={handleChange} required size="small" placeholder="Pincode" variant="outlined" name="pincode" ></TextField>
                            </Stack>
                            </Stack>
                        </Card>

                        <Card sx={{padding:'20px',minWidth:'70%'}}>
                           
                            <Typography variant="h5">Payment method</Typography>
                            <FormControl>
                                <RadioGroup>
                                    <FormControlLabel checked={true} value="credit" label="Credit, Debit cards/Netbanking/Wallets (Razorpay)" control={<Radio/>}></FormControlLabel>
                                    {/* <FormControlLabel value="cash" label="Cash on delivery" control={<Radio/>}></FormControlLabel> */}
                                </RadioGroup>
                                <LoadingButton onClick={validateCheckout} sx={{padding:'12px',fontSize:'18px',backgroundColor:'#ee631d',color:'#fff','&:hover':{backgroundColor:'#ac420d'}}}>Place order</LoadingButton>
                            </FormControl>
                        </Card>

                        </Stack>
                        
                        <CartPrices/>

                </Stack>
            </Grid>
        </>
    )

}