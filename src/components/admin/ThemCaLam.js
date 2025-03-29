import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AddCalam from "./addcalam";
function groupByShift(data) {
    const grouped = {};
    
    data.forEach(item => {
        const shiftKey = `${item.CA_THOIGIANBATDAU}-${item.CA_THOIGIANKETTHUC}`;
        if (!grouped[shiftKey]) {
            grouped[shiftKey] = {};
        }
        
        const bpTen = item.BP_TEN;
        if (!grouped[shiftKey][bpTen]) {
            grouped[shiftKey][bpTen] = [];
        }
        
        grouped[shiftKey][bpTen].push({
            CV_TEN: item.CV_TEN,
            GBP_ID: item.GBP_ID,
            GBP_GIA: item.GBP_GIA
        });
    });
    
    return Object.entries(grouped).map(([key, bpData]) => {
        const [start, end] = key.split("-");
        return {
            CA_THOIGIANBATDAU: start,
            CA_THOIGIANKETTHUC: end,
            BP_NHOM: Object.entries(bpData).map(([bpTen, cvList]) => ({
                BP_TEN: bpTen,
                CV_LIST: cvList
            }))
        };
    });
}
function ThemCaLam() {
    const [ds, setds] = useState([]);
    const capnhat = useRef({ id: 0, gia: 0 });
    const [openthem, setopenthem] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [newPrice, setNewPrice] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/ca/getdsnow")
            .then((data) => {
                setds(groupByShift(data.data.data));
            });
    }, []);
    const xulyCapNhatGia = () => {
        let f= new FormData();
        f.append("id",capnhat.current.id)
        f.append("gia",newPrice)
        axios.post("http://localhost:8080/ca/setgia",f)
        .then((data)=>{
            if(data.data.status=="OK"){
                alert("Cập nhật giá thành công")
                axios.get("http://localhost:8080/ca/getdsnow")
            .then((data) => {
                setds(groupByShift(data.data.data));
            });
            }
            else{
                alert("Cập nhật giá thất bại")
            }
        })
        .catch(()=>{alert("Có lỗi xảy ra")})
    };

    return (
        <div className="row mt-2 h-100">
            <Button
                style={{ width: "200px", height: "50px" }}
                variant="contained"
                sx={{
                    backgroundColor: "#1C0F0A",
                    "&:hover": { backgroundColor: "#331C18" },
                    cursor: "pointer"
                }}
                onClick={() => {
                    setopenthem(true);
                }}
            >
                Thêm Ca Làm
            </Button>
            {openthem ? <AddCalam setdss={setds} set={setopenthem} /> : null}
            <table className="w-100" style={{ borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }}>
                <thead>
                    <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }}>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>STT</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Thời Gian Ca Làm</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Bộ Phận</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Chức vụ</th>
                        <th style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>Đơn giá</th>
                    </tr>
                </thead>
                <tbody>
                    {ds.map((data, index) => (
                        data.BP_NHOM.map((bp, bpIndex) => (
                            bp.CV_LIST.map((cv, cvIndex) => (
                                <tr key={`${index}-${bpIndex}-${cvIndex}`}>
                                    {bpIndex === 0 && cvIndex === 0 && (
                                        <td rowSpan={6} style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>
                                            {index + 1}
                                        </td>
                                    )}
                                    {bpIndex === 0 && cvIndex === 0 && (
                                        <td style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }} rowSpan={6}>
                                            {data.CA_THOIGIANBATDAU} - {data.CA_THOIGIANKETTHUC}
                                        </td>
                                    )}
                                    {cvIndex === 0 && (
                                        <td rowSpan={bp.CV_LIST.length} style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>
                                            {bp.BP_TEN}
                                        </td>
                                    )}
                                    <td style={{ padding: "10px", border: "1px solid #1C0F0A", textAlign: "center" }}>{cv.CV_TEN}</td>
                                    <td
                                        onClick={() => {
                                            capnhat.current = { id: cv.GBP_ID, gia: cv.GBP_GIA };
                                            setNewPrice(cv.GBP_GIA); // Hiển thị giá hiện tại trong modal
                                            setOpenModal(true);
                                        }}
                                        style={{
                                            padding: "10px", border: "1px solid #1C0F0A", textAlign: "center", cursor: "pointer"
                                        }}
                                    >
                                        {cv.GBP_GIA}
                                    </td>
                                </tr>
                            ))
                        ))
                    ))}
                </tbody>
            </table>

            {/* Modal cập nhật giá */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Cập nhật giá</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Giá mới"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">
                        Đóng
                    </Button>
                    <Button onClick={xulyCapNhatGia} color="primary">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ThemCaLam;
