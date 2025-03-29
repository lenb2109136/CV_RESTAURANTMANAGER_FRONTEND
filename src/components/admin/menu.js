import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Outlet, useNavigate } from 'react-router-dom';
import gsap from "gsap"
export default function () {
    const [value, setValue] = useState(0); 
    const navigate = useNavigate();
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className='row'>
            <div className='row'>
                <div class="d-flex justify-content-center">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        scrollButtons="auto"
                        variant="scrollable"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab className='i' onClick={() => {
                            navigate("monan")
                        }}  label="Món ăn" />
                        <Tab className='i' onClick={() => {
                            navigate("thucuong/")
                        }} label="Thức uống" />
                        <Tab className='i' onClick={() => {
                            navigate("combo")
                        }} label="Combo" />
                    </Tabs>
                </div>

            </div>
            
            <div className='row' >
                <Outlet></Outlet>
            </div>

        </div>
    );
}
