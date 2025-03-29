import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import {  Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../config/axiosconfig";
import gsap from "gsap"
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
const [anchorEl1, setAnchorEl1] = useState(null);
const open1 = Boolean(anchorEl1);

const handleClick1 = (event) => {
  setAnchorEl1(event.currentTarget);
};

const handleClose1 = () => {
  setAnchorEl1(null);
};

// Dropdown 2
const [anchorEl2, setAnchorEl2] = useState(null);
const open2 = Boolean(anchorEl2);

const handleClick2 = (event) => {
  setAnchorEl2(event.currentTarget);
};

const handleClose2 = () => {
  setAnchorEl2(null);
};

// Dropdown 3
const [anchorEl3, setAnchorEl3] = useState(null);
const open3 = Boolean(anchorEl3);

const handleClick3 = (event) => {
  setAnchorEl3(event.currentTarget);
};

const handleClose3 = () => {
  setAnchorEl3(null);
};

// Dropdown 4
const [anchorEl4, setAnchorEl4] = useState(null);
const open4 = Boolean(anchorEl4);

const handleClick4 = (event) => {
  setAnchorEl4(event.currentTarget);
};

const handleClose4 = () => {
  setAnchorEl4(null);
};


    useEffect(() => {
        // gsap.from(".hihi", {
        //     y: -1,
        //     opacity: 0
        // })
        // gsap.to(".kaka", {
        //     y: -5,
        //     yoyo: true,
        //     repeat: 4,
        //     // borderColor:"black"
        // })
    })
    function removeIdsFromArray(array1, array2) {
        const resultArray = [...array2];
        const idsToRemove = new Set(array1.map(item => item.id));
        return resultArray.filter(item => !idsToRemove.has(item.id));
    }
    
    const [imageSrc, setImageSrc] = useState(null);
    const [dsmacb,setdsmacb]=useState([])
    const [dstucb,setdstucb]=useState([])
    const [dsma,setma] =useState([])
    const [dstu,settu]=useState([])
    const [dsmaa,setmaa] =useState([])
    const [dstua,settua]=useState([])
    const[dsltu,setdsltu]=useState([])
    const [dslma,setdslma]=useState([])
    var c1;
    var c2;
    useEffect(()=>{
        axios.get("/monan/getall")
        .then((data)=>{
            setma(data.data.data)
            setmaa(data.data.data)
        }).catch(()=> alert("Lấy dữ liệu thất bại"))
        axios.get("/thucuong/getall")
        .then((data)=>{
            settu(data.data.data)
            settua(data.data.data)
        }).catch(()=> alert("Lấy dữ liệu thất bại"))
        axios.get("/thucuong/getloai")
        .then((data)=>{
            setdsltu(data.data.data)
        }).catch(()=> alert("Lấy dữ liệu thất bại"))
        axios.get("/getloaimonan")
        .then((data)=>{
            setdslma(data.data.data)
        }).catch(()=> alert("Lấy dữ liệu thất bại"))
    },[])
    useEffect(()=>{
        setma(removeIdsFromArray(dsmacb,dsmaa))
    },[dsmacb])

    useEffect(()=>{
        settu(removeIdsFromArray(dstucb,dstua))
    },[dstucb])
    
    
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
        formData.append("loaicombo", prop.maloai);
        formData.append("dsma", JSON.stringify(dsmacb))
        formData.append("dstu",JSON.stringify(dstucb))
        
        formData.append("giaa",JSON.stringify(dsdm))
        try {
            const response = await axios.post("http://localhost:8080/combo/save", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
        }});
            if (response.data.status === "OK") {
                alert("Thêm món ăn thành công");
                let ds = [...prop.dsmonan];
                ds.push(response.data.data);
                prop.setdsmonan(ds);
                document.getElementById("form").reset();
                setImageSrc(null); // Reset ảnh về null
            }
            else {
                alert(response.data.message)
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
                border: "2px solid #1C0F0A", // Viền bao quanh
                marginLeft: "50px"
            }}
        >
            <form id="form" className="row" style={{ gap: "15px" }}>
                <div className="col-12 d-flex justify-content-center align-items-center">
                    <img
                        className="kaka"
                        alt="Ảnh combo"
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
                    label="Tên combo"
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#1C0F0A" } }}
                    InputProps={{
                        style: { borderColor: "#1C0F0A" },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "#1C0F0A", // Khi hover
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1C0F0A", // Khi focus
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
                                borderColor: "#1C0F0A", // Khi hover
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1C0F0A", // Khi focus
                            },
                        },
                    }}

                />
                <div>

                </div>
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
                <div className="d-flex justify-content-end">
                    <button onClick={() => {

                    }} className="position-absolute top-0 end-0"
                        style={{ backgroundColor: "#1C0F0A", color: "white", borderRadius: "10px" }}>
                        Chọn món ăn</button>
                  
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {/* Dropdown 1 */}
      <div className="row">
                <div style={{display:"flex"}}>
                    <Button onClick={handleClick1} style={{ color: "#1C0F0A" }}>
        Chọn món ăn
      </Button>
      <Menu anchorEl={anchorEl1} open={open1} onClose={handleClose1}>
      {
                            dsma.map((data,index)=>{

                                

                                return  <MenuItem onClick={()=>{
                                    let u=[...dsmacb,{id:data.id,ten:data.ten,soluong:1}]
                                    setdsmacb(u)
                                    handleClose1()
                                }} style={{ color: "#1C0F0A" }}>
                                {data.ten}
                              </MenuItem>
                            })
                        }

        
       
      </Menu>

      {/* Dropdown 2 */}
      <Button onClick={handleClick2} style={{ color: "#1C0F0A" }}>
        Loại món ăn
      </Button>
      <Menu anchorEl={anchorEl2} open={open2} onClose={handleClose2}>

      {
                            dslma.map((data)=>{
                                return  <MenuItem onClick={()=>{
                                    axios.get(`/monan/byloai?idloai=${data.id}`)
                                    .then((d)=>{
                                        let ds= d.data.data;
                                        setma(removeIdsFromArray(dsmacb,ds))
                                    })
                                    handleClose2()
                                }} style={{ color: "#1C0F0A" }}>
                                {data.tenLoai}
                              </MenuItem>
                            })
                        }

      </Menu>
                    </div>
     
      </div>

      <table className="w-100" style={{
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
                        dsmacb.map((data, index) => {
                            return (
                                <tr key={index} style={{ textAlign: "center", backgroundColor: index % 2 === 0 ? "#e8e0d4" : "#f2f0ec" }}>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A" }}>{index + 1}</td>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A" }}>{data.ten}</td>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A"}}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => {
                                                 let ds= [...dsmacb]
                                                 ds[index].soluong++;
                                                 setdsmacb(ds)
                                            }}>+</p>
                                            <p>{data.soluong}</p>
                                            <p onClick={() => {
                                               let ds= [...dsmacb]
                                               let ui= ds[index].soluong--;
                                               if(ui==1){
                                                    ds.splice(index,1);
                                               }
                                                setdsmacb(ds)
                                            }} style={{ marginLeft: "10px", cursor: "pointer" }}>-</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>



{/* TỚI PHẦN THỨUC UỐNG */}
      {/* Dropdown 3 */}
      <Button onClick={handleClick3} style={{ color: "#1C0F0A" }}>
        Chọn thức uống
      </Button>
      <Menu anchorEl={anchorEl3} open={open3} onClose={handleClose3}>
      {
                            dstu.map((data,index)=>{

                                return <MenuItem onClick={()=>{
                                    let u=[...dstucb,{id:data.id,ten:data.ten,soluong:1}]
                                    setdstucb(u)
                                    handleClose3()
                                }  } style={{ color: "#1C0F0A" }}>
                               {data.ten}
                              </MenuItem>
                            })
                        }

        
      
      </Menu>

      {/* Dropdown 4 */}
      <Button onClick={handleClick4} style={{ color: "#1C0F0A" }}>
        Loại thức uống
      </Button>
      <Menu anchorEl={anchorEl4} open={open4} onClose={handleClose4}>
      {
                            dsltu.map((data)=>{
                                return <MenuItem onClick={()=>{
                                    axios.get(`/thucuong/thucuongbyloai?idloai=${data.ltuId}`)
                                    .then((d)=>{
                                        let ds= d.data.data;
                                        settu(removeIdsFromArray(dstucb,ds))
                                    })
                                    handleClose4()
                                }} style={{ color: "#1C0F0A" }}>
                                {data.ltuTen}
                              </MenuItem>
                            })
                        }

       
      </Menu>

      <table className="w-100" style={{
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
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Tên Thức Uống</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dstucb.map((data, index) => {
                            return (
                                <tr key={index} style={{ textAlign: "center", backgroundColor: index % 2 === 0 ? "#e8e0d4" : "#f2f0ec" }}>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A" }}>{index + 1}</td>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A" }}>{data.ten}</td>
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A"}}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => {
                                                let ds= [...dstucb]
                                                ds[index].soluong++;
                                                setdstucb(ds)
                                            }}>+</p>
                                            <p>{data.soluong}</p>
                                            <p onClick={() => {
                                               let ds= [...dstucb]
                                               let ui= ds[index].soluong--;
                                               if(ui==1){
                                                    ds.splice(index,1);
                                               }
                                                setdstucb(ds)
                                            }} style={{ marginLeft: "10px", cursor: "pointer" }}>-</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
    </div>
                    
                   
                 
                </div>

                {/* thức uống */}
                <div className="d-flex justify-content-end">
                    <button onClick={() => {

                    }} className="position-absolute top-0 end-0"
                        style={{ backgroundColor: "#1C0F0A", color: "white", borderRadius: "10px" }}>
                        Chọn món ăn</button>
                  
                   
                   
                </div>

                {/* hết thức uống */}
                <div
                    className="d-flex justify-content-end"
                    style={{ gap: "10px" }}
                >
                    <Button
                        onClick={()=>{
                            handleSubmit()
                            console.log(dsmacb)
                            console.log(dstucb)
                        }
                            }
                        variant="contained"
                        sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                        
                    >
                        Thêm món
                    </Button>
                    <Button
                        onClick={() => prop.seta(false)}
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
