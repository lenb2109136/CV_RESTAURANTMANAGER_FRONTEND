import React, { useEffect, useRef, useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";
function groupByShift(data) {
    const grouped = {};
    
    data.forEach(item => {
        const shiftKey = `${item.CA_THOIGIANBATDAU}-${item.CA_THOIGIANKETTHUC}`;
        if (!grouped[shiftKey]) {
            grouped[shiftKey] = {};
        }
        
        const bpTen = item.BP_TEN;
        if (!grouped[shiftKey][bpTen]) {
            grouped[shiftKey][bpTen] = [];
        }
        
        grouped[shiftKey][bpTen].push({
            CV_TEN: item.CV_TEN,
            GBP_ID: item.GBP_ID,
            GBP_GIA: item.GBP_GIA
        });
    });
    
    return Object.entries(grouped).map(([key, bpData]) => {
        const [start, end] = key.split("-");
        return {
            CA_THOIGIANBATDAU: start,
            CA_THOIGIANKETTHUC: end,
            BP_NHOM: Object.entries(bpData).map(([bpTen, cvList]) => ({
                BP_TEN: bpTen,
                CV_LIST: cvList
            }))
        };
    });
}
function AddCalam(prop) {
    const [ds, setDs] = useState([]);
    const ds1= useRef([]);
    const [bd,setbd] = useState();
    const [kt,setkt] = useState();
    useEffect(() => {
        axios.get("http://localhost:8080/bophan/getds")
            .then((response) => {
                // setDs(response.data.data);
                console.log(response.data.data);
                response.data.data.map((data)=>{
                    data.chucVu.map((dat)=>{
                        ds1.current.push({bpid:dat.id, dongia:0,ten: dat.ten});
                    })
                })
                setDs(ds1.current)
                console.log(ds1.current)
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            });
    }, []);

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 3,
                maxWidth: 600,
                backgroundColor: "white",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: 3,
                border: "3px solid #1C0F0A",
                zIndex: 1000
            }}
        >
            
            <Grid container spacing={2} alignItems="center">
                {ds.map((data,index) => (
                    <React.Fragment key={data.id}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" fontWeight={600} color="#1C0F0A">{data.ten}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id={index} onChange={()=>{
                                var c= document.getElementById(index)
                                ds1.current[index].gia=c.value
                                console.log(ds1)
                            }} label="Đơn giá" type="number" size="small" fullWidth sx={{ backgroundColor: "white", borderColor: "#1C0F0A", '& .MuiInputBase-root': { borderColor: "#1C0F0A" } }} />
                        </Grid>
                    </React.Fragment>
                ))}
                <Grid item xs={6}>
                    <TextField id="bd" label="Thời điểm bắt đầu" onChange={(event)=>{
                        setbd(event.target.value)
                    }} type="time" size="small" fullWidth sx={{ backgroundColor: "white", borderColor: "#1C0F0A", '& .MuiInputBase-root': { borderColor: "#1C0F0A" } }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField onChange={(event)=>{
                        setkt(event.target.value)
                    }} id="ktkt" label="Thời điểm kết thúc" type="time" size="small" fullWidth sx={{ backgroundColor: "white", borderColor: "#1C0F0A", '& .MuiInputBase-root': { borderColor: "#1C0F0A" } }} />
                </Grid>
                <Grid item xs={12} style={{ display: "flex", gap: "10px" }}>
                    <Button onClick={()=>{
                        let f= new FormData()
                        f.append("giobatdau",bd)
                        f.append("gioketthuc",kt)
                        f.append("danhsach",JSON.stringify(ds1.current))
                        axios.post("http://localhost:8080/ca/themca",f)
                        .then((data)=>{
                            if(data.data.status=="OK"){
                               
                                    axios.get("http://localhost:8080/ca/getdsnow")
                                        .then((data) => {
                                            prop.setdss(groupByShift(data.data.data))
                                            
                                        })
                                alert("Thêm ca làm thành công")
                            }
                            else{
                                    alert(data.data.message)
                            }
                        })
                        .catch(()=>{
                            alert("Không thể gửi thông tin")
                        })
                    }} variant="contained" sx={{ backgroundColor: "#1C0F0A", color: "white", '&:hover': { backgroundColor: "#1C0F0A" } }} fullWidth>
                        Xác nhận
                    </Button>
                    <Button
        onClick={() => {
            prop.set(false)
        }}
        variant="contained"
        sx={{
            backgroundColor: "white", 
            border: "2px solid #1C0F0A",  
            color: "#1C0F0A",  
            '&:hover': { backgroundColor: "#f5f5f5" }, 
            fullWidth: true
        }}
    >
        Đóng
    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default AddCalam;
