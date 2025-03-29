import { Button, Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemCaLam from "./ThemCaLam";
import PhanCa from "./phancalam"
import QuanLyCaTuan from "./quanlycatuan"
function Calam() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [bophan,setbophan]= useState([])
    const [opencalam,setopencalam]= useState(false)
    const [op,setop]=useState(false);
    const [opql,setopql]=useState(false)
    useEffect(()=>{
        axios.get("http://localhost:8080/bophan/getds")
        .then((data)=>{
            setbophan(data.data.data);
        })
        .catch(()=>{
            alert("Lấy dữ liệu không thành công")
        })
        document.getElementById("kiki").click()
    },[])
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const [chucnang,setchucnang]= useState(1)
    return (
        <div className="row" style={{ marginLeft: "0.08%" }}>
            <div className="row">
                <div className="col-3">
                    <Button
                    id="kiki"
                        variant="contained"
                        sx={{
                            backgroundColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#331C18" },
                        }}
                        onClick={()=>{
                            setopencalam(true)
                            setop(false)
                    }}
                    >
                        Quản lý thời gian ca
                    </Button>
                    
                </div>
                <div className="col-3">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#331C18" },
                        }}
                        onClick={()=>{
                            setopencalam(false);
                            setop(true)
                            setopql(false)
                        }}
                    >
                        Phân ca làm
                    </Button>
                </div>
                <div className="col-3">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#331C18" },
                        }}
                        onClick={()=>{
                            setopencalam(false);
                            setop(false)
                            setopql(true)
                        }}
                    >
                       Quản lý ca tuần
                    </Button>
                </div>
            </div>
            <hr className="mt-2" style={{}}></hr>
            
            {
                opencalam ? <ThemCaLam setopen={setopencalam}></ThemCaLam> : null
                
            }
            {
                op ? <PhanCa></PhanCa> :null
            }
            {
                opql ? <QuanLyCaTuan></QuanLyCaTuan> : null
            }
        </div>
    );
}

export default Calam;
