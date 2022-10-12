
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import Appbar from './Appbar';
import { CheckCircleRounded } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

export default function OrederReceived(){

    const history=useHistory();

    return (
        <>
            <Appbar/>
            <Grid>
                <Stack>
                    <Card sx={{padding:'30px'}}>
                        <Stack alignItems="center" paddibng="20px">
                            <CheckCircleRounded sx={{fontSize:'96px',color:'green'}}/>
                            <Typography variant="h3">Thank you, your order has been received</Typography>
                            <Stack direction="row" padding="20px" justifyContent="center">
                                {/* <Button size="large" variant="contained">View your orders</Button> */}
                                <Button onClick={()=>{history.push('/')}} size="large" variant="contained">Browse products</Button>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
            </Grid>
        </>
    )

}