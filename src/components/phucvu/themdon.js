import { Button } from "bootstrap";
import { useRef, useState } from "react";
import PVCB from "./phucvucombo"
import PVMA from "./phucvumonan"
import PVTU from "./phucvuthucuong"
import CB from "./choBan"
import {them} from "../public/firebaseconfig"
import axios from "axios";
function ThemDon() {

    const [don, setdon] = useState([])
    const indexcho = useRef(0)
    const [openmonan, setopenmonan] = useState(false)
    const [openthucuong, setopenthucuong] = useState(false)
    const [opencombo, setopencombo] = useState(false)
    const [openchonban, setopenchonban] = useState(false)

    return <>
        <div className="row">
            <div style={{ display: "flex", color: "white" }} >
                <button style={{ backgroundColor: "#7AB730", color: "white", borderRadius: "10px", padding: "15px", marginBottom: "30px" }} onClick={() => {
                    let t = [...don]
                    t.push({
                        ban: [],
                        dsma: [],
                        dstu: [],
                        dscb: [],
                        soLuongNguoi: 0
                    })
                    setdon(t)
                }}><strong>Thêm Bàn Ăn Mới</strong></button>

                {don?.length != 0 ? <button style={{ marginLeft: "40px", backgroundColor: "#7AB730", color: "white", borderRadius: "10px", padding: "15px", marginBottom: "30px" }} onClick={() => {
                    
                    let send = {
                        id: 0,
                        listOrder: [],
                        trangThai:0
                    };
                    don.forEach(data => {
                        const item = {
                            soLuongNguoi: !isNaN(parseInt(data.soLuongNguoi)) ? parseInt(data.soLuongNguoi) : 0,
                            ban: [],
                            dsma: [],
                            dstu: [],
                            dscb: [],
                            id: 0
                        };


                        data.ban.forEach(d1 => {
                            const d11 = {
                                banId: d1.stt,
                                sanhId: d1.sanh
                            };
                            item.ban.push(d11);

                        })

                        data.dsma.forEach(d11 => {
                            const obj = {
                                Id: d11.id,
                                soLuong: d11.soLuong,
                                ten: d11.ten
                            };
                            item.dsma.push(d11);

                        })
                        data.dstu.forEach(d11 => {
                            const obj = {
                                Id: d11.id,
                                soLuong: d11.soLuong,
                                ten: d11.ten
                            };
                            item.dstu.push(d11);

                        })
                        data.dscb.forEach(d11 => {
                            const obj = {
                                Id: d11.id,
                                soLuong: d11.soLuong,
                                ten: d11.ten
                            };
                            item.dscb.push(d11);

                        })

                        send.listOrder.push(item)

                    })

                    axios.post('http://localhost:8080/yeucau/save', send, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                       let h={...response.data.data,update:false}
                        them(h,"dscho",response.data.data.id)
                        alert("Thêm đơn thành công")
                        setdon([])
                    })
                    .catch(error => {
                        console.error('Lỗi khi gửi dữ liệu:', error);
                    });
                    
                }}><strong>Thêm Đơn</strong></button> : null}
            </div>

            <table>
                <tr style={{ border: "1px solid #7AB730", textAlign: "center", color: "white" }}>
                    <td style={{ backgroundColor: "#7AB730" }}>STT</td>
                    <td style={{ color: "#7AB730" }}>Bàn</td>
                    <td style={{ backgroundColor: "#7AB730" }}> Thông tin bàn ăn</td>
                    <td style={{ color: "#7AB730" }}>Số lượng người</td>
                    <td style={{ backgroundColor: "#7AB730" }}>Thao tác</td>
                </tr>
                {
                    don?.map((data, index) => {
                        return <tr style={{ textAlign: "center", borderBottom: "2px solid rgb(42, 66, 12)", paddingBottom: "20px" }}>
                            <td style={{ borderRight: "1px solid #7AB730", borderLeft: "1px solid #7AB730" }}>{index + 1}</td>
                            <td style={{ borderRight: "1px solid #7AB730" }}>{
                                data?.ban?.map(data => {
                                    return <div>
                                        <p>STT: {data.stt} - Sảnh : {data.sanh}</p>
                                    </div>
                                })
                            }
                                <button onClick={() => {
                                    setopenchonban(true)
                                }} style={{ color: "white", backgroundColor: "#7AB730", border: "0px", padding: "10px" }}>Chọn Thêm Bàn</button>
                            </td>
                            <td style={{ borderRight: "1px solid #7AB730" }}>
                                <div>
                                    <strong><p style={{ textAlign: "center", color: "#7AB730", marginTop: "5%" }}>Thông tin bàn ăn</p></strong>
                                    <hr></hr>
                                    <button style={{ color: "white", backgroundColor: "#7AB730", border: "0px", padding: "10px" }} onClick={() => {
                                        indexcho.current = index;
                                        setopenmonan(true)
                                    }}><strong style={{ color: "white", backgroundColor: "#7AB730" }}>Thêm món ăn</strong></button>
                                    <div>
                                        {
                                            data?.dsma?.map((d, i) => {
                                                return <>
                                                    <div className="row">
                                                        <div className="col-lg-7 col-md-7">
                                                            <strong> <p style={{ textAlign: "start", marginLeft: "30px" }}>{d.ten}</p></strong>
                                                        </div>
                                                        <div className="col-lg-3 col-md-3">
                                                            <span onClick={() => {
                                                                if (don[index].dsma[i].soLuong - 1 <= 0) {
                                                                    let t = [...don]
                                                                    t[index].dsma.pop(i)
                                                                    setdon(t)
                                                                }
                                                            }} style={{ fontSize: "20px", paddingRight: "15px", cursor: "pointer" }}>-</span><span>{d.soLuong}</span><span onClick={() => {
                                                                if (don[index].dsma[i].soLuong - 1 <= 0) {
                                                                    let t = [...don]
                                                                    t[index].dsma[i].soLuong++;
                                                                    setdon(t)
                                                                }
                                                            }} style={{ fontSize: "20px", paddingLeft: "15px", cursor: "pointer" }} >+</span>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="row" style={{width:"90%",marginLeft:"5%"}}> <input onChange={(event)=>{
                                                        let t = [...don]
                                                        t[index].dsma[i].ghiChu=event.target.value;
                                                        setdon(t)
                                                    }} placeholder="Ghi chú món ăn" type="text"></input> </div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>

                                <div>
                                    <hr></hr>
                                    <button style={{ color: "white", backgroundColor: "#7AB730", border: "0px", padding: "10px" }}
                                        onClick={() => {
                                            indexcho.current = index;
                                            setopenthucuong(true)
                                        }}>Thêm thức uống</button>
                                    <div>
                                        {
                                            data?.dstu?.map((d, i) => {
                                                return <>
                                                    <div className="row">
                                                        <div className="col-lg-7">
                                                            <strong><p style={{ textAlign: "start", marginLeft: "30px" }}>{d.ten}</p></strong>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <span onClick={() => {
                                                                if (don[index].dstu[i].soLuong - 1 <= 0) {
                                                                    let t = [...don]
                                                                    t[index].dstu.pop(i)
                                                                    setdon(t)
                                                                }
                                                            }} style={{ fontSize: "20px", paddingRight: "15px", cursor: "pointer" }}>-</span><span>{d.soLuong}</span><span onClick={() => {
                                                                if (don[index].dstu[i].soLuong - 1 <= 0) {
                                                                    let t = [...don]
                                                                    t[index].dstu[i].soLuong++;
                                                                    setdon(t)
                                                                }
                                                            }} style={{ fontSize: "20px", paddingLeft: "15px", cursor: "pointer" }}>+</span>
                                                        </div>
                                                    </div>
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                                <div>
                                    <hr></hr>
                                    <button style={{ color: "white", backgroundColor: "#7AB730", border: "0px", padding: "10px" }} onClick={() => {
                                        indexcho.current = index;
                                        setopencombo(true)
                                        console.log(don)
                                    }}>Thêm ComBo</button>
                                    <div>
                                        {
                                            data?.dscb?.map((d, i) => {
                                                return <>
                                                    <div className="row">
                                                        <div className="col-lg-7">
                                                            <strong><p style={{ textAlign: "start", marginLeft: "30px" }}>{d.ten}</p></strong>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <strong>
                                                                <span style={{ fontSize: "20px", paddingRight: "15px", cursor: "pointer" }} onClick={() => {
                                                                    if (don[index].dscb[i].soLuong - 1 <= 0) {
                                                                        let t = [...don]
                                                                        t[index].dscb.pop(i)
                                                                        setdon(t)
                                                                    }
                                                                }}>-</span>
                                                            </strong>
                                                            <span>{d.soLuong}</span><span style={{ fontSize: "20px", paddingLeft: "15px", cursor: "pointer" }} onClick={() => {
                                                                if (don[index].dscb[i].soLuong - 1 <= 0) {
                                                                    let t = [...don]
                                                                    t[index].dsma.pop(i)
                                                                    setdon(t)
                                                                }
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
                                <input
                                    style={{
                                        padding: "10px",
                                        border: "1px solid #7AB730",
                                        backgroundColor: "transparent",
                                        color: "#7AB730",
                                        outline: "none"
                                    }}
                                    type="number"
                                    onChange={(event) => {
                                        let t = [...don];
                                        t[index].soLuongNguoi = event.target.value;
                                        setdon(t);
                                    }}
                                    defaultValue={don.soLuongNguoi}
                                    onFocus={(e) => e.target.style.border = "1px solid #7AB730"} // Đảm bảo viền khi focus
                                    onBlur={(e) => e.target.style.border = "1px solid #7AB730"} // Khi bỏ focus, vẫn giữ màu viền #7AB730
                                />

                            </td>
                            <td style={{ borderRight: "1px solid #7AB730" }}>
                                <button style={{ color: "white", backgroundColor: "#7AB730", border: "0px", padding: "10px" }} onClick={() => {
                                    let t = [...don]
                                    t.pop(index)
                                    setdon(t)

                                }}>Xóa</button>
                            </td>
                        </tr>
                    })
                }
            </table>
            {
                openmonan ? <PVMA setopen={setopenmonan} index={indexcho.current} ds={don} setds={setdon}></PVMA> : null
            }
            {
                openthucuong ? <PVTU setopen={setopenthucuong} index={indexcho.current} ds={don} setds={setdon}></PVTU> : null
            }
            {
                opencombo ? <PVCB setopen={setopencombo} index={indexcho.current} ds={don} setds={setdon}></PVCB> : null
            }
            {
                openchonban ? <CB setopen={setopenchonban} index={indexcho.current} ds={don} setds={setdon}></CB> : null
            }

        </div>
    </>
}
export default ThemDon;