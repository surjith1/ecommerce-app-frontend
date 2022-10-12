
import {Stack,Card, Typography} from '@mui/material';

export default function CartPrices(){

    const cartItems=JSON.parse(localStorage.getItem('cartItems'));

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

    return(
        <Card sx={{padding:'20px',width:'100%'}}>
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
        </Card>
    )

}
