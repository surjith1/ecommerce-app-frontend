import {
  Button,
  Typography,
  Grid,
  Container,
  Stack,
  Menu,
  TextField,
  MenuItem,
  Badge,
} from "@mui/material";
import "../App.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";

export default function Appbar() {
  const history = useHistory();
  let cartItems = [];
  try {
    cartItems = JSON.parse(localStorage.getItem("cartItems"));
  } catch (err) {
    localStorage.setItem("cartItems", JSON.stringify([]));
  }

  const getCartItemsCount = () => {
    try {
      return cartItems.length;
    } catch (err) {
      localStorage.setItem("cartItems", JSON.stringify([]));
      return 0;
    }
  };

  //const history=useHistory();
  //const [drawerOpen,setDrawerOpen]=useState(false);
  // const eventItems=[
  //     {
  //         item:'Invoices',icon:<Description/>,link:'/invoices',
  //     },{
  //         item:'Customers',icon:<Person/>,link:'/customers',
  //     },{
  //         item:'Products',icon:<Inventory2/>,link:'/products',
  //     },
  // ];

  // const handleMenuItemClick=(item)=>{
  //     history.push(item);
  //     menuClose();
  // }

  // const menuOpen=()=>setDrawerOpen(true);
  // const menuClose=()=>setDrawerOpen(false);

  // const logoutUser=()=>{
  //     localStorage.removeItem('auth-token');
  //     history.push('/login');
  // }

  // const menuItems=()=>{
  //    return(
  //     <>
  //     {eventItems.map(({item,icon,link},index)=>{
  //         return(
  //             <List key={index}>
  //             <ListItem disablePadding>
  //                 <ListItemButton onClick={()=>handleMenuItemClick(link)}>
  //                 <ListItemIcon>{icon}</ListItemIcon>
  //                 <ListItemText primary={item}/>
  //                 </ListItemButton>
  //             </ListItem>
  //         </List>
  //         )
  //     })
  //     }
  //     </>
  //    )
  // }

  const [profileMenu, setProfileMenu] = useState(null);
  const open = Boolean(profileMenu);

  const handleClose = () => setProfileMenu(null);
  //const handleClick=(e)=>setProfileMenu(e.currentTarget);

  // useEffect(()=>{
  //     setCartItems(JSON.parse(localStorage.getItem('cartItems')));
  // },[cartItems])

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#3674f0",
          height: 55,
        }}
      >
        <Container maxWidth="lg" sx={{ marginLeft: "160px" }}>
          <Stack flexDirection="row">
            <Stack
              onClick={() => {
                history.push("/");
              }}
              sx={{ "&:hover": { cursor: "pointer" } }}
            >
              <img alt="logo" width="75" src="/logo.png"></img>
              <Stack direction="row">
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "11px",
                    marginTop: "-1px",
                    fontStyle: "italic",
                  }}
                >
                  Explore{" "}
                  <span
                    style={{
                      color: "#ffe500",
                      fontSize: "11px",
                      marginRight: "2px",
                      fontWeight: 500,
                    }}
                  >
                    Plus
                  </span>
                </Typography>
                <img
                  alt="logo"
                  height="10px"
                  width="10px"
                  src="/plus.png"
                ></img>
              </Stack>
            </Stack>
            <Stack sx={{ ml: 2 }}>
              <TextField
                sx={{ width: "70ch", backgroundColor: "white", color: "brown" }}
                hiddenLabel
                id="search"
                placeholder="Search for products"
                size="small"
              />
            </Stack>
            <Stack flexDirection="row" sx={{ marginLeft: "auto" }}>
              {/* <Button
                            id="profile-button"
                            aria-controls="profile-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{color:'white',fontWeight:'500'}}
                            >Dashboard</Button> */}
              {/* <Button
                            id="more-button"
                            aria-controls="profile-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{color:'white',fontWeight:'500'}}
                            >More</Button> */}
              <Menu
                id="basic-menu"
                anchorEl={profileMenu}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>My profile</MenuItem>
                <MenuItem onClick={handleClose}>My orders</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>

              <Button
                id="cart-button"
                aria-controls="profile-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={() => {
                  history.push("/cart");
                }}
                sx={{ color: "white", fontWeight: "500" }}
              >
                Cart
                <Badge badgeContent={getCartItemsCount()} color="error">
                  <ShoppingCart />
                </Badge>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Grid>
      {/* <AppBar position="static">
            <Toolbar>
                <IconButton 
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr:2}}
                    onClick={menuOpen}
                    >
                <MenuIcon/>
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                   Invoice app
                </Typography>
                <Button color="inherit" onClick={()=>logoutUser()}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Drawer
            sx={{
                width: '240px',
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: '240px', boxSizing: 'border-box' },
              }}
            anchor="left"
            open={drawerOpen}
            onClose={menuClose}
            >
            {menuItems()}
          </Drawer> */}
    </>
  );
}
