import { Button } from "@mui/material";
import ADDKM from "./addkhuyenmaithongthuong";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import UpdateKMTT from "./CapNhatThongTinKhuyenMai"
import UpdateGV from "./CapNhatKhuyenmaigiovang"
import ChonHangLoat from "./chonhangloat"
import NangSuat from "./nangsuat"

function KhuyenMai() {
    // const [opennangsuat,setopennangsuat]
    const [open, seto] = useState(false)
    const gv = useRef(false);
    const kmttpick = useRef(0);
    const [updatett, setudtt] = useState(false);
    const [dskmtt, setdskmt] = useState([])
    const [dskmgv, setdskgv] = useState([])
    const [ha,setha] =useState(false)
    useEffect(() => {
        axios.get("http://localhost:8080/khuyenmai/getkmtt")
            .then(data => {
                setdskmt(data.data.data)
            })
        axios.get("http://localhost:8080/khuyenmai/getkmgv")
            .then(data => {
                setdskgv(data.data.data)
            })
    }, [])
    return <>
        <div className="row ms-2">


            {updatett ? <UpdateKMTT idkm={kmttpick.current} seto={setudtt}></UpdateKMTT> : null}
            {open ? <ADDKM gv={gv.current} seto={seto}></ADDKM> : null}
            
            <Button style={{ width: "13%" }}
                variant="contained"
                sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                onClick={() => {
                    seto(true)
                    gv.current = false
                }}
            >
                Tạo Khuyến mãi thông thường
            </Button>
            <Button className="ms-2" style={{ width: "13%" }}
                variant="contained"
                sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                onClick={() => {
                    gv.current = true;
                    seto(true)
                }}
            >
                Tạo Khuyến mãi giờ vàng
            </Button>

            <strong><p style={{ marginTop: "10px", borderTop: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black", borderRadius: "10px", paddingLeft: "10px", textAlign: "center" }}>Danh sách khuyến mãi đang áp dụng - Khuyến mãi thông thường</p></strong>
            <div>
                <p>Khuyến mãi</p>
                {ha?<div style={{position:"absolute",backgroundColor:"white",width:"96%",marginRight:"5%",border:"1px solid #1C0F0A",
                     paddingTop:"20px",paddingRight:"30px",top:"18%"}}>
                        <Button className="ms-2" style={{ width: "13%",marginBottom:"20px" }}
                variant="contained"
                sx={{ backgroundColor: "#1C0F0A", "&:hover": { backgroundColor: "#331C18" } }}
                onClick={() => {
                    setha(false)
                }}
                
            >
                Đóng
            </Button>
            <h4 style={{textAlign:"center"}}>Biểu đồ hiệu suất khuyến mãi</h4>
                        {<NangSuat id={kmttpick.current}></NangSuat>}</div>:null}
            </div>
            <table className="w-100 mt-2" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }} >
                <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >STT</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Tên Khuyến Mãii</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Ngày áp dụng</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Ngày kết thúc</td>
                    <td  style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Xem chỉ số</td>
                </tr>
                {
                    dskmtt?.map((data, index) => {
                        const formatDate = (isoString) => {
                            const date = new Date(isoString);
                            return date.toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            });
                        };

                        return (
                            <tr key={data.id} style={{ cursor: "pointer" }} >
                                <td onClick={() => {
                                kmttpick.current = data.id;
                                setudtt(true)
                            }} style={{ textAlign: "center", padding: "10px" }}>{index + 1}</td>
                                <td onClick={() => {
                                kmttpick.current = data.id;
                                setudtt(true)
                            }} style={{ textAlign: "center", padding: "10px" }}>{data.ten}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{formatDate(data.ngayGioApDung)}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{formatDate(data.ngayGioKetThuc)}</td>
                                <td style={{ textAlign: "center", padding: "10px" }} onClick={()=>{  kmttpick.current = data.id;setha(true)}}>Xem chỉ số</td>
                            </tr>
                        );
                    })
                }

            </table>


            {/* khuyến mãi giờ vàng */}

            <strong><p style={{ marginTop: "10px", borderTop: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black", borderRadius: "10px", paddingLeft: "10px", textAlign: "center" }}>Danh sách khuyến mãi đang áp dụng - Khuyến mãi giờ vàng</p></strong>
            <table className="w-100 mt-2" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }} >
                <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >STT</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Tên Khuyến Mãii</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Ngày áp dụng</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Ngày kết thúc</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Giờ bắt đầu</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Giờ kết thúc</td>
                    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Xem chỉ số</td>
                </tr>
                {
                    dskmgv.map((data, index) => {
                        const formatDate = (isoString) => {
                            const date = new Date(isoString);
                            return date.toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            });
                        };

                        return (
                            <tr key={data.id}>
                                <td style={{ textAlign: "center", padding: "10px" }}>{index + 1}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{data.ten}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{formatDate(data.ngayGioApDung)}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{formatDate(data.ngayGioKetThuc)}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{data.gioApDung}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>{data.gioKetThuc}</td>
                                <td style={{ textAlign: "center", padding: "10px" }}>Xem thống kê</td>
                            </tr>
                        );
                    })
                }

            </table>
                
        </div>
    </>
}
export default KhuyenMai;