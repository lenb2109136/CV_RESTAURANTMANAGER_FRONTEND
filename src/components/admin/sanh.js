import React, { useEffect, useState } from "react";
import axios from "axios";
import { Rnd } from "react-rnd";
import { FormControl, Select, MenuItem, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";

export default function TableLayout() {
    const [dsban, setDsban] = useState([]);
    const [sanhcho, setSanhcho] = useState(1);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [sanhchon, setSanhchon] = useState("");
    const [dssanh, setDssanh] = useState([]);
    const [selectedBan, setSelectedBan] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [newBan, setNewBan] = useState({ stt: null, toaDoX: 0, toaDoY: 0, trong: true, sucChua: 18 });
    useEffect(() => {
        axios.get("http://localhost:8080/sanh/all").then((res) => {
            setDssanh(res.data.data);
            if (res.data.data.length > 0) {
                setSanhchon(res.data.data[0].id);
                fetchTables(res.data.data[0].id);
            }
        });
        const container = document.getElementById("parent-container");
        if (container) {
            setContainerSize({ width: container.clientWidth, height: container.clientHeight });
        }
    }, []);

    const fetchTables = (id) => {
        axios.get(`http://localhost:8080/sanh/getbyid?id=${id}`).then((res) => {
            setDsban(res.data.data.dsBan);
        });
    };

    const handleDrag = (index, d) => {
        setDsban((prev) => prev.map((ban, i) => i === index ? { ...ban, toaDoX: (d.x / containerSize.width) * 100, toaDoY: (d.y / containerSize.height) * 100 } : ban));
    };

    const handleUpdate = async () => {
        const updatedTables = dsban.map((ban) => ({ ...ban, toaDoX: parseFloat(ban.toaDoX.toFixed(2)), toaDoY: parseFloat(ban.toaDoY.toFixed(2)) }));
        try {
            const response = await axios.post("http://localhost:8080/ban/update", updatedTables);
            alert(response.data.data.status === "OK" ? "Cập nhật thành công!" : "Cập nhật thất bại!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("cập nhật thành công")
        }
    };

    const handleSaveSelectedBan = async () => {
        if (!selectedBan) return;
        try {
            await axios.post("http://localhost:8080/ban/updateone", [selectedBan]);
            alert("Cập nhật bàn thành công!");
            axios.get(`http://localhost:8080/sanh/getbyid?id=${sanhcho}`).then((res) => {
                setDsban(res.data.data.dsBan);
            });
            setShowInfoModal(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật bàn:", error);
            alert("Lỗi kết nối đến server!");
        }
    };

    return (
        <div style={{ height: "800px" }} className="relative w-full border bg-gray-100 overflow-hidden">
            <div style={{ display: "flex", marginTop: "20px" }}>
                <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: "50px" }}> Cập nhật </Button>
                <Button variant="contained" color="primary" onClick={() => setShowAddModal(true)} style={{ marginRight: "50px" }}> Thêm mới bàn </Button>
                <FormControl style={{ width: "150px" }}>
                    <Select value={sanhchon} onChange={(e) => { setSanhchon(e.target.value); fetchTables(e.target.value); }}>
                        {dssanh.map((s) => (<MenuItem key={s.id} onClick={() => setSanhcho(s.id)} value={s.id}>{s.ten}</MenuItem>))}
                    </Select>
                </FormControl>
            </div>
            <div id="parent-container" className="relative row" style={{ height: "800px", border: "1px solid black", marginTop: "10px", zIndex: 0 }}>
                {dsban.map((ban, index) => (
                    <Rnd bounds="parent" key={ban.stt} position={{ x: (ban.toaDoX / 100) * containerSize.width, y: (ban.toaDoY / 100) * containerSize.height }}
                        size={{ width: "5%", height: "5%" }} enableResizing={false} onDragStop={(e, d) => handleDrag(index, d)} className="absolute cursor-grab" onClick={() => { setSelectedBan(ban); setShowInfoModal(true); }}>
                        <div style={{ width: "100px", position:"relative" }} className="relative flex items-center justify-center bg-white rounded shadow-md">
                            <strong ><span style={{
                                position: "absolute", top: "40%",
                                left: "60%",
                                transform: "translate(-50%, -50%)",
                                padding:"0px",
                                height:"10px",
                                padding:"0px"
                            }} className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-white px-1 rounded"> {ban.stt}-{ban.sucChua} </span></strong>
                            <img src="http://localhost:8080/datasource/chair.png" alt="Bàn" style={{ width: "100%", marginLeft: "10px" }} className="object-contain" />
                        </div>
                    </Rnd>
                ))}
            </div>
            {showInfoModal && selectedBan && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "10px", borderRadius: "8px", border: "2px solid #007bff", textAlign: "center" }}>
                    <h4>Thông tin bàn</h4>
                    <TextField label="Sức chứa" type="number" value={selectedBan.sucChua} onChange={(e) => setSelectedBan({ ...selectedBan, sucChua: e.target.value })} fullWidth margin="dense" />
                    <FormControlLabel control={<Checkbox checked={selectedBan.trong} onChange={(e) => setSelectedBan({ ...selectedBan, trong: e.target.checked })} />} label="Trống" />
                    <p>Sảnh: {sanhchon}</p>
                    <Button variant="outlined" onClick={handleSaveSelectedBan}> Lưu </Button>
                    <Button variant="outlined" onClick={() => setShowInfoModal(false)} style={{ marginLeft: '10px' }}> Đóng </Button>
                </div>
            )}

            {showAddModal && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "10px", borderRadius: "8px", border: "2px solid #007bff", textAlign: "center" }}>
                    <h4>Thêm mới bàn</h4><TextField label="Sức chứa" type="number" value={newBan.sucChua} onChange={(e) => setNewBan({ ...newBan, sucChua: parseInt(e.target.value) })} fullWidth margin="dense" />
                    <FormControlLabel control={<Checkbox checked={newBan.trong} onChange={(e) => setNewBan({ ...newBan, trong: e.target.checked })} />} label="Trống" />
                    <Button variant="outlined" onClick={() => {
                        let f = new FormData()
                        f.append("ban", JSON.stringify([newBan]));
                        f.append("sanh", sanhcho)
                        axios.post("http://localhost:8080/sanh/save", f)
                            .then(data => {
                                alert("Thêm bàn thành công")
                                setDsban(data.data.data.dsBan)
                            })
                    }}>
                        Thêm
                    </Button>
                    <Button variant="outlined" onClick={() => setShowAddModal(false)} style={{ marginLeft: '10px' }}>
                        Đóng
                    </Button>
                </div>
            )}
        </div>
    );
}
