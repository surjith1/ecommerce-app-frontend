//import { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import {Container,TextField,Button,Stack,Typography} from '@mui/material';

export default function ResetPassword(){

    //const history=useHistory();

    return (
        <>
        <Container maxWidth="sm">
            <Stack spacing={2} sx={{mt:3}} alignItems="center">
                <Typography variant="h4" sx={{mt:5}}>Reset password</Typography>
                <TextField fullWidth variant="filled" type="password" label="Enter new password" id="password" required></TextField>
                <TextField fullWidth variant="filled" type="password" label="Confirm new password" id="password2" required></TextField>
                <Button fullWidth variant="outlined" sx={{padding:1.5}}>Reset password</Button>
            </Stack>
        </Container>
        </>
    )

}