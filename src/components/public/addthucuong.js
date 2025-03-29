import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../config/axiosconfig";
import gsap from "gsap";

export default function Addproduct(prop) {
    const [dsdm, setdsdm] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8080/dinhmuc/getds")
            .then(data => {
                let u=[]
                for(let i=0;i<data.data.data.length;i++){
                        u.push({
                            dinhMucSoLuong: data.data.data[i],
                            gia:0
                        })
                }
                console.log(u)
                setdsdm(u)
            })
    }, [])
    useEffect(() => {
        // gsap.from(".hihi", {
        //     y: -1,
        //     opacity: 0,
        // });
        // gsap.to(".kaka", {
        //     y: -5,
        //     yoyo: true,
        //     repeat: 4,
        // });
    });

    const [imageSrc, setImageSrc] = useState(null);
    const [selectedDVT, setSelectedDVT] = useState(""); // State cho danh sách chọn
    const [loai,setloai]= useState();
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
        formData.append("iddvt", selectedDVT);
        formData.append("tinhTrangSuDung", true)
        formData.append("idloai", loai);
        formData.append("giaa",JSON.stringify(dsdm))
        try {
            const response = await axios.post(
                "http://localhost:8080/thucuong/savethucuong",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.status === "OK") {
                alert("Thêm thức uống thành công");
                document.getElementById("form").reset();
                setImageSrc(null);
                setSelectedDVT(""); // Reset dropdown
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div
            className="w-75 w-md-50 w-lg-50 position-absolute ms-4 hihi"
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
            <form id="form" className="row" style={{ gap: "15px" }}>
                <div className="col-12 d-flex justify-content-center align-items-center">
                    <img
                        className="kaka"
                        alt="Ảnh thức uống"
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
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    name="anh"
                />
                <TextField
                    name="ten"
                    fullWidth
                    label="Tên thức uống"
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
                    fullWidth
                    multiline
                    minRows={3}
                    label="Mô tả "
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
                {/* Danh sách chọn (Dropdown) */}
                <FormControl
                    fullWidth
                    sx={{
                        "& .MuiInputLabel-root": {
                            color: "#1C0F0A",
                        },
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "#1C0F0A",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1C0F0A",
                            },
                        },
                    }}
                >
                    <InputLabel id="select-dvt-label">Đơn vị tính</InputLabel>
                    <Select
                        labelId="select-dvt-label"
                        value={selectedDVT}
                        // name="dvt"
                        onChange={(e) => setSelectedDVT(e.target.value)}
                        label="Đơn vị tính"
                        sx={{
                            "& .MuiSelect-icon": {
                                color: "#1C0F0A",
                            },
                        }}
                    >
                        {prop.dvt.map((data) => (
                            <MenuItem
                                key={data.dvtId}
                                value={data.dvtId}
                                sx={{
                                    color: "#1C0F0A",
                                }}
                            >
                                {data.dvtTenDVT}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <RadioGroup row>
                    {prop.dsloai.map((data) => (
                        <FormControlLabel
                            key={data.ltuId}
                            onClick={()=>{
                                setloai(data.ltuId)
                            }}
                            control={
                                <Radio
                                    name="ltu"
                                    value={data.ltuId}
                                    sx={{
                                        color: "#1C0F0A",
                                        "&.Mui-checked": {
                                            color: "#1C0F0A",
                                        },
                                    }}
                                />
                            }
                            label={data.ltuTen}
                        />
                    ))}
                </RadioGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="conHang"
                            value="true"
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

<p style={{margin:"0px"}}>Mức giá: </p>
                <div style={{ display: "flex", border: "1px solid black",padding:"15px",borderRadius:"10px"}}>
                   {
                     dsdm.map((data, index)=>{
                      return  <div style={{ width: "45%",display:"flex"}}>
                                    <strong><p style={{marginRight:"10px"}}>{data.dinhMucSoLuong.soLuongTu} - {data.dinhMucSoLuong.soLuongDen==-1?"Về sau":data.dinhMucSoLuong.soLuongDen}: </p></strong>
                                    <input style={{height:"30px",borderRadius:"10px",padding:"10px"}} defaultValue={data.gia} onChange={(event)=>{

                                        let u=[...dsdm]
                                        u[index].gia=parseFloat(event.target.value);
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
                        sx={{
                            backgroundColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#331C18" },
                        }}
                    >
                        Thêm món
                    </Button>
                    <Button
                        onClick={() => prop.seta(false)}
                        variant="outlined"
                        sx={{
                            color: "#1C0F0A",
                            borderColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#f4e6e5" },
                        }}
                    >
                        Đóng
                    </Button>
                </div>
            </form>
        </div>
    );
}
