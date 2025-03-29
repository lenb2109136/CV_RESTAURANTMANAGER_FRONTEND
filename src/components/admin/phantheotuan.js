import { Checkbox } from "@mui/material"
import axios from "axios"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import ChonHangLoat from "./chonhangloat"
import Button from "@mui/material/Button";
function isDateRangeCovered(startDate, endDate, schedule) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const availableDates = new Set(schedule.map(item => item.ngayLam));
    
    let currentDate = new Date(start);
    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0]; 
        if (!availableDates.has(dateStr)) {
            return false; 
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return true; 
}


function isBeforeOrEqual(targetDateStr) {

    if (!targetDateStr) {
        console.error("Lỗi: targetDateStr là null hoặc undefined");
        return false;
    }

    const [day, month, year] = targetDateStr.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    return currentDate < targetDate;
}
function filterExcludedItems(mangLon, mangNho) {
    const danhSachCaid = new Set(mangNho.map(item => item.caid));
    return mangLon
        .filter(item => !danhSachCaid.has(item.id))
        .map(item => ({ ...item }));
}
function convertDateFormat(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
}
const updateArrayById = (id, dsc) => {
    const index = dsc.findIndex(item => item.caid === id);

    if (index !== -1) {
        dsc.splice(index, 1);
    } else {
        dsc.push({
            caid: id,
            thoigianbatdau: null,
            thoigianketthuc: null
        });
    }

    return dsc;
};

