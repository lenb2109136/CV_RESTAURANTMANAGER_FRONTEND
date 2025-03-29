import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axios from "../../config/axiosconfig";
import gsap from "gsap"
import Danh from "./dsmonancombo"
import DSTU from "./dsthucuongcombo"
export default function ChiTietMonAn(prop) {
    const [dsdm, setdsdm] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8080/giacombo/getgia?id=${prop.data.id}`)
            .then(data => {
                setdsdm(data.data.data)
            })
    }, [])

    const [opendsma,setopenma] =useState(false)
    const [opendstu,setopentu] =useState(false)
    const [imageSrc, setImageSrc] = useState(prop.data.anhGioiThieu || null);
    const [check,setc]=useState(false)
    const [dsloai,setf]=useState([]);
    const id = useRef(1)
    const maloai= useRef(prop.maloai)
    useEffect(()=>{
        let y= document.getElementById(prop.maloai);
        if(y!=null){
            y.click()
        }
    },[dsloai])
    useEffect(() => {
        
        if (prop.data.conHang) {
            document.getElementById("conhang").click();
        }
        axios.get("http://localhost:8080/loaicombo/getdscombo")
            .then((data)=>{
                    setf(data.data.data)
            })
        setc(prop.data.conHang)
        gsap.from(".kuku",{
            y:-3,
            opacity:11
        })
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData(document.getElementById("form"));
        formData.append("id", prop.data.id);
        formData.append("giaa",JSON.stringify(dsdm))
        if(check==false){
        formData.append("conHang", false)
        }
        try {
            const response = await axios.post("http://localhost:8080/combo/capnhatcombo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.status === "OK") {
                alert("Cập nhật dữ liệu thành công");
                axios.get(`/combo/getbyloai?idloai=${prop.maloai}`)
                .then(d => {
                    prop.setdsmonan(d.data.data);
                })
                .catch((e) => alert(e));

            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (

        <div
            className="w-75 w-md-50 w-lg-50 position-absolute kuku"
            style={{
                zIndex: 1,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                border: "2px solid #1C0F0A",
                marginLeft: "50px",
            }}
        >
           {opendsma ?<Danh id={id.current} setopen={setopenma}></Danh>:null}
           {opendstu ?<DSTU id={id.current} setopen={setopentu}></DSTU>:null}
            <form id="form" className="row" style={{ gap: "15px" }}>
                <div className="col-12 d-flex justify-content-center align-items-center">
                    <img
                        alt="product"
                        src={imageSrc}
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
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    name="anh"
                />
                <TextField
                    name="ten"
                    defaultValue={prop.data.ten}
                    fullWidth
                    label="Tên combo"
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#1C0F0A" } }}
                    InputProps={{
                        style: { borderColor: "#1C0F0A" },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "#1C0F0A",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1C0F0A",
                            },
                        },
                    }}
                />
                <TextField
                    name="moTa"
                    defaultValue={prop.data.moTa}
                    fullWidth
                    multiline
                    minRows={3}
                    label="Mô tả"
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#1C0F0A" } }}
                    InputProps={{
                        style: { borderColor: "#1C0F0A" },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "#1C0F0A",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1C0F0A",
                            },
                        },
                    }}
                />
                <Button
                onClick={()=>{
                    id.current=prop.data.id;
                    setopenma(true)
                }}
                        variant="contained"
                        sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                    >
                        Xem danh sách món ăn
                    </Button>
                    <Button
                    onClick={()=>{
                        id.current=prop.data.id;
                        setopentu(true)
                    }}
                        variant="contained"
                        sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                    >
                        Xem danh sách thức uống
                    </Button>
                <FormControlLabel
                    control={
                        <Checkbox
                            id="conhang"
                            name="conHang"
                            value="true"
                            checked= {check}
                            onClick={()=>{
                                setc(!check)
                            }}
                            sx={{
                                color: "#1C0F0A",
                                "&.Mui-checked": {
                                    color: "#1C0F0A",
                                },
                            }}
                        />

                    }
                    label="Còn hàng"
                />

                <RadioGroup row>
                                    {dsloai.map((data) => (
                                        
                                        <FormControlLabel
                                            key={data.id}
                                            value={data.id}
                                            control={
                                                <Radio
                                                    id={data.id}
                                                    name="idloai"
                                                    value={data.id}
                                                    onClick={() => {
                                                        // setloai(data.ltuId);
                                                    }}
                                                    sx={{
                                                        color: "#1C0F0A",
                                                        "&.Mui-checked": {
                                                            color: "#1C0F0A",
                                                        },
                                                    }}
                                                />
                                            }
                                            label={data.ten}
                                        />
                                    ))}
                                </RadioGroup>
                                <p style={{ margin: "0px" }}>Mức giá: </p>
                <div style={{ display: "flex", border: "1px solid black", padding: "15px", borderRadius: "10px" }}>
                    {
                        dsdm.map((data, index) => {
                            return <div style={{ width: "45%", display: "flex" }}>
                                <strong><p style={{ marginRight: "10px" }}>{data.dinhMucSoLuong.soLuongTu} - {data.dinhMucSoLuong.soLuongDen == -1 ? "Về sau" : data.dinhMucSoLuong.soLuongDen}: </p></strong>
                                <input style={{ height: "30px", borderRadius: "10px", padding: "10px" }} defaultValue={data.gia} onChange={(event) => {

                                    let u = [...dsdm]
                                    u[index].gia = parseFloat(event.target.value);
                                    setdsdm(u)
                                }} type="number"></input>
                            </div>
                        })
                    }
                </div>
                <div
                    className="d-flex justify-content-end"
                    style={{ gap: "10px" }}
                >
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        onClick={() => prop.se(false)}
                        variant="outlined"
                        sx={{ color: "#1C0F0A", borderColor: "#1C0F0A", "&:hover": { backgroundColor: "#f4e6e5" } }}
                    >
                        Đóng
                    </Button>
                </div>
            </form>
        </div>
    );
}
