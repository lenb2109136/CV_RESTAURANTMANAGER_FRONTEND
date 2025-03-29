import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

// Hàm kiểm tra phần tử có trong mảng không
function timPhanTu(arr, value) {
    return Array.isArray(arr) && arr.includes(value);
}

// Hàm xóa phần tử khỏi mảng
function xoaPhanTu(arr, value) {
    return arr.filter(item => item !== value);
}

const ChucVuSelect = (prop) => {
    const [dsChucVu, setDsChucVu] = useState([]);
    const [dsBoPhan, setDsBoPhan] = useState([]);
    const [selectedChucVu, setSelectedChucVu] = useState("");
    const [selectedBoPhan, setSelectedBoPhan] = useState("");
    const [dsnv, setDsnv] = useState([]);
    const [idbp, setIdbp] = useState(null);
   

    // Lấy danh sách chức vụ từ API
    useEffect(() => {
        axios.get("http://localhost:8080/bophan/getds")
            .then((response) => {
                if (response.data && response.data.data) {
                    setDsChucVu(response.data.data);
                } else {
                    console.error("Dữ liệu API không hợp lệ:", response.data);
                }
            })
            .catch(error => console.error("Lỗi khi fetch dữ liệu:", error));
    }, []);

    // Khi chọn chức vụ, cập nhật danh sách bộ phận
    const handleChucVuChange = (event) => {
        const selectedId = event.target.value;
        setSelectedChucVu(selectedId);

        const selectedChucVuObj = dsChucVu.find(item => item.id === selectedId);
        setDsBoPhan(selectedChucVuObj ? selectedChucVuObj.chucVu || [] : []);
        setSelectedBoPhan("");

        // Gọi API lấy nhân viên theo chức vụ
        axios.get(`http://localhost:8080/nhanvien/getnhanvinbychucv?bpid=${selectedId}`)
            .then((data) => {
                setDsnv(data.data.data);
            })
            .catch(error => console.error("Lỗi khi fetch nhân viên:", error));

        setIdbp(selectedId);
    };

    // Khi chọn bộ phận, gọi API lấy nhân viên theo chức vụ + bộ phận
    const handleBoPhanChange = (event) => {
        const selectedBpId = event.target.value;
        setSelectedBoPhan(selectedBpId);

        axios.get(`http://localhost:8080/nhanvien/getnhanvinbychucvu?bpid=${idbp}&cvid=${selectedBpId}`)
            .then((data) => {
                setDsnv(data.data.data);
            })
            .catch(error => console.error("Lỗi khi fetch nhân viên:", error));
    };

    // Xử lý chọn/bỏ chọn nhân viên
    const handleCheckboxChange = (event, dataId) => {
        const isChecked = event.target.checked;
        let updatedList = [...(prop.dsnvv || [])];

        if (isChecked) {
            updatedList.push(dataId);
        } else {
            updatedList = xoaPhanTu(updatedList, dataId);
        }

        prop.setdsnvv(updatedList);
    };

    return (
        <div  style={{position:"absolute",backgroundColor:"white",border:"1px solid black",width:"95%",borderRadius:"10px",left: "50%",zIndex:20,padding:"30px",
            top: "50%",
            transform: "translate(-50%, -50%)"}}>
           <img onClick={() => {
               prop.setpppp(false)
            }} style={{ width: "20px", height: "20px", cursor: "pointer" }} src="https://cdn-icons-png.flaticon.com/128/1632/1632708.png"></img>
            
          
           <h5 style={{textAlign:"center",marginTop:"10px"}}>Chọn nhân viên có cùng ca làm</h5>

            {/* Dropdown Chức vụ */}
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="chucvu-label">Chức vụ</InputLabel>
                <Select
                    labelId="chucvu-label"
                    value={selectedChucVu}
                    onChange={handleChucVuChange}
                    sx={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        "& .MuiOutlinedInput-root fieldset": { borderColor: "#dcdcdc" },
                    }}
                >
                    {dsChucVu.length > 0 ? (
                        dsChucVu.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.ten}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Không có dữ liệu</MenuItem>
                    )}
                </Select>
            </FormControl>

            {/* Dropdown Bộ phận */}
            <FormControl fullWidth disabled={!dsBoPhan.length}>
                <InputLabel id="bophan-label">Bộ phận</InputLabel>
                <Select
                    labelId="bophan-label"
                    value={selectedBoPhan}
                    onChange={handleBoPhanChange}
                    label="Bộ phận"
                    sx={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        "& .MuiOutlinedInput-root fieldset": { borderColor: "#dcdcdc" },
                    }}
                >
                    {dsBoPhan.length > 0 ? (
                        dsBoPhan.map((bp) => (
                            <MenuItem key={bp.id} value={bp.id}>
                                {bp.ten}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Chọn chức vụ trước</MenuItem>
                    )}
                </Select>
            </FormControl>

            {/* Bảng danh sách nhân viên */}
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }}>
                <thead>
                    <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }}>
                        <th style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }}>Tên nhân viên</th>
                        <th style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }}>Chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {dsnv.length > 0 ? (
                        dsnv.map((data) => (
                            <tr key={data.id}>
                                <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }}>{data.ten}</td>
                                <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }}>
                                    <input 
                                        type="checkbox"
                                        checked={timPhanTu(prop.dsnvv || [], data.id)}
                                        onChange={(event) => handleCheckboxChange(event, data.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} colSpan="2">Không có nhân viên nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ChucVuSelect;
