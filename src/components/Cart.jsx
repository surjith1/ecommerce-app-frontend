
import Appbar from './Appbar';
import {Grid,Stack,Card, Typography} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CartPrices from './CartPrices';

export default function Cart(){

    const history=useHistory();
    const [cartItems,setCartItems]=useState(JSON.parse(localStorage.getItem('cartItems')));

    const calculateDiscountPercentage=(price,salePrice)=>(100*(price-salePrice)/price).toFixed();
    
    const removeCartItem=(index)=>{
        cartItems.splice(index,1);
        localStorage.setItem('cartItems',JSON.stringify(cartItems));
        setCartItems(JSON.parse(localStorage.getItem('cartItems')));
    }

    console.log(cartItems);

    return(
        <>
            <Appbar/>
            <Grid sx={{backgroundColor:'#f1f3f6'}}>
                <Stack sx={{backgroundColor:'#f1f3f6',padding:'30px 80px 30px 80px'}}>
                    <Stack direction="row" spacing={1}>
                        <Card sx={{padding: '20px',minWidth:'70%'}}>
                            <Typography variant="h6">My cart</Typography>
                            <hr/>
                            {cartItems.map((item,index)=>{
                            return(
                                <Stack direction="row" alignItems="center" key={index}>
                                <Stack padding={2}>
                                    <img alt="main-img" src={item.img} height="100px" width="160px"></img>
                                </Stack>
                                <Stack>
                                    <Typography variant="h6">{item.name}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography width="auto" fontSize="22px" fontWeight="bold">₹{item.salePrice}</Typography>
                                        <Typography sx={{textDecoration:'line-through',fontSize:'16px',color:'gray' }}>₹{item.price} </Typography>
                                        <Typography sx={{color:'green'}}>{calculateDiscountPercentage(item.price,item.salePrice)}% off</Typography>
                                    </Stack>
                                    <Stack width="80px">
                                        <LoadingButton onClick={()=>{removeCartItem(index)}} variant="contained" size="small" color="error">Remove</LoadingButton>
                                    </Stack>
                                </Stack>
                                <hr/>
                            </Stack>
                            )
                            })}
                        </Card>
                        <CartPrices/>
                        {/* <Card sx={{padding:'20px',width:'100%'}}>
                            <Typography variant="h6">Price details</Typography>
                            <hr/>
                            <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography>Price</Typography>
                                    <Typography>{calculatePrice()}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography>Discount</Typography>
                                    <Typography>-{calculateDiscount()}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography>Delivery charges</Typography>
                                    <Typography>{calcaulateDeliveryCharges()}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="h5">Total</Typography>
                                    <Typography variant="h5">{calculateTotal()}</Typography>
                                </Stack>
                            </Stack>
                        </Card> */}
                        
                    </Stack>
                    <Stack sx={{width:'300px',marginLeft:'auto',paddingTop:'10px'}}>
                        <LoadingButton onClick={()=>{history.push('/checkout')}} className="loading-btn" sx={{padding:'18px',fontSize:'18px',backgroundColor:'#ee631d',color:'#fff','&:hover':{backgroundColor:'#ac420d'}}}>Place order</LoadingButton>
                    </Stack>
                </Stack>
                
            </Grid>
        </>
    )

}