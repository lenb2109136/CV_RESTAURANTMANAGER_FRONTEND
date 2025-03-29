import { Button } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import PVCB from "./phucvucombo"
import PVMA from "./phucvumonan"
import PVTU from "./phucvuthucuong"
import CB from "./choBan"
import { database, them } from "../public/firebaseconfig"
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { layDuLieuTheoID } from "../public/firebaseconfig"
import { capNhatDuLieuTheoID } from "../public/firebaseconfig";
import { xoaDuLieuTheoID } from "../public/firebaseconfig";
import { get, onValue, push, ref, remove, set } from "firebase/database";
import { Alert } from "@mui/material";
function recreateDon(send) {
    if (!send || !Array.isArray(send.listOrder)) {
        console.error("Dữ liệu không hợp lệ:", send);
        return [];
    }

    let don2 = [];

    send.listOrder.forEach(item => {
        let data = {
            soLuongNguoi: item.soLuongNguoi || 0,
            ban: [],
            dsma: [],
            dstu: [],
            dscb: [],

        };
        (item.ban || []).forEach(b => {
            data.ban.push({
                stt: b.banId,
                sanh: b.sanhId
            });
        });

        (item.dsma || []).forEach(d => {
            data.dsma.push({
                id: d.id,
                soLuong: d.soLuong || 0,
                ten: d.ten || "",
                ghiChu: d.ghiChu
            });
        });

        (item.dstu || []).forEach(d => {
            data.dstu.push({
                id: d.id,
                soLuong: d.soLuong || 0,
                ten: d.ten || "",
                ghiChu: d.ghiChu
            });
        });

        (item.dscb || []).forEach(d => {
            data.dscb.push({
                id: d.id,
                soLuong: d.soLuong || 0,
                ten: d.ten || "",
                ghiChu: d.ghiChu
            });
        });

        don2.push(data);
    });
    console.log(don2)
    return don2;
}


