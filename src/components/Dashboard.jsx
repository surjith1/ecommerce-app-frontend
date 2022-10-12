//import {useHistory} from 'react-router-dom';
import Appbar from './Appbar';
import { Container,Box,Typography,Stack,Card,LinearProgress, CardContent,CircularProgress } from '@mui/material';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { API_INFO,capitalize } from '../Utilities';
import { Event,DateRange,MeetingRoom,Contacts } from '@mui/icons-material';

export default function Dasboard(){
    
    //const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const [info,setInfo]=useState([]);
    const [loading,setLoading]=useState(false);

    const getIcon=(type)=>{
        if (type==='appointment') return <DateRange sx={{marginLeft:'auto',color:'white',fontSize:'52px'}}/>
        if (type==='event') return <Event sx={{marginLeft:'auto',color:'white',fontSize:'52px'}}/>
        if (type==='meeting') return <MeetingRoom sx={{marginLeft:'auto',color:'white',fontSize:'52px'}}/>
        if (type==='contact') return <Contacts sx={{marginLeft:'auto',color:'white',fontSize:'52px'}}/>
    }

    useEffect(()=>{

        async function getInfo(){
        // let defaultInfo=[
        //     {_id:'appointment',count:0,color:'green'},
        //     {_id:'event',count:0,color:'red'},
        //     {_id:'meeting',count:0,color:'violet'},
        //     {_id:'contact',count:0,color:'crimson'},
        // ]
        setLoading(true);
       // setTimeout(async()=>{
        await axios.get(API_INFO,{
           headers:{auth:authToken}
        }).then(function(res){
            console.log(res.data);
            setInfo(res.data);
        }).catch(function(err){
                console.log(err);
        })
        setLoading(false);
        //},3000)
    }

    getInfo();

    },[authToken])


    return(
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container>
        <Typography variant="h4" sx={{mt:2}}>Dashboard</Typography>
            <Box>
                <Stack direction="row" spacing={2} sx={{mt:2}} >
                   {loading?<CircularProgress/>:<></>} 
                    {info.map((card,index)=>{
                       return(
                            <Card key={index} sx={{width:"280px",backgroundColor:card.color}}>
                                <CardContent>
                                    <Typography variant="h4" color="white">{`${capitalize(card._id)}s`}</Typography>
                                    <Stack direction="row" alignItems="center">
                                        <Typography variant="h2" color="white">{card.count}</Typography>
                                        {getIcon(card._id)}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )
                    })}
                   
                </Stack>
            </Box>
        </Container>
        </>
    )
}