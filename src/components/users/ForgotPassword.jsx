import { useHistory } from 'react-router-dom';
import {Container,TextField,Link,Stack,Typography} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useState } from 'react';
import {API_FORGOT_PASSWORD} from '../../Utilities';
import {toast } from 'react-toastify';

export default function ForgotPassword(){

    const history=useHistory();
    const [loading,setLoading]=useState(false);
    const [email,setEmail]=useState('');

    const handleChange=(e)=>setEmail(e.target.value);

    const forgotPassword=async()=>{
        setLoading(true);
        await axios.post(API_FORGOT_PASSWORD,{
           email,
        }).then(function(res){
            if(res.data) if(res.status===200) {
                setLoading(false);
               // history.push('/email');
            }
        }).catch(function(err){
                setLoading(false);
                toast.error(err.response.data);
                if(err.response.data.message) {
                   toast.error(err.response.data.message);
                }
        })
        setLoading(false);
    }

    return (
        <>
        <Container maxWidth="sm">
            <Stack spacing={2} sx={{mt:3}} alignItems="center">
                <Typography variant="h4" sx={{mt:5}}>Forgot password</Typography>
                <TextField required onChange={handleChange} fullWidth variant="filled" name="email" type="email" label="Email address"></TextField>
                <LoadingButton loading={loading} fullWidth onClick={forgotPassword} variant="outlined" sx={{padding:1.5}}>Reset password</LoadingButton>
                {/* <Link sx={{cursor:'pointer'}} onClick={()=>forgotPassword()} variant="body2">Resend password reset link</Link> */}
                <Link sx={{cursor:'pointer'}} onClick={()=>history.push('/login')} variant="body2">Go back to login</Link>
            </Stack>
        </Container>
        </>
    )

}