function ThemDon() {
    const lamxong = useRef(false)
    const [don, setdon] = useState({})
    const indexcho = useRef(0)
    const [openmonan, setopenmonan] = useState(false)
    const [openthucuong, setopenthucuong] = useState(false)
    const [opencombo, setopencombo] = useState(false)
    const [openchonban, setopenchonban] = useState(false)
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const [dui, setdui] = useState()
    const navigate = useNavigate()
    const dataRef = ref(database, "dsdanglam");
    const suthaydoi = ref(database, `dsdanglam/${id}/update`)
    const idchitiet = useRef(0)
    const [dudu, setdudu] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await layDuLieuTheoID("dsdanglam", id);
                setdui(data)
                setdon(recreateDon(data)?.[0])
                console.log("dữ liệu gán: ")
                console.log(recreateDon(data))
                data.update = false
                capNhatDuLieuTheoID("dsdanglam", id, data)

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        return async () => {

            const data = await layDuLieuTheoID("dsdanglam", id);
            if (lamxong.current == false && data.update == false) {
                xoaDuLieuTheoID("dsdanglam", id)
                data.id = parseInt(data.id)
                them(data, "dscho", id)
            }
            else {

            }

        }
    }, [])

    useEffect(() => {
        const dataRef = ref(database, `dsdanglam/${id}`);
        const unsubscribe = onValue(dataRef, (snap) => {
            setdon(recreateDon(snap.val())?.[0]);
        });
        return () => unsubscribe();
    }, [id]);
    useEffect(() => {
        const langnghe = onValue(suthaydoi, (snap) => {
            setdudu(snap.val())
        })
        return () => langnghe();
    }, [])
    console.log("dữ liệu đây bạn ")
    console.log(don)
    return <>
        <div className="row">
            <div>
                {

                    dudu == true ? <Alert variant="outlined" style={{ border: "2px solid orange" }} severity="warning">
                        Đơn đang được thay đổi vui lòng chờ giây lát
                    </Alert> : null
                }
            </div>
            <div style={{ display: "flex", color: "#7AB730" }} >
                <strong><h2 style={{ textAlign: "center" }}>Thông tin bàn ăn</h2></strong>
                <button onClick={async () => {
                    try {
                        lamxong.current=true
                        const dataRef = ref(database, `dsdanglam/${id}`);
                        const snapshot = await get(dataRef);
                        alert("huhuhuhu")
                        if (snapshot.exists()) {
                            await remove(dataRef);
                            const r = ref(database, `dschothanhtoan/${id}`);
                            set(r,snapshot.val())
                        }

                        navigate("/quanly/dscho")
                    } catch (error) {
                        console.error("Lỗi khi chuyển đơn:", error);
                    }
                }} disabled={dudu}>Làm xong</button>

            </div>

            <table>
                <tr style={{ border: "1px solid  #7AB730", textAlign: "center", color: "white" }}>
                    <td style={{ backgroundColor: "#7AB730" }}>STT</td>
                    <td style={{ color: "#7AB730" }}>Bàn</td>
                    <td style={{ backgroundColor: "#7AB730" }}> Thông tin bàn ăn</td>
                    <td style={{ color: "#7AB730" }}>Số lượng người</td>
                </tr>
                <tr style={{ textAlign: "center", borderBottom: "2px solid rgb(42, 66, 12)", paddingBottom: "20px" }}>
                    <td style={{ borderRight: "1px solid #7AB730", borderLeft: "1px solid #7AB730" }}>1</td>
                    <td style={{ borderRight: "1px solid #7AB730" }}>{
                        don?.ban?.map(data => {
                            return <div>
                                <p>STT: {data.stt} - Sảnh : {data.sanh}</p>
                            </div>
                        })
                    }
                    </td>
                    <td style={{ borderRight: "1px solid #7AB730" }}>
                        <div>
                            <strong><p style={{ textAlign: "center", color: "#7AB730", marginTop: "5%" }}>Thông tin bàn ăn</p></strong>
                            {don?.dsma?.length != 0 ? <><hr></hr><p>Danh sách món ăn</p></> : null}

                            <div>
                                {
                                    don?.dsma?.map((d, i) => {
                                        return <>
                                            <div className="row">
                                                <div className="col-lg-7 col-md-7 col-sm-7">
                                                    <strong> <p style={{ textAlign: "start", marginLeft: "10px" }}>{d.ten}</p></strong>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-sm-3">
                                                    <span style={{ width: "150px" }}>Tổng: {d.soLuong}</span>
                                                </div>

                                            </div>
                                            {d.ghiChu != '' ? <p><strong>" </strong>{d.ghiChu} <strong>" </strong></p> : null}
                                        </>
                                    })
                                }
                            </div>
                        </div>




                        <div>
                            {don?.dstu?.length != 0 ? <><hr></hr><p>Danh sách món ăn</p></> : null}

                            <div>
                                {
                                    don?.dstu?.map((d, i) => {
                                        return <>
                                            <div className="row">
                                                <div className="col-lg-7 col-md-7 col-sm-7">
                                                    <strong><p style={{ textAlign: "start", marginLeft: "30px" }}>{d.ten}</p></strong>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-sm-3">
                                                    <span onClick={() => {
                                                        // if (don[index].dstu[i].soLuong - 1 <= 0) {
                                                        //     let t = [...don]
                                                        //     t[index].dstu.pop(i)
                                                        //     setdon(t)
                                                        // }
                                                    }} style={{ fontSize: "20px", paddingRight: "15px", cursor: "pointer" }}>-</span><span>{d.soLuong}</span><span onClick={() => {
                                                        // if (don[index].dstu[i].soLuong - 1 <= 0) {
                                                        //     let t = [...don]
                                                        //     t[index].dstu[i].soLuong++;
                                                        //     setdon(t)
                                                        // }
                                                    }} style={{ fontSize: "20px", paddingLeft: "15px", cursor: "pointer" }}>+</span>
                                                </div>
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </div>
                        <div>
                            {don?.dscb?.length != 0 ? <><hr></hr><p>Danh sách món ăn</p></> : null}
                            <div>
                                {
                                    don?.dscb?.map((d, i) => {
                                        return <>
                                            <div className="row">
                                                <div className="col-lg-7 col-md-7 col-sm-7">
                                                    <strong><p style={{ textAlign: "start", marginLeft: "30px" }}>{d.ten}</p></strong>
                                                </div>
                                                <div className="col-lg-3 col-md-3 col-sm-3">
                                                    <strong>
                                                        <span style={{ fontSize: "20px", paddingRight: "15px", cursor: "pointer" }} onClick={() => {
                                                            // if (don[index].dscb[i].soLuong - 1 <= 0) {
                                                            //     let t = [...don]
                                                            //     t[index].dscb.pop(i)
                                                            //     setdon(t)
                                                            // }
                                                        }}>-</span>
                                                    </strong>
                                                    <span>{d.soLuong}</span><span style={{ fontSize: "20px", paddingLeft: "15px", cursor: "pointer" }} onClick={() => {
                                                        // if (don.dscb[i].soLuong - 1 <= 0) {
                                                        //     let t = [...don]
                                                        //     t[index].dsma.pop(i)
                                                        //     setdon(t)
                                                        // }
                                                    }}>+</span>
                                                </div>
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </div>
                    </td>
                    <td style={{ borderRight: "1px solid #7AB730" }}>

                        <p>{don?.soLuongNguoi!=undefined}?{don?.soLuongNguoi}:0</p>
                    </td>
                </tr>
            </table>

        </div>
    </>
}
export default ThemDon;