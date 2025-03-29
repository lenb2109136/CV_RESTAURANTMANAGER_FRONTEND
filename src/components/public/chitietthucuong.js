import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../config/axiosconfig";
import gsap from "gsap";

export default function ChiTietMonAn(prop) {

    const [dsdm, setdsdm] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8080/giathucuong/getgia?id=${prop.data.id}`)
            .then(data => {
                setdsdm(data.data.data)
            })
    }, [])
    const [imageSrc, setImageSrc] = useState(prop.data.anhGioiThieu || null);
    const [check, setc] = useState(false);
    const [loai, setloai] = useState(prop.data.loaiThucUong.ltuId);
    const [selectedDVT, setSelectedDVT] = useState("");

    useEffect(() => {
        const manButton = document.getElementById("man");
        const chayButton = document.getElementById("chay");
        const loaiButton = document.getElementById(`${prop.data.loaiThucUong.ltuId}`);
        const conHangCheckbox = document.getElementById("conhang");

        if (prop.data.chay && manButton) {
            manButton.click();
        } else if (!prop.data.chay && chayButton) {
            chayButton.click();
        }

        if (conHangCheckbox) {
            setc(prop.data.conHang);
            conHangCheckbox.checked = prop.data.conHang;
        }

        if (loaiButton) {
            loaiButton.click();
        }

        gsap.from(".kuku", {
            y: -3,
            opacity: 1,
        });

    }, [prop.data]);
    useEffect(() => {
        console.log(document.getElementById("dvt1"))
    }, [])
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
        formData.append("iddvt", prop.data.donViTinh.dvtId);
        formData.append("giaa",JSON.stringify(dsdm))
        if (!check) {
            formData.append("conHang", false);
        }
        try {
            const response = await axios.post("http://localhost:8080/thucuong/updatethucuong", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.status === "OK") {
                alert("Cập nhật dữ liệu thành công");
                axios.get(`/thucuong/thucuongbyloai?idloai=${prop.maloai}`)
                    .then(d => {
                        if (d.data.data.length == 0) {
                            prop.setnott(true)
                            prop.setdsmonan(d.data.data);
                        }
                        else {
                            prop.setnott(false)
                            prop.setdsmonan(d.data.data);
                        }
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
                backgroundColor:"white"
            }}
        >
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
                    label="Tên món ăn"
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
                                id={"dvt" + data.dvtId}

                                sx={{
                                    color: "#1C0F0A",
                                }}
                            >
                                {data.dvtTenDVT}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            id="conhang"
                            name="conHang"
                            value="true"
                            checked={check}
                            onChange={() => setc(!check)}
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
                    {prop.dsloai.map((data) => (
                        <FormControlLabel
                            key={data.ltuId}
                            value={data.ltuId}
                            control={
                                <Radio
                                    id={data.ltuId}
                                    name="idloai"
                                    value={data.ltuId}
                                    onClick={() => {
                                        setloai(data.ltuId);
                                    }}
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
                        sx={{
                            backgroundColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#331C18" },
                        }}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        onClick={() => prop.se(false)}
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
