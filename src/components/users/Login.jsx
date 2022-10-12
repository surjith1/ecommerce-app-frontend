import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {TextField,Link,Container,Stack,Typography,Alert,Snackbar} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {API_LOGIN} from '../../Utilities';
import axios from 'axios';
import { ArrowForward } from '@mui/icons-material';
import {toast} from 'react-toastify';

export default function Login(){

    const history=useHistory();
    const [userCredentials,setUserCredentials]= useState({email:'',password:''});
    const [loading,setLoading]=useState(false);
    const [alert,setAlert]=useState({show:false,vertical:'top',horizontal:'right',type:'success',message:''});
    const {show,vertical,horizontal,type,message}=alert;

    const handleChange=({target:{name,value}})=>setUserCredentials({...userCredentials,[name]:value});

    const login=async()=>{
        setLoading(true);
        await axios.post(API_LOGIN,{
           ...userCredentials,
        }).then(function(res){
            if(res.data) if(res.status===200) {
                localStorage.setItem('auth-token',res.data.authToken);
                setLoading(false);
                toast.success('Login successfull');
                history.push('/invoices');
            }
        }).catch(function(err){
                setLoading(false);
                console.log(err.response);
                if(err.response.data.message) {
                    toast.error(err.response.data.message);
                }
                else toast.error(err.response.data);
        })

    }

    //const showAlert=()=>setAlert({...alert,show:true,type:'error',message:'Alert message'});
    const closeAlert=()=>setAlert({...alert,show:false});

    return(
        <>
        <Container maxWidth="sm" sx={{backgroundColor:'#faf5e8',paddingBottom:5,mt:5}}>
            <Stack spacing={2} sx={{mt:3}} direction="column" alignItems="center">
                <Typography variant="h2" sx={{mt:5}}>Ecommerce app</Typography>
                <Typography variant="h4" sx={{mt:5}}>Login</Typography>
                <TextField fullWidth value={userCredentials.email} onChange={handleChange} type="email" variant="filled" name="email" label="Email address" required></TextField>
                <TextField fullWidth value={userCredentials.password} onChange={handleChange} type="password" variant="filled" name="password" label="Password" required></TextField>
                <LoadingButton loading={loading} loadingPosition="end" endIcon={<ArrowForward/>} fullWidth variant="outlined" onClick={login} sx={{padding:1.5}}>Login</LoadingButton>
            </Stack>
            <Stack sx={{mt:3}} direction="row" justifyContent="space-between">
                <Link onClick={()=>history.push('/register')} variant="body2" sx={{cursor:'pointer'}}>Don't have an account? Register here</Link>
                <Link onClick={()=>history.push('/forgot-password')} variant="body2" sx={{cursor:'pointer'}}>Forgot password</Link>
            </Stack>
            <Stack sx={{mt:2}}>
                <Typography variant="h6">Demo credentials</Typography>
                <Typography variant="h6">Email: demo@example.com</Typography>
                <Typography variant="h6">Password: demo123</Typography>
            </Stack>
        </Container>

        <Snackbar open={show} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{vertical,horizontal}}>
            <Alert severity={type} variant="filled" sx={{width:'100%',pr:30}}>
                {message}
            </Alert>
        </Snackbar>
        </>
    )

}
