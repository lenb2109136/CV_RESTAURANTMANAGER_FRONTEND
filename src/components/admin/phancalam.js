import axios from "axios";
import { useEffect, useRef, useState } from "react";
import PhanTheoTuan from "./phantheotuan";
import ChonHangLoat from "./chonhangloat"
import { FormControl, InputLabel, Select, MenuItem, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

function findIndexByDate(array, dateString) {
    if (!dateString) {
        console.error("dateString không hợp lệ!");
        return -1;
    }
    const [day, month, year] = dateString.split('-');
    const formattedDate = `${year}-${month}-${day}`;

    return array.findIndex(item => item.ngayLam === formattedDate);
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
    const chucVu=useRef(1)
    const [pppp,setpppp]=useState(false)
    const [dsnvv,setdsnvv]= useState([])
    const [dsrende,setdsrender]=useState([])
    const [ppp,setppp] =useState(false)
    const [idnv,setidnv]=useState(0)
    const [chucvu, setChucVu] = useState([]);
    
    const [thuhai, setthuhai] = useState(getMondayOfCurrentWeek());
    const [dsnv, setdsnv] = useState([])
    useEffect(() => {
        let letds = [];
        let promises = [];
        console.log("đã đi vào đây")
        dsnv.map((data, index) => {
            letds.push({
                id: data.id,
                ten: data.ten,
                dsca: null
            });
            const promise = axios.post(`http://localhost:8080/nhanvien/g?id=${data.id}&ngaybd=${formatDate(thuhai)}&ngaykt=${formatDate(addDays(thuhai,6))}`)
                .then((res) => {
                    letds[index].dsca = res.data.data;
                })
                .catch((error) => {
                    console.error("Lỗi khi gọi API:", error);
                });
    
            promises.push(promise);
        });
        Promise.all(promises).then(() => {
            setdsrender(letds);
            console.log("danh sách" + JSON.stringify(letds));
        });
    }, [dsnv,thuhai]);
    
    
    const [dsc,setdsc]=useState([])
    useEffect(()=>{
        axios.get("http://localhost:8080/ca/getall")
        .then((data)=>{
            setdsc(data.data.data)
        })
        axios.get(`http://localhost:8080/nhanvien/tieuchi?name=&id=1`)
                                    .then((data) => {
                                        setdsnv(data.data.data.data)
                                    });
        
    },[])
    const [selectedChucVu, setSelectedChucVu] = useState(""); // Lưu chức vụ đã chọn
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
    const tennhanvien=useRef()

    useEffect(() => {
        axios.get("http://localhost:8080/bophan/getds")
            .then((data) => {
                setChucVu(data.data.data);
            });
    }, []);

    useEffect(() => {
        let f = new FormData();
        f.append("id", idnv);
        f.append("ngaybd", formatDate(thuhai));
        f.append("ngaykt", formatDate(addDays(thuhai, 6)));
        axios.post("http://localhost:8080/nhanvien/getttca", f)
            .then((data) => {
                setdsca(data.data.data);
            });
    }, [thuhai,idnv]);

    useEffect(() => {
        setthuhai(getMondayOfWeek(hientai));
    }, [hientai]);

    useEffect(() => {
        setthuhai(getMondayOfCurrentWeek());
    }, []);

    useEffect(() => {
        let u = [...ds];
        for (let i = 0; i < u.length; i++) {
            u[i].ngay = formatDate(addDays(thuhai, i));
        }
        setds(u);
    }, [thuhai]);

    const tuan = useRef(true);

    const handleChucVuChange = (event) => {
        setSelectedChucVu(event.target.value);
    };

    return (
        <div className="row">
            <div style={{ display: "flex", justifyContent: "space-between",marginBottom:"20px" }}>
           
                <div style={{display:"flex"}}>
                    <img onClick={() => sethientai(hientai - 1)} style={{height:"30px",width:"30px",cursor:"pointer"}} src="https://cdn-icons-png.flaticon.com/128/130/130882.png"></img>
                    <strong><p>{formatDate(thuhai)}</p></strong>
                </div>
                <div style={{display:"flex"}}>
                <strong><p>{formatDate(addDays(thuhai,6))}</p></strong>
                    <img onClick={() => sethientai(hientai + 1)} style={{height:"30px",width:"30px",cursor:"pointer"}} src="https://cdn-icons-png.flaticon.com/128/130/130884.png"></img>
                </div>
            </div>

            <div>
                <FormControl fullWidth>
                    <InputLabel>Chức vụ</InputLabel>
                    <Select
                        value={selectedChucVu}
                        onChange={handleChucVuChange}
                        label="Chức vụ"
                        sx={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#dcdcdc",
                                },
                            },
                        }}
                    >
                        {chucvu.map((data) => (
                            <MenuItem onClick={() => {
                                chucVu.current=data.id;
                                axios.get(`http://localhost:8080/nhanvien/tieuchi?name=&id=${data.id}`)
                                    .then((data) => {
                                        setdsnv(data.data.data.data)
                                        
                                    });

                            }} key={data.id} value={data.id}>
                                {data.ten}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Paper sx={{ marginTop: "30px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#1C0F0A" }}>
                                <TableCell style={{ color: "white" }}>STT</TableCell>
                                <TableCell style={{ color: "white" }}>Tên nhân viên</TableCell>
                               
                                {
    dsc
        .sort((a, b) => a.thoiGianBatDau.localeCompare(b.thoiGianBatDau))
        .map((d) => {
            return (
                <TableCell style={{ color: "white" }}>
                    {d.thoiGianBatDau} - {d.thoiGianKetThuc}
                </TableCell>
            );
        })
}

                            </TableRow>
                        </TableHead>
                        <TableBody>
    {dsnv.map((nv, index) => {
        const dataMap = new Map(
            (dsrende[index]?.dsca || []).map((item) => [item.CA_THOIGIANBATDAU, item])
        );

        const completedData = dsc.map((ca) => 
            dataMap.get(ca.thoiGianBatDau) || { CA_THOIGIANBATDAU: ca.thoiGianBatDau, tong: 0 }
        );

        const sortedData = completedData.sort((a, b) => 
            a.CA_THOIGIANBATDAU.localeCompare(b.CA_THOIGIANBATDAU)
        );

        return (
            <TableRow 
                onClick={() => {
                    tennhanvien.current=nv.ten;
                    setidnv(nv.id);
                    setppp(true);
                }} 
                style={{ cursor: "pointer" }} 
                key={nv.id}
            >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{nv.ten}</TableCell>

                {sortedData.map((d, i) => (
                    <TableCell key={i}>{d.tong}</TableCell>
                ))}
            </TableRow>
        );
    })}
</TableBody>


                    </Table>
                </Paper>
            </div>

            {ppp ? <PhanTheoTuan
            chucVu={chucVu.current}
            tennhanvien={tennhanvien.current}
            setpppp={setpppp}
            pppp={pppp}
            setppp={setppp}
                    thuhai={thuhai}
                    formatDate={formatDate}
                    setds={setds}
                    addDays={addDays}
                    id={idnv}
                    dsnvv={dsnvv}
                     setdsnvv={setdsnvv}
                    findIndexByDate={findIndexByDate}
                    dsca={dsca}
                    setdsca={setdsca}
                    ds={ds}
                /> :null}
                </div>
    );
}

export default PhanCaLam;