export default function PhanTheoTuan(prop) {
    const [idduochon,setidduochon]=useState()
    const soluong=useRef(0)
    useEffect(()=>{
        axios.get(`http://localhost:8080/nhanvien/getnhanvinbychucv?bpid=${prop.chucVu}`)
            .then((data) => {
                soluong.current=data.data.data.length
            })
            .catch(error => console.error("Lỗi khi fetch nhân viên:", error));
            
    },[])
    useEffect(() => {
        let f = new FormData();
        setpp(false)
        f.append("id", prop.id)
        f.append("ngaybd", prop.formatDate(prop.thuhai))
        f.append("ngaykt", prop.formatDate(prop.addDays(prop.thuhai, 6)))
        axios.post("http://localhost:8080/nhanvien/getttca", f)
            .then((data) => {
                prop.setdsca(data.data.data)
            })
    }, [])
    const [pp, setpp] = useState(false)
    const d = useRef({
        "ngayLam": null,
        "dsca": [

        ]
    })
    const [dsc, setdsc] = useState([])

    useEffect(() => {
        gsap.from(".e", {
            y: "30px",
            duration: 1.5,
            stagger: 0.2
        });
    }, []);

    return <>
        <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: "20px 20px 5px rgba(0, 0, 0, 0.1)",
            zIndex: 2,
            padding: "20px",
            width: "90%",
            border: "1px solid black",
            borderRadius: "10px",
            paddingBottom: "20px",

        }}>
            {prop.pppp ? <ChonHangLoat dsnvv={prop.dsnvv} setdsnvv={prop.setdsnvv} setpppp={prop.setpppp}></ChonHangLoat> : null}

            <img onClick={() => {
                axios.get(`http://localhost:8080/nhanvien/gettudong?id=${prop.id}`)
                    .then((data) => {
                        if (data.data.data == 0 || data.data.data == null) {
                            var t = window.confirm("Bạn có muốn tự động phân ca cho " + prop.tennhanvien + " trong tuần tới không")
                            if (t == true) {
                                axios.get(`http://localhost:8080/nhanvien/tudong?id=${prop.id}`);
                            }
                        }
                    })
                prop.setppp(false)
            }} style={{ width: "20px", height: "20px", cursor: "pointer" }} src="https://cdn-icons-png.flaticon.com/128/1632/1632708.png"></img>
            <strong><p style={{ textAlign: "center" }}>Thông tin ca làm trong tuần - nhân viên: </p></strong>
            <div className="w-100">
                {
                    pp ? <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            padding: "20px",
                            background: "#fff",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "10px",
                            zIndex: 2
                        }}
                    >
                        <strong><p style={{ textAlign: "center", color: "#396ce8" }}>Chọn ca làm</p></strong>

                        {
                            dsc.map((data) => {
                                return <div style={{ display: "flex" }}>
                                    <p style={{ marginTop: "10px" }}>{data.thoiGianBatDau} - {data.thoiGianKetThuc}</p>
                                    <Checkbox onClick={() => {
                                        d.current.dsca = updateArrayById(data.id, d.current.dsca)
                                    }} style={{ marginBottom: "20px" }}></Checkbox>
                                </div>
                            })
                        }
                        <button style={{ backgroundColor: "#396ce8", color: "white", border: "1px solid white", borderRadius: "10px" }} onClick={() => {
                            d.current.idnv = prop.id;
                            d.current.ngayLam = convertDateFormat(d.current.ngayLam)
                            axios.post("http://localhost:8080/nhanvien/phanca", d.current)
                                .then((data) => {
                                    if (data.data.status != "OK") {
                                        alert(data.data.message);
                                    }
                                    else {
                                        alert("Cập nhật ca thành công")

                                        d.current = {
                                            "ngayLam": null,
                                            "dsca": [

                                            ]
                                        }
                                        let f = new FormData();
                                        setpp(false)
                                        f.append("id", prop.id)
                                        f.append("ngaybd", prop.formatDate(prop.thuhai))
                                        f.append("ngaykt", prop.formatDate(prop.addDays(prop.thuhai, 6)))
                                        axios.post("http://localhost:8080/nhanvien/getttca", f)
                                            .then((data) => {
                                                prop.setdsca(data.data.data)
                                            })

                                    }
                                })

                        }}>Cập nhật</button>
                        <button style={{ backgroundColor: "#aabef0", color: "white", border: "1px solid white", borderRadius: "7px", marginLeft: "35px" }} onClick={() => { setpp(false) }}>Đóng</button>
                    </div> : null
                }

                <table className="w-100 mt-2"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #1C0F0A"
                    }}
                >
                    <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }}>
                        {prop.ds.map((item, index) => (
                            <td
                                key={index}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #1C0F0A",
                                    textAlign: "center"
                                }}
                            >
                                {item.tenThu} - {item.ngay}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {prop.ds.map((data, index) => {
                            if (prop.findIndexByDate(prop.dsca, data.ngay) !== -1) {
                                return (
                                    <td
                                        key={index}
                                        style={{
                                            padding: "10px",
                                            border: "1px solid #1C0F0A",
                                            position: "relative",
                                            pointerEvents: isBeforeOrEqual(data.ngay) ? "auto" : "none"
                                        }}
                                    >
                                        <div className="tren">
                                            {prop.dsca[prop.findIndexByDate(prop.dsca, data.ngay)].dsca.map((d, idx) => (
                                                <div onClick={(event) => {
                                                    let t = window.confirm("Bạn có muốn xóa ca này không ???")
                                                    if (t == true) {
                                                        let form = new FormData();
                                                        form.append("ngay", prop.dsca[prop.findIndexByDate(prop.dsca, data.ngay)].ngayLam)
                                                        form.append("idnv", prop.id)
                                                        form.append("idca", d.caid)
                                                        axios.post("http://localhost:8080/nhanvien/xoaca", form)
                                                            .then((dd) => {
                                                                if (dd.data.status === "OK") {
                                                                    alert("Đã xóa ca cho nhân viên")
                                                                    event.target.remove();
                                                                }
                                                                else {
                                                                    alert(dd.data.message)
                                                                }
                                                            })
                                                    }
                                                }} key={idx} style={{ backgroundColor: "#396ce8", color: "white", borderRadius: "10px", cursor: "pointer" }}>
                                                    <strong>
                                                        <p style={{ textAlign: "center" }}>{d.thoigianbatdau} - {d.thoigianketthuc}</p>
                                                    </strong>
                                                </div>
                                            ))}
                                        </div>
                                        <img
                                            onClick={() => {
                                                d.current.ngayLam = data.ngay;
                                                axios.get("http://localhost:8080/ca/getall").then((data) => {
                                                    if (prop.findIndexByDate(prop.dsca, d.current.ngayLam) === -1) {
                                                        setdsc(data.data.data)
                                                        setpp(true)
                                                    } else {
                                                        setdsc(filterExcludedItems(data.data.data, prop.dsca[prop.findIndexByDate(prop.dsca, d.current.ngayLam)].dsca))
                                                        setpp(true)
                                                    }
                                                })
                                            }}
                                            style={{
                                                width: "25px",
                                                height: "25px",
                                                position: "absolute",
                                                cursor: "pointer",
                                                bottom: "0px"
                                            }}
                                            src="https://cdn-icons-png.flaticon.com/128/8191/8191558.png"
                                        />
                                    </td>
                                );
                            } else {
                                return (
                                    <td
                                        key={index}
                                        style={{
                                            padding: "10px",
                                            border: "1px solid #1C0F0A",
                                            position: "relative",
                                            pointerEvents: isBeforeOrEqual(data.ngay) ? "auto" : "none"
                                        }}
                                    >

                                        <div className="tren">
                                            <strong><p style={{ textAlign: "center", color: "red" }}>Không có ca làm</p></strong>
                                        </div>
                                        <img
                                            onClick={() => {
                                                d.current.ngayLam = data.ngay;
                                                axios.get("http://localhost:8080/ca/getall").then((data) => {
                                                    if (prop.findIndexByDate(prop.dsca, d.current.ngayLam) === -1) {
                                                        setdsc(data.data.data)
                                                        setpp(true)
                                                    }
                                                })
                                            }}
                                            style={{
                                                width: "25px",
                                                height: "25px",
                                                position: "absolute",
                                                cursor: "pointer",
                                                bottom: "0px"
                                            }}
                                            src="https://cdn-icons-png.flaticon.com/128/8191/8191558.png"
                                        />
                                    </td>
                                );
                            }
                        })}
                    </tr>
                </table>

                <div>
                    <div style={{ display: "flex" }}>
                        <Button
                            variant="contained"
                            style={{ marginTop: "20px" }}
                            sx={{
                                backgroundColor: "#1C0F0A",
                                "&:hover": { backgroundColor: "#331C18" },
                            }}
                            onClick={() => { prop.setpppp(true) }}
                        >
                            Cập nhật hàng loạt
                        </Button>
                        <Button
                            variant="contained"
                            style={{ marginTop: "20px", marginLeft: "30px" }}
                            sx={{
                                backgroundColor: "#1C0F0A",
                                "&:hover": { backgroundColor: "#331C18" },
                            }}
                            onClick={() => {

                                let g = new FormData();
                                
                                g.append("dsnv", JSON.stringify(prop.dsnvv))
                                g.append("ketthuc", prop.formatDate(prop.addDays(prop.thuhai, 6)))
                                g.append("batdau", prop.formatDate(prop.thuhai))
                                g.append("id", prop.id)
                                axios.post("http://localhost:8080/nhanvien/themcahangloattheoca", g)
                                    .then((data) => {
                                        if (data.data.status === "OK") {
                                            alert("Cập nhật ca cho các nhân viên thành công")
                                        }
                                        else {
                                            alert("Cập nhật thông tin thành công")
                                        }
                                    })
                            }}
                        >
                            Xác nhận cập nhật hàng loạt
                        </Button>
                        <strong><p style={{ marginTop: "40px", marginRight: "10px",marginLeft:"10px"}}>Số lương nhân viên: {prop.dsnvv.length} / {soluong.current} </p></strong>
                        <Button
                        variant="contained"
                        style={{marginTop:"20px"}}
                        sx={{
                            backgroundColor: "#1C0F0A",
                            "&:hover": { backgroundColor: "#331C18" },
                        }}
                        onClick={()=>{
                           
                            let g = new FormData();
                            let tt=[...prop.dsnvv]
                            tt.push(prop.id);
                            g.append("dsnv", JSON.stringify(tt))
                            g.append("ketthuc", prop.formatDate(prop.addDays(prop.thuhai, 6)))
                            g.append("batdau", prop.formatDate(prop.thuhai))
                            g.append("id", prop.id)
                            axios.post("http://localhost:8080/nhanvien/daoca", g)
                                .then((data) => {
                                    if (data.data.status === "OK") {
                                        alert("Đảo ca cho các nhân viên thành công")
                                    }
                                    else {
                                        alert("Cập nhật thông tin thành công")
                                    }
                                })
                        }}
                    >
                        Đảo ca
                    </Button>
                    </div>
                </div>
            </div>

        </div>
    </>

}
