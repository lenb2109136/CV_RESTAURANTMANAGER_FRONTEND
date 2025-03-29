import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";

function HienThi(prop) {
    const dsmain = useRef([]);
    const [ds, sete] = useState([]);
    const [dsd,setd]=useState([])
    useEffect(() => {
        axios.get(`http://localhost:8080/combo/getdsmabyid?id=${prop.id}`)
            .then(data => {
                let dss = [];
                for (let i = 0; i < data.data.data.length; i++) {
                    dss.push({ ten: data.data.data[i][1], soluong: data.data.data[i][2], id: data.data.data[i][0],idcombo: data.data.data[i][3] });
                }
                dsmain.current = JSON.parse(JSON.stringify(dss)); 
                sete([...dss]);
            });
    }, [prop.id]);

    return (
        <div className="w-75 w-md-50 w-lg-50 position-absolute ms-4 hihi"
            style={{
                zIndex: 1,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                border: "2px solid #1C0F0A", // Viền bao quanh
                marginLeft: "50px"
            }}>
            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#f5f5f5"
            }}>
                <thead>
                    <tr style={{
                        backgroundColor: "#1C0F0A",
                        color: "#fff",
                    }}>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>STT</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Tên Món Ăn</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ds.map((data, index) => {
                            return (
                                <tr key={index} style={{ textAlign: "center", backgroundColor: index % 2 === 0 ? "#e8e0d4" : "#f2f0ec" }}>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A" }}>{index + 1}</td>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A" }}>{data.ten}</td>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A"}}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => {
                                                let temp = JSON.parse(JSON.stringify(ds));
                                                temp[index].soluong--;
                                                if (temp[index].soluong <= 0) {
                                                    dsd.push(temp[index])
                                                    temp.splice(index, 1);
                                                }
                                                sete(temp);
                                            }}>-</p>
                                            <p>{data.soluong}</p>
                                            <p onClick={() => {
                                                let temp = JSON.parse(JSON.stringify(ds));
                                                temp[index].soluong++;
                                                sete(temp);
                                            }} style={{ marginLeft: "10px", cursor: "pointer" }}>+</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
                <div className="mt-3">
                    <Button
                        variant="contained"
                        className="m-e-2"
                        sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                        onClick={()=>{
                            axios.post("http://localhost:8080/combo/updatemonan",
                                JSON.stringify(
                                    {
                                        delete:JSON.stringify(dsd),
                                        update: JSON.stringify(ds)
                                    }
                                ),
                                {
                                    headers:{
                                        "Content-Type": "application/json"
                                    }
                                }
                            ).then((data) =>{
                                if(data.data.status=="OK"){
                                    alert("Cập nhật dữ liệu thành công")
                                }
                                else{
                                    alert("Cập nhật dữ liệu thất bại")
                                }
                            })
                            .catch(()=>{
                                alert("Không thể gửi dữ liệu")
                            })
                        }}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        onClick={() => {
                            prop.setopen(false);
                        }}
                        variant="outlined"
                        sx={{ color: "#1C0F0A", borderColor: "#1C0F0A", "&:hover": { backgroundColor: "#f4e6e5" }, marginLeft: "10px" }}
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={() => {
                            sete(JSON.parse(JSON.stringify(dsmain.current)));
                            setd([])
                        }}
                        variant="outlined"
                        sx={{ color: "#1C0F0A", borderColor: "#1C0F0A", "&:hover": { backgroundColor: "#f4e6e5" }, marginLeft: "10px" }}
                    >
                        Khôi phục
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HienThi;
