import { Chip, Grid, Rating, Stack, Typography } from '@mui/material';
import Appbar from './Appbar';
import { Star,ShoppingCart,FlashOn } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { API_PRODUCTS } from '../Utilities';
import { useHistory } from 'react-router-dom';

export default function SingleProductView(props){

    const history=useHistory();
    console.log(props.match.params.id);
    const productId=props.match.params.id;
    const authToken=localStorage.getItem('auth-token');
    const productDefaults={name:'',price:'',salePrice:'',tax:'',hsn:'',stock:'',description:'',assured:false,deliveryCharge:0,bulletPoints:[],img:'http://localhost:3000/prod-default.jpg'}
    const [productDetails,setProductDetails]=useState(productDefaults);

    const calculateDiscountPercentage=(price,salePrice)=>(100*(price-salePrice)/price).toFixed();

    const addToCart=()=>{
        let cartItems=[];
        cartItems=JSON.parse(localStorage.getItem('cartItems'));
        if(cartItems!==null){
            cartItems.push(productDetails);
            localStorage.setItem('cartItems',JSON.stringify(cartItems));
        } else{
            localStorage.setItem('cartItems',JSON.stringify([cartItems]));
        }
        history.push('/cart');
        
        // cartItems=JSON.parse(localStorage.getItem('cartItems'));
        //localStorage.setItem('cartItems',JSON.stringify(cartItems));
    }

    const directCheckout=()=>{
        addToCart();
        history.push('/checkout');
    }

    useEffect(()=>{

        async function getProductById(){
            await axios.get(`${API_PRODUCTS}/id/${productId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    console.log(res.data);
                    setProductDetails(res.data);
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }

       getProductById();

    },[productId,authToken]);

    return(
        <>
           <Appbar/>
           <Grid padding={2}>
               <Stack direction="row" spacing={2}>
                   <Stack padding={8} sx={{border:'0.1pt solid', borderColor:'#ccc'}}>
                        <img alt="main-img" src={productDetails.img} height="220px" width="360px"></img>
                   </Stack>
                   <Stack spacing={1} width="30%">
                       <Typography variant="h6">{productDetails.name}</Typography>
                       <Stack direction="row" spacing={1} alignItems="center">
                            <Rating value={4} size="small" precision={0.1} readOnly></Rating>
                            <Chip size="small" label={"4.0"}></Chip>
                            <Typography fontSize="14px">10 ratings</Typography>
                            {productDetails.assured==="yes"?<img alt="fassured" height="21px" width="77px" src="/fassured.png"></img>:<></>}
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography width="auto" fontSize="30px" fontWeight="bold">₹{productDetails.salePrice}</Typography>
                            <Typography sx={{textDecoration:'line-through',fontSize:'16px',color:'gray' }}>₹{productDetails.price}</Typography>
                            <Typography sx={{color:'green'}}>{calculateDiscountPercentage(productDetails.price,productDetails.salePrice)}% off</Typography>
                        </Stack>
                        <Stack paddingLeft={3}>
                        <ul>
                            {productDetails.bulletPoints.map((point,index)=>{
                                return <li key={index}><Typography fontSize="14px">{point}</Typography></li>
                            })}
                        </ul>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <LoadingButton onClick={()=>{addToCart()}} fullWidth variant="contained" sx={{backgroundColor:'#f29e03',padding:'18px 18px',fontSize:'16px',fontWeight:'bold'}}><ShoppingCart/> ADD TO CART</LoadingButton>
                            <LoadingButton onClick={()=>{directCheckout()}} fullWidth variant="contained" sx={{backgroundColor:'#ee631d',padding:'18px 18px',fontSize:'16px',fontWeight:'bold'}}><FlashOn/> BUY NOW</LoadingButton>
                        </Stack>
                        <Stack>
                            <Typography variant="h6">Product description</Typography>
                            <Typography>{productDetails.description}</Typography>
                        </Stack>
                        <Stack>
                            <Stack>
                                <Typography variant="h6">Ratings</Typography>
                                <Typography variant="h4">4.0 <Star/> </Typography>
                                <Typography fontSize="14px">10 ratings</Typography>
                            </Stack>
                            <Stack>
                            </Stack>
                        </Stack>
                   </Stack>
               </Stack>
           </Grid>
        </>
    )

}