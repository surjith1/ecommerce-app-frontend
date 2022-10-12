import { useEffect, useState } from 'react';
//import {useHistory} from 'react-router-dom';
import { Container,Grid,Box,Stack,Typography } from '@mui/material';
import { ChevronLeft,ChevronRight } from '@mui/icons-material';
import Appbar from './Appbar';
import { useHistory } from 'react-router-dom';

export default function Home(){
    
    const history=useHistory();
    //const [search,setSearch]=useState([]);
    const [slider,setSlider]=useState(0);
    const sliders=['/slider1.jpg','/slider2.jpg','/slider3.jpg','/slider4.jpg','/slider5.jpg'];
    const categories=[
        {name:'Mobiles',img:'mobiles.png'},
        {name:'Fashion',img:'fashion.png'},
        {name:'Electronics',img:'electronics.png'},
        {name:'Home',img:'home.png'},
        {name:'Travel',img:'travel.png'},
        {name:'Appliances',img:'appliances.png'},
        {name:'Furniture',img:'furniture.png'},
        {name:'Beauty',img:'beauty.png'},
        {name:'Grocery',img:'grocery.png'}
    ];

    const navigateSliderImages=(pos)=>{
        if (slider>=4 || slider<0) setSlider(0);
        else {
            if(pos==='left') setSlider(slider-1);
            else if(pos==='right') setSlider(slider+1);
        }
    }

    useEffect(()=>{

        // const data=['Product 1','Product 2','Product 3'];
        // setSearch(data);

        // setTimeout(()=>{
        //    changeSliderImages();
        // },5000)

        // function changeSliderImages(){
        //    if (slider>=4) setSlider(0);
        //    else setSlider(slider+1);
        // }

    },[])

    return(
        <>
        <Grid sx={{height:'auto',backgroundColor:'#f1f3f6'}}>
        <Appbar/>
        <Grid sx={{height:120,backgroundColor:'white',display:'flex',alignItems:'center'}}>
            <Container maxWidth="lg">
                <Stack direction="row" spacing={9} justifyContent="center"> 
                    {categories.map((catergory)=>{
                        return(
                            <>
                            <Stack onClick={()=>history.push('/products/view')} key={catergory.name} alignItems="center" sx={{'&:hover':{cursor:'pointer'}}}>
                            <img alt={catergory.name} height="70px" width="70px" src={catergory.img}></img>
                            <Typography textAlign="center">{catergory.name}</Typography>
                            </Stack>
                            </>
                        )
                    })}
                </Stack>
            </Container>
        </Grid>
        <Grid sx={{height:300}}>
            <Grid sx={{padding:'8px'}}>
                 <Grid sx={{display:'flex',alignItems:'center',height:'280px',backgroundImage:`url(${sliders[slider]})`,'&:hover':{cursor:'pointer'}}}>
                 <ChevronLeft onClick={()=>{navigateSliderImages('left')}} sx={{fontSize:'48px',borderRadius:1,marginLeft:-1,backgroundColor:'#fafdfa',padding:'24px 0px 24px 5px','&:hover':{cursor:'pointer'}}}/>
                 <ChevronRight onClick={()=>{navigateSliderImages('right')}} sx={{marginLeft:'auto',marginRight:-1,fontSize:'48px',borderRadius:1,backgroundColor:'#fafdfa',padding:'24px 0px 24px 5px','&:hover':{cursor:'pointer'}}}/>
                 {/* <img alt="logo" height="230px" width="100%" src="slider1.jpg"></img> */}
                </Grid>   
            </Grid>
        </Grid>
        <Grid sx={{padding:'8px'}}>
        <img alt="logo" height="100px" width="100%" src="icicibanner.jpg"></img>        
        </Grid>
            <Grid sx={{padding:'8px'}}>
                <Stack direction="row" spacing={2} onClick={()=>history.push('/products/view')} sx={{'&:hover':{cursor:'pointer'}}}>
                <img alt="banner" height="220px" width="100%" src="/soundbars.jpeg"></img>     
                <img alt="banner" height="220px" width="100%" src="/mattress.jpg"></img>
                <img alt="banner" height="220px" width="100%" src="/music.jpg"></img>
            </Stack>
            </Grid>      
        </Grid>
        <Box>
        
        </Box>
        </>
    )
}