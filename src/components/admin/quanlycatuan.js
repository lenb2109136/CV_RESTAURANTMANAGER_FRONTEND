import axios from "axios";
import { useEffect, useRef, useState } from "react";
import PhanTheoTuan from "./phantheotuan";
import ChonHangLoat from "./chonhangloat"
import { FormControl, InputLabel, Select, MenuItem, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Button } from "bootstrap";
function isFutureTime(timeString, dateString) {
    const [hour, minute, second] = timeString.split(":").map(Number);
    const [day, month, year] = dateString.split("-").map(Number);

    const targetTime = new Date(year, month - 1, day, hour, minute, second);
    const now = new Date();

    return now < targetTime;
}

function findIndexByDate(array, dateString) {
    if (!dateString) {
        console.error("dateString không hợp lệ!");
        return -1;
    }
    const [day, month, year] = dateString.split('-');
    const formattedDate = `${year}-${month}-${day}`;

    return array.findIndex(item => item.ngayLam === formattedDate);
}
function convertToYYYYMMDD(dateStr) {
    let [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
}

function getMondayOfCurrentWeek() {
    let today = new Date();
    let day = today.getDay();
    let diff = day === 0 ? -6 : 1 - day;
    let monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday;
}

function getMondayOfWeek(weekOffset = 0) {
    let today = new Date();
    let day = today.getDay();
    let diff = day === 0 ? -6 : 1 - day;

    let monday = new Date(today);
    monday.setDate(today.getDate() + diff + weekOffset * 7);
    return monday;
}

function addDays(date, daysToAdd) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
}

