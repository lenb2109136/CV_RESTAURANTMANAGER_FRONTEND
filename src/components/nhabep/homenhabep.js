import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ref, onValue, off } from "firebase/database";
import { database } from "../public/firebaseconfig";
import { useEffect } from 'react';
import { Badge } from '@mui/material';
import Dscho from "./donchualam"
const dataRef = ref(database, "dscho");
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    position: 'relative',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function PersistentDrawerRight() {
  const [dotthem,setdotthem]= React.useState(false);
  const theme = useTheme();
  const navigate =useNavigate()
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const listener = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setdotthem(true);
      }
    });
  
    return () => {
      off(dataRef);
    };
  }, []);
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar style={{backgroundColor:"#7AB730"}} position="fixed" open={open}>
        <Toolbar>
          
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            {localStorage.getItem("ten")}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={[open && { display: 'none' }]}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open}>
        <DrawerHeader  />
            <Outlet></Outlet>
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
       
      >
        <DrawerHeader >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader >
        <Divider />
        <List  >
            <ListItem onClick={() => { setdotthem(false); navigate("/quanly/dscho") }} key={"Đơn chưa làm"} disablePadding>
              <ListItemButton>
              {
                dotthem? <><Badge color="error" variant="dot"> 
              </Badge></>: null
              }
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary={"Đơn chưa làm"} />
              </ListItemButton>
            </ListItem>
            <ListItem onClick={()=>{
              navigate("/quanly/dondanglam")
            }} key={"Đơn đang làm"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary={"Đơn đang làm"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Đơn đang dọn"} disablePadding>
              
              <ListItemButton>
             
                <ListItemIcon>
                </ListItemIcon>
                
                <ListItemText primary={"Đơn đang chờ làm"} />
              </ListItemButton>
            </ListItem>
         
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
