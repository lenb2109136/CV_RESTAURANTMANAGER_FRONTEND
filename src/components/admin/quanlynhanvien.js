import React, { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl, TextField, Grid, Box, Button } from "@mui/material";
import axios from "axios";
import ThemNhanVien from "./themnhanvien"
import U from "./updatenhanvien"
function NhanVien() {
  const [nhanVien, setNhanVien] = useState([]);
  const [chucvu, setChucVu] = useState([]);
  const [selectedChucVu, setSelectedChucVu] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bp= useRef(0);
  const name= useRef('');
  const [open,setopen] = useState(false)
  const [openu,setopenu] = useState(false)
  const nhanvienduocchon= useRef({})
  const cg=useRef([])
  useEffect(() => {
    axios.get("http://localhost:8080/nhanvien/getall")
      .then((data) => {
        setNhanVien(data.data.data)
      });
    axios.get("http://localhost:8080/bophan/getds")
      .then((data) => {
        setChucVu([...data.data.data,{ten: "Tất cả", id:0}])
        cg.current=[...data.data.data]
      });
  }, []);
   
  function call(){
    axios.get(`http://localhost:8080/nhanvien/tieuchi?name=${name.current}&id=${bp.current}`)
    .then((data) => {
      console.log("")
      setNhanVien([...data.data.data.data])
    });
  }
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChucVuChange = (e) => {
    setSelectedChucVu(e.target.value);
  };



  return (
    <div style={{ padding: "20px" }}>

        {open ? <ThemNhanVien setopen={setopen} nv={setNhanVien} bp={bp} name={name} ></ThemNhanVien> :null}
        {openu ? <U bp={bp} name={name} dsbp1={cg.current} setn={setNhanVien} setopenu={setopenu} nv={nhanvienduocchon.current} dsnv={nhanVien} setNhanVien={setNhanVien}></U> :null}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3, maxWidth: "400px", margin: "0 auto" }}>
    <Button onClick={()=>{setopen(true)}}>thêm</Button>

        {/* Search Input */}
        <TextField 
          label="Tìm kiếm nhân viên"
          variant="outlined"
          onChange={(event)=>{
            name.current=event.target.value;
            call()
          }}
          fullWidth
          sx={{
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#dcdcdc",
              },
            },
          }}
        />

        {/* Chức vụ Dropdown */}
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
              <MenuItem onClick={()=>{
                bp.current=data.id;
                call()
              }} key={data.id} value={data.id}>{data.ten}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <Paper sx={{ marginTop: "30px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#1C0F0A" }}>
              <TableCell style={{ color: "white" }}>STT</TableCell>
              <TableCell style={{ color: "white" }}>Tên nhân viên</TableCell>
              <TableCell style={{ color: "white" }}>SDT</TableCell>
              <TableCell style={{ color: "white" }}>Bộ Phận</TableCell>
              <TableCell style={{ color: "white" }}>Chức Vụ</TableCell>
              <TableCell style={{ color: "white" }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nhanVien.map((nv, index) => (
              <TableRow style={{cursor:"pointer"}} onClick={()=>{setopenu(true); nhanvienduocchon.current=nv}} key={nv.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{nv.ten}</TableCell>
                <TableCell>{nv.sdt}</TableCell>
                <TableCell>{nv.chucVu.ten}</TableCell>
                <TableCell>{nv.boPhan.ten}</TableCell>
                <TableCell>{nv.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default NhanVien;
