import axios, { Axios } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import {them,langNgheDuLieu,xoaDuLieuTheoID} from "./firebaseconfig"
const Login = () => {
  const navigate=useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <input
          type="text"
          placeholder="Số điện thoại"
          id="sdt"
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          id="pass"
          placeholder="password"
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={()=>{
            let f= new FormData();
            f.append("soDienThoai",document.getElementById("sdt").value);
            f.append("matKhau",document.getElementById("pass").value);
            axios.post("http://localhost:8080/login/login",f)
            .then(data=>{
               if(data.data.status=="OK"){
                        localStorage.setItem("token",data.data.data.token)
                        localStorage.setItem("anh",data.data.data.anh)
                        localStorage.setItem("ten",data.data.data.ten)
                        localStorage.setItem("role",data.data.data.role)
                        if(data.data.data.role==3){
                            navigate("/admin/menu/monan")
                        }
                        else if(data.data.data.role==2){
                          navigate("/phucvu/themdon")
                        }
                        else{
                          navigate("/nhabep")
                        }
               }
               else{
                    alert("thông tin đăng nhập không hợp lệ")
               }
            })
        }}   className="w-full bg-green-500 text-white p-3 rounded-md font-semibold hover:bg-green-600">
          LOGIN
        </button>
        <p className="text-center mt-4 text-gray-600 text-sm">
          Not registered? <a href="#" className="text-green-600">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
