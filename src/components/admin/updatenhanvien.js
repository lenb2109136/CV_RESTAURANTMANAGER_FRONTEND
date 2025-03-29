import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axios from "../../config/axiosconfig";

export default function AddProduct(prop) {
    console.log(prop.nv.matKhau)
    console.log(prop.nv)
    const [imageSrc, setImageSrc] = useState(null);
    const [bophana, setBophana] = useState();
    const [bophanb, setBophanb] = useState(0); 
    const [dsbp, setDsbp] = useState([]);
    const gioi=useRef(prop.nv.gioiTinhNam)
    const ui= useRef(prop.nv.chucVu.id)
    const [dschuvu, setChuvu] = useState([]);
    const [chucvu, setChucvu] = useState(0);
   
    useEffect(() => {
        setChucvu(0)
        axios.get(`http://localhost:8080/chucvu/getall?id=${bophanb}`)
            .then((data) => {
                if (data.data.data == null || data.data.data == []) {
                    setChuvu([]);
                } else {
                    setChuvu(data.data.data);
                }
            })
            .catch((error) => console.error("Error fetching positions:", error));
    }, [bophanb]);
    useEffect(() => {
        axios.get("http://localhost:8080/bophan/getds")
            .then((data) => {
                setDsbp(data.data.data);
            })
            .catch((error) => console.error("Error fetching departments:", error));

        if (prop.nv.gioiTinhNam === true) {
            document.getElementById("nam").click();
        } else {
            document.getElementById("nu").click();
        }
        
    }, [prop]);
    useEffect(()=>{
        ui.current=prop.nv.chucVu.id;
        // alert(`${prop.nv.chucVu.ten}`)
        
        // alert(document.getElementById(`${prop.nv.chucVu.ten}`))
    },[])
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageSrc(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData(document.getElementById("form"));
        formData.append("cv", ui.current);
        formData.append("gioiTinhNam",gioi.current)
        formData.append("id",prop.nv.id)
        if(chucvu!=0){
            formData.append("bp",chucvu)
        }
       
        else{
            formData.append("bp",prop.nv.boPhan.id)
        }
        try {
            const response = await axios.post("http://localhost:8080/nhanvien/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.status === "OK") {
                alert("cập nhật nhân viên thành công");
                axios.get(`http://localhost:8080/nhanvien/tieuchi?name=${prop.name.current}&id=${prop.bp.current}`)
                    .then((data) => prop.setn([...data.data.data.data]))
                    .catch((error) => console.error("Error fetching employees:", error));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div
            className="overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                className="content-box"
                style={{
                    position: "fixed",
                top: 30,
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    border: "2px solid #1C0F0A",
                    width: "75%",
                    height:"87%",
                    maxWidth: "600px",
                    overflow: "hidden",
                    overflow: "scroll"
                }}
            >
                <form id="form" className="row" style={{ gap: "15px" }}>
                    <div className="col-12 d-flex justify-content-center align-items-center">
                        <img
                            alt="Ảnh nhân viên"
                            src={imageSrc || prop.nv.anhGioiThieu || "default-image.jpg"}
                            onClick={() => document.getElementById("file-input").click()}
                            style={{
                                cursor: "pointer",
                                width: "200px",
                                height: "200px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                border: "2px solid #ddd",
                            }}
                        />
                    </div>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        name="anh"
                        style={{ display: "none" }}
                    />
                    <TextField name="ten" defaultValue={prop.nv.ten} fullWidth variant="outlined" />
                    <TextField name="diaChi" fullWidth defaultValue={prop.nv.diaChi} variant="outlined" />
                    <TextField name="SDT" fullWidth defaultValue={prop.nv.sdt} variant="outlined" />
                    <TextField name="CCCD" fullWidth defaultValue={prop.nv.cccd} variant="outlined" />
                    <TextField name="matKhau" fullWidth defaultValue={prop.nv.matKhau} variant="outlined" />
                    <TextField name="email" fullWidth defaultValue={prop.nv.email} variant="outlined" />

                    <Select fullWidth value={bophana} onChange={(e) => setBophana(e.target.value)}>
                                            {dsbp.map((data) => (
                                                <MenuItem id={data.id} onClick={() => { setBophanb(data.id); ui.current=data.id }} key={data.id} value={data.id}>{data.ten}</MenuItem>
                                            ))}
                                        </Select>
                    
                                        <Select fullWidth value={chucvu} onChange={(e) => setChucvu(e.target.value)}>
                                            {dschuvu.map((data) => (
                                                <MenuItem onClick={()=>{
                                                    setChucvu(data.id)
                                                }} key={data.id} value={data.id}>{data.ten}</MenuItem>
                                            ))}
                                        </Select>

                    <RadioGroup row>
                        <FormControlLabel onClick={()=>{gioi.current=true}} id="nam" value="true" control={<Radio />} label="Nam" />
                        <FormControlLabel onClick={()=>{gioi.current=false}} id="nu" value="false" control={<Radio />} label="Nữ" />
                    </RadioGroup>

                    <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
                        <Button onClick={handleSubmit} variant="contained" color="primary">Cập nhật</Button>
                        <Button onClick={() => prop.setopenu(false)} variant="outlined">Đóng</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
