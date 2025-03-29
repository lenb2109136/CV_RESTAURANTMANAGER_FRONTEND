import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../config/axiosconfig";

export default function AddProduct(prop) {
    const [imageSrc, setImageSrc] = useState(null);
    const [bophana, setBophana] = useState(0); 
    const [bophanb, setBophanb] = useState(0);  
    const [dsbp, setDsbp] = useState([]); 
    const [dschuvu, setChuvu] = useState([]);  
    const [chucvu, setChucvu] = useState(0);  

    useEffect(() => {
        axios.get("http://localhost:8080/bophan/getds")
            .then((data) => {
                setDsbp(data.data.data);
            })
            .catch((error) => console.error("Error fetching departments:", error));
    }, []);

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
        formData.append("cv", bophana);
        formData.append("bp",chucvu)

        try {
            const response = await axios.post("http://localhost:8080/nhanvien/save", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.status === "OK") {
                alert("Thêm nhân viên thành công");
                axios.get(`http://localhost:8080/nhanvien/tieuchi?name=${prop.name.current}&id=${prop.bp.current}`)
                    .then((data) => prop.nv([...data.data.data.data]))
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
                height: "100vw",
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
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    border: "2px solid #1C0F0A",
                    width: "75%",
                    height:"89%",
                    top:"20px",
                    overflow: "scroll",
                }}
            >
                <form id="form" className="row" style={{ gap: "15px" }}>
                    <div className="col-12 d-flex justify-content-center align-items-center">
                        <img
                            alt="Ảnh nhân viên"
                            src={imageSrc || "default-image.jpg"}
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
                    <TextField name="ten" fullWidth label="Tên nhân viên" variant="outlined" />
                    <TextField name="diaChi" fullWidth label="Địa chỉ" variant="outlined" />
                    <TextField name="SDT" fullWidth label="Số điện thoại" variant="outlined" />
                    <TextField name="CCCD" fullWidth label="CCCD" variant="outlined" />
                    <TextField name="matKhau" fullWidth label="Mật khẩu" variant="outlined" />
                    <TextField name="email" fullWidth label="Email" variant="outlined" />

                    <Select fullWidth value={bophana} onChange={(e) => setBophana(e.target.value)}>
                        {dsbp.map((data) => (
                            <MenuItem onClick={() => { setBophanb(data.id); }} key={data.id} value={data.id}>{data.ten}</MenuItem>
                        ))}
                    </Select>

                    <Select fullWidth value={chucvu} onChange={(e) => setChucvu(e.target.value)}>
                        {dschuvu.map((data) => (
                            <MenuItem key={data.id} value={data.id}>{data.ten}</MenuItem>
                        ))}
                    </Select>

                    <RadioGroup row>
                        <FormControlLabel value="true" control={<Radio />} label="Nam" />
                        <FormControlLabel value="false" control={<Radio />} label="Nữ" />
                    </RadioGroup>

                    <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
                        <Button onClick={handleSubmit} variant="contained" color="primary">Thêm Nhân viên</Button>
                        <Button onClick={() => prop.setopen(false)} variant="outlined">Đóng</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
