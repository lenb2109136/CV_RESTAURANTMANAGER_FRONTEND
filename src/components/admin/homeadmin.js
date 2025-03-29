import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Outlet, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { Navigate } from 'react-router-dom';
const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#6A4E23', // Màu nâu cho đường gạch dưới
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#6A4E23',
          },
        },
      },
    },
  },
});

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="row w-100">
        <div className='col-lg-1 col-md-1 d-none d-md-block'>
          <p className='fw-bold text-brown fs-3'>Flame</p></div>
        <div className='col-lg-10 col-md-10 col-10'>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            scrollButtons="auto"
            variant="scrollable"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab id='thucdon' onClick={() => { navigate("menu/monan") }} label="Thực đơn" />
            <Tab label="Giờ/ ca làm" onClick={()=>{navigate("/admin/calam")}} />
            <Tab label="Khuyến mãi" onClick={()=>{navigate("/admin/khuyenmai")}} />
            <Tab label="Sảnh/ bàn ghế" onClick={()=>{navigate("/admin/sanh")}} />
            <Tab label="Chấm công" />
            <Tab label="Nhân viên" onClick={()=>{navigate("/admin/nhanvien")}} />
            <Tab label="Tiền lương" />
          </Tabs>
          {/* <LinearProgress sx={{backgroundColor: '#D2B48C', '& .MuiLinearProgress-bar': { backgroundColor: '#6A4E23', }, }}/> */}
        </div>
        <div className='col-lg-1 col-md-1 col-2 '>
        <div className="text-white col-lg-3 col-md-3 col-12 mt-2 ms-2  mb-2">
                    <div className="mx-auto ms-md-2" style={{width:"50px", borderRadius:"50%",borderColor:"gray",borderWidth: "5px",borderStyle: "solid", }}>
                        <img className="w-100 h-100" src={localStorage.getItem("anh")}></img>
                    </div>
                </div>
        </div>
        
      </div>
      <div className='row huh' >
          <Outlet />
        </div>
    </ThemeProvider>
  );
}
