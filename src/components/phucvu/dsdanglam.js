import { ref, onValue, get, update } from "firebase/database";
import { database } from "../public/firebaseconfig";
import { useEffect, useState } from "react";
import { BorderLeft } from "@mui/icons-material";
import { xoaDuLieuTheoID } from "../public/firebaseconfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const dataRef = ref(database, "dsdanglam");

export default function MyComponent() {
    const navigate=useNavigate()
    const [dscho, setdscho] = useState([]);
  
    useEffect(() => {
        const unsubscribe = onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Dữ liệu Firebase:", data);
    
            if (data) {
                const filteredData = Object.entries(data)
                    .filter(([key, _]) => key !== "0") 
                    .map(([, value]) => value); 
    
                setdscho(filteredData);
            } else {
                setdscho([]); 
            }
        });
    
        return () => unsubscribe();
    }, []);
    
  
    return (
        <div>
            <h2 style={{ textAlign: "center", color: "#7AB730" }}>Danh sách đơn cho làm</h2>
            <hr></hr>
            <table style={{ width: "100%" }}>
                <tr style={{ border: "1px solid #7AB730", textAlign: "center", color: "white" }}>
                    <td style={{ backgroundColor: "#7AB730" }}>STT</td>
                    <td style={{ color: "#7AB730" }}>Bàn</td>
                    <td style={{ backgroundColor: "#7AB730" }}> Thông tin bàn ăn</td>
                    <td style={{ color: "#7AB730" }}>Số lượng người</td>
                    <td style={{ backgroundColor: "#7AB730" }}>Thao tác</td>
                </tr>


                {
                    dscho?.map((data, index) => {
                        return data.listOrder.map((d, p) => {
                            if (p == 0) {
                                return <tr style={{ border: "1px solid #7AB730", textAlign: "center", color: "white" }}>
                                    <td rowSpan={data.listOrder.length} style={{ backgroundColor: index%2==0 ? "#7AB730": "white", color: index%2==0 ? "white": "black", borderRight: "1px solid #7AB730"}}>{index + 1}</td>
                                    <td style={{ color: "#7AB730" }}>
                                        {
                                            d?.ban?.map((e, ee) => {
                                                return <div>
                                                    <p style={{ marginTop: "10px" }}>Bàn: {e.banId} - Sảnh: {e.sanhId}</p>
                                                    {ee != d?.ban?.length - 1 ? <hr></hr> : null}
                                                </div>
                                            })
                                        }
                                    </td>
                                    <td style={{ backgroundColor: "#7AB730" }}>
                                        {d?.dsma?.length!=0 && d?.dsma!=undefined  ? <>
                                            <div>
                                                <p style={{backgroundColor:"white", color:"black"}}>Danh sách món ăn</p>
                                                {
                                                    d?.dsma.map(du=>{
                                                            return <div>
                                                                <span>{du.ten} - Số Lượng: {du.soLuong}</span>
                                                                {du.ghiChu ?<><p>" {du.ghiChu} " </p></> :null}
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </> : null}
                                        {d?.dstu?.length>0  && d?.dstu!=undefined ? <>
                                            <div>
                                                <p style={{backgroundColor:"white", color:"black"}}>Danh sách thức uống</p>
                                                <hr></hr>
                                                {
                                                    d?.dstu?.map(du=>{
                                                            return <div>
                                                                <span>{du.ten} - Số Lượng: {du.soLuong}</span>
                                                                {du.ghiChu ?<><p>" {du.ghiChu} " </p></> :null}
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </> : null}
                                        {d?.dscb?.length>0 && d?.dscb!=undefined  ? <>
                                            <div>
                                                <p style={{backgroundColor:"white", color:"black"}}>Danh sách combo</p>
                                                <hr></hr>
                                                {
                                                    d?.dscb?.map(du=>{
                                                            return <div>
                                                                <span>{du.ten} - Số Lượng: {du.soLuong}</span>
                                                                {du.ghiChu ?<><p>" {du.ghiChu} " </p></> :null}
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </> : null}
                                    </td>
                                    <td style={{ color: "#7AB730" }}>Số lượng người: {d.soLuongNguoi}</td>
                                    <td rowSpan={data.listOrder.length} style={{ backgroundColor: index%2==0 ? "#7AB730": "white", border:"1px solid #7AB730"}}>
                                                   <button onClick={()=>{
                                                    axios.get(`http://localhost:8080/yeucau/huy?id=${data.id}`)
                                                        .then(dat=>{
                                                            if(dat.data.status==="OK"){
                                                                xoaDuLieuTheoID("dscho",data.id);
                                                            }
                                                            else{
                                                                alert("xóa đơn thất bại")
                                                            }
                                                        })
                                                   }} disabled={data.update}>Hủy</button>
                                                   <button onClick={()=>{
                                                    
                                                             navigate(`/phucvu/capnhatdanglam?id=${data.id}`)
                                                   }} disabled={data.update}>Chỉnh sửa </button>

                                    </td>
                                </tr>
                            }
                            else {
                                return <tr style={{ border: "1px solid #7AB730", textAlign: "center", color: "white", }}>
                                    <td style={{ color: "#7AB730" }}>
                                        {
                                            d?.ban?.map((e, ee) => {
                                                return <div>
                                                    <p style={{ marginTop: "10px" }}>Bàn: {e.banId} - Sảnh: {e.sanhId}</p>
                                                    {ee != d?.ban?.length - 1 ? <hr></hr> : null}
                                                </div>
                                            })
                                        }
                                    </td>
                                    <td style={{ backgroundColor: "#7AB730" }}>
                                       <div style={{border:"3px solid black"}}>
                                       {d?.dsma?.length!=0 && d?.dsma!=undefined  ? <>
                                            <div>
                                                <p style={{backgroundColor:"white", color:"black"}}>Danh sách món ăn</p>
                                                <hr></hr>
                                                {
                                                    d?.dsma.map(du=>{
                                                            return <div>
                                                                <span>{du.ten} - Số Lượng: {du.soLuong}</span>
                                                                {du.ghiChu ?<><p>" {du.ghiChu} " </p></> :null}
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </> : null}
                                        {d?.dstu?.length>0 && d?.dstu!=undefined  ? <>
                                            <div>
                                                <p style={{backgroundColor:"white", color:"black"}}>Danh sách thức uống</p>
                                                <hr></hr>
                                                {
                                                    d?.dstu?.map(du=>{
                                                            return <div>
                                                                <span>{du.ten} - Số Lượng: {du.soLuong}</span>
                                                                {du.ghiChu ?<><p>" {du.ghiChu} " </p></> :null}
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </> : null}
                                        {d?.dscb?.length>0 && d?.dscb!=undefined  ? <>
                                            <div>
                                                <p style={{backgroundColor:"white", color:"black"}}>Danh sách combo</p>
                                                <hr></hr>
                                                {
                                                    d?.dscb?.map(du=>{
                                                            return <div>
                                                                <span>{du.ten} - Số Lượng: {du.soLuong}</span>
                                                                {du.ghiChu ?<><p>" {du.ghiChu} " </p></> :null}
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </> : null}
                                       </div>
                                    </td>
                                    <td style={{ color: "#7AB730" }}>Số lượng người: {d.soLuongNguoi}</td>
                                    
                                </tr>
                            }
                        })
                    })


                }
            </table>

        </div>
    );
}