function formatDate(date) {
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function PhanCaLam(prop) {
    const [thongtinnn, setthongtinn] = useState([])
    const chinh = useRef(true)
    const [opeen, setopen] = useState(false)
    const chucVu = useRef(1)
    const [pppp, setpppp] = useState(false)
    const [dsnvv, setdsnvv] = useState([])
    const [dsrende, setdsrender] = useState([])
    const [ppp, setppp] = useState(false)
    const [idnv, setidnv] = useState(0)
    const [chucvu, setChucVu] = useState([]);
    const [thuhai, setthuhai] = useState(getMondayOfCurrentWeek());
    const [dsnv, setdsnv] = useState([])
    const [dscangay, setdscangay] = useState([])
    const h = useRef({
        ngay: null,
        idca: null,
        idcv: null
    })

    const [dsc, setdsc] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8080/ca/getall")
            .then((data) => {
                setdsc(data.data.data)
            })
        axios.get(`http://localhost:8080/nhanvien/tieuchi?name=&id=1`)
            .then((data) => {
                setdsnv(data.data.data.data)
            });
    }, [])

    const [selectedChucVu, setSelectedChucVu] = useState("");
    const [ds, setds] = useState([
        { thu: 0, tenThu: "Thứ 2", ngay: null, dsca: [] },
        { thu: 1, tenThu: "Thứ 3", ngay: null, dsca: [] },
        { thu: 2, tenThu: "Thứ 4", ngay: null, dsca: [] },
        { thu: 3, tenThu: "Thứ 5", ngay: null, dsca: [] },
        { thu: 4, tenThu: "Thứ 6", ngay: null, dsca: [] },
        { thu: 5, tenThu: "Thứ 7", ngay: null, dsca: [] },
        { thu: 6, tenThu: "Chủ nhật", ngay: null, dsca: [] }
    ]);

    const [dsca, setdsca] = useState([]);
    const [hientai, sethientai] = useState(0);
    const tennhanvien = useRef()





    useEffect(() => {
        setthuhai(getMondayOfWeek(hientai));
    }, [hientai]);

    useEffect(() => {
        setthuhai(getMondayOfCurrentWeek());
    }, []);

    useEffect(() => {
        let u = [...ds];
        const requests = u.map((item, i) => {
            const ngay = formatDate(addDays(thuhai, i));
            return axios.get(`http://localhost:8080/tglc/getcangay?nl=${ngay}`)
                .then(response => {
                    item.ngay = ngay;
                    item.dsca = response.data.data;
                });
        });
        Promise.all(requests).then(() => {
            setds([...u]);
            console.log(u);
        });

    }, [thuhai]);



    const tuan = useRef(true);

    const handleChucVuChange = (event) => {
        setSelectedChucVu(event.target.value);
    };

    const weeklyDates = Array.from({ length: 7 }, (_, index) => formatDate(addDays(thuhai, index)));

    return (
        <div className="row">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex" }}>
                    <img onClick={() => sethientai(hientai - 1)} style={{ height: "30px", width: "30px", cursor: "pointer" }} src="https://cdn-icons-png.flaticon.com/128/130/130882.png"></img>
                    <strong><p>{formatDate(thuhai)}</p></strong>
                </div>
                <div style={{ display: "flex" }}>
                    <strong><p>{formatDate(addDays(thuhai, 6))}</p></strong>
                    <img onClick={() => sethientai(hientai + 1)} style={{ height: "30px", width: "30px", cursor: "pointer" }} src="https://cdn-icons-png.flaticon.com/128/130/130884.png"></img>
                </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }}>
                <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }}>
                    {
                        weeklyDates.map((date, index) => (
                            <th style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} key={index}>{date}</th>
                        ))
                    }
                </tr>
                <tr>

                    {
                        ds.map((data, index) => {
                            return <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }}>
                                {data.dsca.map(data => {
                                    return <div>
                                        <strong><p style={{backgroundColor:"#3A2924",color:"white"}}>{data.ca.thoiGianBatDau} - {data.ca.thoiGianKetThuc} </p></strong>
                                        {
                                            data.thontin?.map(d => {
                                                return <p style={{ cursor: "pointer" }} onClick={() => {

                                                    chinh.current = isFutureTime(data.ca.thoiGianBatDau, ds[index].ngay)
                                                    h.current.idca = data.ca.id;
                                                    h.current.idcv = d.CV_ID;
                                                    h.current.ngay = ds[index].ngay;
                                                    setopen(true)
                                                    axios.get(`http://localhost:8080/tglc/getnhanvien?idca=${data.ca.id}&idcv=${d.CV_ID}&nl=${ds[index].ngay}`)
                                                        .then(data => {
                                                            setthongtinn(data.data.data)
                                                        })
                                                }}>{d.CV_TEN}-{d.tong}</p>
                                            })
                                        }
                                    </div>
                                })}
                            </td>
                        })
                    }
                </tr>


            </table>
            {
                opeen ? <div
                    style={{
                        border: "2px solid black",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: "500px",
                        borderRadius: "10px"
                    }}
                >
                    <strong><h5 style={{ textAlign: "center", marginTop: "10px" }}>Thông tin ca làm</h5></strong>
                    <hr></hr>
                    <div>
                        <strong><p style={{ textAlign: "center" }}>Nhân viên đang làm: </p></strong>
                        <table style={{ marginLeft: "30%" }}>
                            {thongtinnn.in?.map((data, index) => (

                                <tr>
                                    <td><p style={{ textAlign: "start" }} key={data.NV_TEN}>{data.NV_TEN} </p></td>
                                   {
                                    chinh.current ? <td><button onClick={() => {
                                        axios.get(`http://localhost:8080/tglc/catcalam?idca=${h.current.idca}&idnv=${data.NV_ID}&nl=${h.current.ngay}`)
                                            .then(data => {
                                                if (data.data.status == "OK") {
                                                    alert("Cắt Ca nhân viên thành công")
                                                    let t = { ...thongtinnn }
                                                    t.notin.push(thongtinnn.in[index])
                                                    t.in.pop(index)
                                                    setthongtinn(t);
                                                    let u = [...ds];
                                                    const requests = u.map((item, i) => {
                                                        const ngay = formatDate(addDays(thuhai, i));
                                                        return axios.get(`http://localhost:8080/tglc/getcangay?nl=${ngay}`)
                                                            .then(response => {
                                                                item.ngay = ngay;
                                                                item.dsca = response.data.data;
                                                            });
                                                    });
                                                    Promise.all(requests).then(() => {
                                                        setds([...u]);
                                                        console.log(u);
                                                    });
                                                }
                                            })
                                    }} style={{ textAlign: "end", backgroundColor: "white", borderRadius: "10px", marginBottom: "15px",marginLeft:"10px" }}>Cắt ca làm</button></td>:null
                                   }
                                </tr>
                            ))}
                        </table>

                    </div>
                    <hr></hr>
                    <div>
                        <strong><p style={{ textAlign: "center" }}>Nhân viên có thể phân:</p></strong>
                        <table style={{ marginLeft: "30%" }}>
                            {thongtinnn.notin?.map((data, index) => (

                                <tr>
                                    <td><p style={{ textAlign: "start" }} key={data.NV_TEN}>{data.NV_TEN} </p></td>
                                    {chinh.current ? <td><button onClick={() => {
                                        axios.get(`http://localhost:8080/tglc/phanthemcalam?idca=${h.current.idca}&idnv=${data.NV_ID}&nl=${h.current.ngay}`)
                                            .then(data => {
                                                if (data.data.status == "OK") {
                                                    alert("Cắt Ca nhân viên thành công")

                                                    let t = { ...thongtinnn }
                                                    t.in.push(thongtinnn.notin[index])
                                                    t.notin.pop(index)
                                                    setthongtinn(t);
                                                    let u = [...ds];
                                                    const requests = u.map((item, i) => {
                                                        const ngay = formatDate(addDays(thuhai, i));
                                                        return axios.get(`http://localhost:8080/tglc/getcangay?nl=${ngay}`)
                                                            .then(response => {
                                                                item.ngay = ngay;
                                                                item.dsca = response.data.data;
                                                            });
                                                    });
                                                    Promise.all(requests).then(() => {
                                                        setds([...u]);
                                                        console.log(u);
                                                    });
                                                }
                                            })
                                    }} style={{ textAlign: "end", backgroundColor: "white", borderRadius: "10px", marginBottom: "15px",marginLeft:"10px" }}>Thêm ca làm</button>
                                     <hr></hr></td> : null}
                                </tr>
                               
                            ))}
                        </table>
                    </div>
                    <hr></hr>
                    <p style={{ textAlign: "center" }}><button style={{ color: "white", backgroundColor: "#1C0F0A", width: "100px", borderRadius: "5px" }}
                        onClick={() => {
                            setopen(false)
                        }}
                    >Đóng</button></p>
                </div>

                    : null
            }
        </div>
    )
}

export default PhanCaLam;
