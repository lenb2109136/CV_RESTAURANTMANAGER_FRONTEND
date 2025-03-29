import { useState, useEffect, useRef } from "react";
import axios from "../../config/axiosconfig";
import gsap from "gsap";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Add from "../public/addthucuong"
import ChiTiet from "../public/chitietthucuong"
function findIndexById(array, id) {
    if (!Array.isArray(array)) {
        console.error("Lỗi: Giá trị truyền vào không phải là mảng!", array);
        return -1;
    }
    return array.findIndex(item => item.id === id);
}
export default function (prop) {
    const [loai, setloai] = useState("Nước thông thường");
    const [dsloai, setdsloai] = useState([]);
    const [dsmonan, setdsmonan] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [maloai, setmaloai] = useState(1);
    const [openadd, seta] = useState(false)
    const [openi, seti] = useState(false)
    const [dt, setdt] = useState()
    const [nott, setnott] = useState(false)
    const [dsdvt, setdv] = useState([])
    const [km, setkm] = useState([]);
    const [openkm, setopkm] = useState(false)
    const id = useRef(0);
    useEffect(() => {
        gsap.utils.toArray(".menu").forEach((item, index) => {
            gsap.from(item, {
                x: -100,
                opacity: 0,
                delay: index * 0.2,
                duration: 1,
            });
        });
        gsap.from("#hr", {
            width: "0px",
            duration: 3
        })
        axios.get("/thucuong/getloai")
            .then(d => {
                setdsloai(d.data.data);
                setloai(d.data.data[0].ltuTen);
            })
            .catch(() => alert("Không thể lấy dữ liệu"));

        axios.get("/donvitinh/getds")
            .then(d => {
                setdv(d.data.data)
            })
            .catch(() => alert("Không thể lấy dữ liệu"));


        axios.get(`/thucuong/thucuongbyloai?idloai=1`)
            .then(d => {
                let km = [...d.data.data];
                let requests = km.map(item =>
                    axios.get(`http://localhost:8080/thucuong/getkhuyenmai?id=${item.id}`)
                        .then(response => ({
                            ...item,
                            khuyenmai: response.data.data
                        }))
                );
                Promise.all(requests)
                    .then(updatedKm => {
                        console.log("huhu")
                        console.log(updatedKm)
                        setkm(updatedKm);
                        setdsmonan(d.data.data);
                    })
                    .catch(error => {
                        console.error("Lỗi khi fetch khuyến mãi:", error);
                    });

               
            })
            .catch((e) => alert(e));
    }, []);

    useEffect(() => {
        if (dsmonan.length === 0) {
            setkm([]);  // Nếu không có món ăn nào, đặt km thành mảng rỗng
            return;
        }

        let requests = dsmonan.map(item =>
            axios.get(`http://localhost:8080/thucuong/getkhuyenmai?id=${item.id}`)
                .then(response => ({
                    ...item,
                    khuyenmai: response.data.data
                }))
                .catch(() => ({
                    ...item,
                    khuyenmai: { kmtt: [], kmgv: [] }
                }))
        );

        Promise.all(requests)
            .then(updatedKm => {
                setkm(updatedKm);
            })
            .catch(error => {
                console.error("Lỗi khi fetch khuyến mãi:", error);
            });

    }, [dsmonan]);

    const handleClickOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    return (
        <div style={{border:"2px solid black",position:"fixed",top:"20%",right:"2%",borderRadius:"20px",width:"95%",backgroundColor:"white"}}>
                <div><img onClick={()=>{
                prop.setopen(false)
            }} style={{width:"40px", height:"40px",marginTop:"20px",cursor:"pointer"}} src="https://cdn-icons-png.flaticon.com/128/3415/3415823.png"></img></div>
           
            <div className="d-flex justify-content-center mt-2">
                {openadd ? <Add dvt={dsdvt} dsloai={dsloai} maloai={maloai} seta={seta} dsmonan={dsmonan} setdsmonan={setdsmonan}></Add> : null}
                {openi ? <ChiTiet dvt={dsdvt} data={dt} dsloai={dsloai} se={seti} setnott={setnott} setdsmonan={setdsmonan} maloai={maloai}></ChiTiet> : null}

                {
                    dsloai.map((data) => {
                        return (
                            <p onClick={() => {
                                setmaloai(data.ltuId)
                                setloai(data.ltuTen);
                                axios.get(`/thucuong/thucuongbyloai?idloai=${data.ltuId}`)
                                    .then(d => {
                                        if (d.data.data.length == 0) {
                                            setnott(true)
                                            setdsmonan(d.data.data);
                                        }
                                        else {
                                            setnott(false)
                                            setdsmonan(d.data.data);
                                        }
                                    })
                                    .catch((e) => alert(e));
                            }} className="ms-2" style={{ borderRight: "1px solid black", paddingRight: "10px", cursor: "pointer", color: loai === data.ltuTen ? "#7AB730" : "black" }}>
                                {data.ltuTen}
                            </p>
                        )
                    })
                }

            </div>
            <div className="d-flex position-relative">
                <div className="ms-4"><label className="d-none d-md-inline">Tìm Kiếm:</label> <input className="w-50" placeholder="Tìm kiếm..." onKeyDown={(event) => {
                    if (event.key == "Enter") {
                        axios.get(`/monan/byloai?idloai=${maloai}`)
                            .then(d => {
                                let k = d.data.data.filter(d => d.ten.toLowerCase().includes(event.target.value.toLowerCase()));
                                setdsmonan(k);
                            })
                            .catch((e) => alert(e));
                    }
                }} style={{ borderRadius: "10px", paddingLeft: "10px" }}></input></div>
                

            </div>
            <hr id="hr" className="ms-3 w-100" style={{ backgroundColor: "#1C0F0A" }}></hr>
            {
                nott ? (<div className=" ms-4 row d-flex align-item-center justify-content-center">
                    <img style={{ maxHeight: "700px", maxWidth: "590px" }} className="h-100 w-100" src="https://cdn-icons-gif.flaticon.com/17569/17569424.gif"></img>
                </div>) : null
            }

            <div className="mt-3 ms-4 row menu " style={{ backgroundColor: '#7AB730', cursor: "pointer", borderRadius: "10px" }}>

                {
                    dsmonan.map((data,index) => {
                        return (
                            <div style={{ borderBottom: "1px solid white", marginLeft: "2px" }} className="row mt-2" key={data.id}>
                                <div className="text-white col-lg-2 col-md-2 col-12 mt-2 ms-2 mb-2">
                                    <div className="mx-auto ms-md-2 overflow-hidden" style={{ width: "100px", height: "100px", borderRadius: "50%", borderColor: "gray", borderWidth: "5px", borderStyle: "solid" }}>
                                        <img className="img-fluid overflow-hidden" src={`${data.anhGioiThieu}?t=${new Date().getTime()}`} alt={data.ten}></img>
                                    </div>
                                </div>
                                <div onClick={() => {
                                    setdt(data)
                                    seti(true)
                                }} className="text-white col-lg-4 col-md-4 col-12 mt-4">
                                    <p className="text-sm-center text-md-start text-truncate">{data.ten}</p>
                                    <p className="text-truncate">{data.moTa}</p>
                                </div>
                                <div className="text-white col-lg-1 col-md-1 col-12 mt-2 text-center d-flex align-items-center">
                                    <p>{data.conHang ? "Còn hàng" : "Hết hàng"}</p>
                                </div>
                                <div className="text-white col-lg-2 col-md-2 col-12 mt-2 text-center d-flex align-items-center">
                                    <p>{(data.gia).toLocaleString()} đ</p>
                                </div>

                                <div className="mb-3 ms-2 text-white col-lg-2 col-md-2 col-12 mt-2 text-center d-sm-flex justify-content-center align-items-center mx-auto">
                                <input onClick={(event)=>{
                                            if(event.target.checked){
                                                let t= [...prop.ds]
                                                t[prop.index].dstu.push( {
                                                        id:data.id,
                                                        ten:data.ten,
                                                        soLuong:1,
                                                        ghiChu:""
                                                })
                                                prop.setds(t)
                                            }
                                    }}   defaultChecked={findIndexById(prop.ds[prop.index].dstu,data.id)!=-1? true: false} type="checkbox"></input>
                                </div>
                                {
                                    km[index] && km[index].khuyenmai && (km[index].khuyenmai.kmtt.length > 0 || km[index].khuyenmai.kmgv.length > 0)
                                        ? <img onClick={() => { setopkm(true); id.current = index }}
                                            style={{ width: "100px", height: "50px" }}
                                            src="https://cdn-icons-gif.flaticon.com/15589/15589191.gif">
                                        </img>
                                        : null
                                }
                            </div>
                        )
                    })
                }
            </div>


            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Thông báo"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Món Ăn sẽ ngừng cung cấp , bạn có đồng ý không ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleClose()
                    }
                    } style={{ color: '#8B4513' }}>Không đồng ý</Button>
                    <Button onClick={() => {
                        axios.get(`http://localhost:8080/thucuong/ngung?idloai=${selectedItem.id}`)
                            .then(data => {
                                if (data.data.status == "OK") {
                                    alert(data.data.message)
                                    const updatedMonAn = dsmonan.filter(item => item.id !== selectedItem.id);
                                    setdsmonan(updatedMonAn)
                                }
                                else {
                                    alert(data.data.message)
                                }

                            })
                            .catch(data => {
                                alert("Không thể gửi yêu cầu")
                            })

                        handleClose()


                    }
                    } autoFocus style={{ color: '#8B4513' }}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
            {
                openkm && (km[id.current].khuyenmai.kmtt.length != 0 || km[id.current].khuyenmai.kmgv.length != 0) ? <>
                    <div style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        border: "1px solid #1C0F0A",
                        padding: "15px",
                        alignItems:"center"
                    }}>

                        {km[id.current].khuyenmai.kmtt.length != 0 ? <div>
                            <strong><p style={{ textAlign: "center" }}>Khuyến mãi thông thường</p></strong>
                            {


                                km[id.current].khuyenmai.kmtt.map((data, index) => {
                                    return <div>
                                        <span>{data.KM_TEN}:  <Button onClick={() => {
                                            axios.get(`http://localhost:8080/thucuong/ngungkmtt?idma=${data.TU_ID}&idkm=${data.KM_ID}`)
                                                .then((data) => {
                                                    if (data.data.status == "OK") {
                                                        alert("đã ngưng sử dụng khuyến mãi");
                                                        let kk = [...km]
                                                        kk[id.current].khuyenmai.kmtt.pop(index);
                                                        setkm(kk);
                                                    }
                                                })
                                        }}>Ngưng áp dụng</Button></span>

                                    </div>
                                })
                            }
                        </div> : null}
                        {km[id.current].khuyenmai.kmgv.length != 0 ? <div>
                            <strong><p style={{ textAlign: "center" }}>Khuyến mãi giờ vàng</p></strong>
                            {


                                km[id.current].khuyenmai.kmgv.map((data,index) => {
                                    return <div>
                                        <span>{data.KM_TEN}-</span>
                                        <Button onClick={()=>{
                                            axios.get(`http://localhost:8080/thucuong/ngungkmgvt?idma=${data.TU_ID}&idkm=${data.KM_ID}`)
                                            .then((data) => {
                                                if (data.data.status == "OK") {
                                                    alert("đã ngưng sử dụng khuyến mãi");
                                                    let kk = [...km]
                                                    kk[id.current].khuyenmai.kmgv.pop(index);
                                                    setkm(kk);
                                                }
                                            })
                                        }}>Ngưng áp dụng</Button>
                                        
                                    </div>
                                })
                            }
                            
                        </div> : null}
                        <hr></hr>
                        <Button onClick={()=>{setopkm(false)}} style={{marginLeft:"40%"}}>Đóng</Button>
                    </div>
                </>
                    : null
            }

        </div>
    )
}
