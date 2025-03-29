
import { use, useState } from "react";
import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Menu from "./components/admin/menu"
import Home from "./components/admin/homeadmin"
import MonAn from "./components/public/moan"
import Thuuong from "./components/public/thucuong"
import Combo from "./components/public/combo"
import Calam from "./components/admin/calam"
import NhanVien from "./components/admin/quanlynhanvien"
import QLKM from "./components/admin/Quanlykhuyenmai"
import Sanh from "./components/admin/sanh"
import HomePhucVu from "./components/phucvu/homephucvu"
import QLDON from "./components/phucvu/quanlydon"
import Quanlydon from "./components/phucvu/quanlydon";
import ThemDon from "./components/phucvu/themdon"
import Login from "./components/public/login"
import HomeQuanLy from "./components/nhabep/homenhabep"
import DsCho from "./components/nhabep/donchualam"
import DSCHODV from "./components/phucvu/dondangcho"
import CAPNHATDANGCHO from "./components/phucvu/capnhatdon"
import T from "./components/phucvu/lamdon"
import DDL from "./components/nhabep/dondanglam"
import DSDL from "./components/phucvu/dsdanglam"
import CapNhatDangLam from "./components/phucvu/capnhatdanglam"
function App() {
  return (

    <div className="container-fluid">
      <Routes>
        <Route path="/login" element={<Login></Login>} ></Route>
        <Route path="/admin" element={<Home></Home>}>
            <Route path="menu" element={<Menu></Menu>}>
                <Route path="monan" element={<MonAn></MonAn>}></Route>
                <Route path="thucuong" element={<Thuuong></Thuuong>}></Route>
                <Route path="combo" element={<Combo></Combo>}></Route>
            </Route>
            <Route path="calam" element={<Calam></Calam>}></Route>
            <Route path="khuyenmai" element={<QLKM></QLKM>}></Route>
            <Route path="nhanvien" element={<NhanVien></NhanVien>}></Route>
            <Route path="sanh" element={<Sanh></Sanh>}></Route>
        </Route>
        <Route path="/phucvu" element={<HomePhucVu></HomePhucVu>}>
             <Route path="themdon" element={<ThemDon></ThemDon>}></Route>
             <Route path="dscho" element={<DSCHODV></DSCHODV>}></Route>
             <Route path="danglam" element={<DSDL></DSDL>}></Route>
             <Route path="capnhatdangcho" element={<CAPNHATDANGCHO></CAPNHATDANGCHO>}></Route>
             <Route path="capnhatdanglam" element={<CapNhatDangLam></CapNhatDangLam>}></Route>
        </Route>
        <Route path="/quanly" element={<HomeQuanLy></HomeQuanLy>}>
          <Route path="dscho" element={<DsCho></DsCho>}></Route>
          <Route path="lamdon" element={<T></T>}></Route>
          <Route path="dondanglam" element={<DDL></DDL>}></Route>
        </Route>

      </Routes>

    </div>

  )
}


export default App;
