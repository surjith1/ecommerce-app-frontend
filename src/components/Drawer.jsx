import { Drawer as MUIDrawer } from "@mui/material";

const MenuDrawer=()=>{
    return (
        <MUIDrawer
        variant="permanent"
        sx={{
          width: '200px',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: '200px', boxSizing: 'border-box' },
        }}
      >
    </MUIDrawer>
    )
}

export default MenuDrawer;

