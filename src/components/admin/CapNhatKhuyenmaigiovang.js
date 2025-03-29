import zIndex from "@mui/material/styles/zIndex";
import axios from "axios";
import { useEffect, useState } from "react";
function isIdInArray(h, id) {
  if (h == []) return false;
  for (let i = 0; i < h.length; i++) {
    if (h[i].id == id) {
      return true;
    }
  }
  return false;
}
function getgia(h, id) {
  for (let j = 0; j < h.length; j++) {
    if (h[j].id == id) {
      return h[j].gia;
    }
  }
  return 0;
}
function getsl(h, id) {
  for (let j = 0; j < h.length; j++) {
    if (h[j].id == id) {
      return h[j].soLuong;
    }
  }
  return 0;
}
function xoakhoimang(h, id) {
  let g = [...h];
  g = g.filter(item => item.id !== id);
  return g;
}
function capnhat(h, id, soluong) {
  if (soluong === "") return h;
  console.log("Đã gọi tôi: " + id, " số lượng: " + soluong);
  
  let g = [...h];
  const soluongNumber = parseInt(soluong, 10); // Chuyển chuỗi thành số nguyên
  
  if (soluongNumber <= 0) {
    return g.filter(item => item.id !== id);
  }
  return g.map(item => (item.id === id ? { ...item, soLuong: soluongNumber } : item));
}
function capnhatgia(h, id, soluong) {
  if (soluong === "") {
    return h;
  };
  
  
  let g = [...h];
  const soluongNumber = parseInt(soluong, 10); 
  
  if (soluongNumber <= 0 || soluongNumber>100) {
    alert("Giá trị khuyến mãi phải nằm trong khoảng 0 - 100")
    return h;
  }
  return g.map(item => (item.id === id ? { ...item, gia: soluongNumber } : item));
}


function Addkhuyenmai(prop) {
  const [k, setk] = useState({
    dt: {
        id:1,
        anhDeco: null,
        ten: "",
        moTa: "",
        ngayGioApDung: null,
        ngayGioKetThuc: null,
        gioApDung: "11:26:00",
        gioKetThuc: "13:29:00"
    },
    dsma: [],
    dstu: [],
    dscb: []
  });

  const [ma, setma] = useState([]);
  const [loai, setloai] = useState(1)
  const [loait, setloait] = useState(1)
  const [loaic, setloaic] = useState(1)
  const [lma, setlma] = useState([]);
  const [tu, settu] = useState([]);
  const [ltu, setltu] = useState([]);
  const [cb, setcb] = useState([]);
  const [lcb, setlcb] = useState([]);


  useEffect(() => {

    axios.get(`http://localhost:8080/khuyenmai/getkmgvdto?idkmtt=${prop.idkm}`)
        .then((data)=>{
                setk(data.data.data)
                  document.getElementById("gad").value=data.data.data.dt.gioApDung;
    document.getElementById("gkt").value=data.data.data.dt.gioKetThuc;
        })
        .catch(()=>{
            alert("Lấy dữ liệu thất bại")
        })
    axios.get(`http://localhost:8080/monan/byloai?idloai=${loai}`)
      .then((data) => {
        setma(data.data.data)
      })
  }, [loai])

  useEffect(() => {
    axios.get(`http://localhost:8080/combo/getbyloai?idloai=${loaic}`)
      .then((data) => {
        setcb(data.data.data)
      })
  }, [loaic])

  useEffect(() => {
    axios.get(`http://localhost:8080/thucuong/thucuongbyloai?idloai=${loait}`)
      .then((data) => {
        settu(data.data.data)
      })
  }, [loait])
  useEffect(() => {
    axios.get("http://localhost:8080/getloaimonan")
      .then((data) => {
        setlma(data.data.data)
      })
    axios.get("http://localhost:8080/thucuong/getloai")
      .then((data) => {
        setltu(data.data.data)
      })
    axios.get("http://localhost:8080/loaicombo/getdscombo")
      .then((data) => {
        setlcb(data.data.data)
      })
    axios.get(`http://localhost:8080/monan/byloai?idloai=${loai}`)
      .then((data) => {
        setma(data.data.data)
      })
    axios.get(`http://localhost:8080/thucuong/thucuongbyloai?idloai=${loait}`)
      .then((data) => {
        settu(data.data.data)
      })
    axios.get("http://localhost:8080/combo/getbyloai?idloai=1")
      .then((data) => {
        setcb(data.data.data)
      })
  }, [])
  return (
    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" 
      ,backgroundColor:"white", zIndex:2
    }}>
      <p>Thông tin khuyến mãi</p>
      <label style={{marginRight:"10px"}}><strong>Tên khuyến mãi:  </strong></label>
      <input
        onChange={(event) => {
          setk(prevState => ({
            ...prevState,
            dt: {
              ...prevState.dt,
              ten: event.target.value
            }
          }));
        }}
        style={{borderRadius:"5px",borderColor:"#1C0F0A",cursor:"pointer",marginRight:"10px"}}
        type="text"
        placeholder="Tên khuyến mãi..."
        value={k.dt.ten}
      />
      
      <label style={{marginRight:"10px"}} ><strong>Ngày giờ áp dụng:</strong></label>
<input
  style={{borderRadius:"5px",borderColor:"#1C0F0A",cursor:"pointer",marginRight:"10px"}}
  onChange={(event) => {
    setk(prevState => ({
      ...prevState,
      dt: {
        ...prevState.dt,
        ngayGioApDung: event.target.value
      }
    }));
  }}
  type="datetime-local"
  value={k.dt.ngayGioApDung || ""}
/>

<label style={{marginRight:"10px"}} ><strong>Ngày giờ kết thúc:</strong></label>
<input
  style={{borderRadius:"5px",borderColor:"#1C0F0A"}}
  onChange={(event) => {
    setk(prevState => ({
      ...prevState,
      dt: {
        ...prevState.dt,
        ngayGioKetThuc: event.target.value
      }
    }));
  }}
  type="datetime-local"
  value={k.dt.ngayGioKetThuc || ""}
/>

<div className="mt-2">

  <label style={{marginRight:"10px"}} ><strong>Giờ áp dụng:</strong></label>
<input id="gad" 
  style={{borderRadius:"5px",borderColor:"#1C0F0A",marginRight:"10px"}}
  type="time"
/>
 
  <label style={{marginRight:"10px"}} ><strong>Giờ ngưng áp dụng:</strong></label>
<input id="gkt"
  style={{borderRadius:"5px",borderColor:"#1C0F0A"}}
  type="time"
/>
 
</div>
<div className="mt-2 row">
  <label style={{marginRight:"10px"}}><strong>Mô tả</strong></label>
  <textarea
   
    onChange={(event) => {
      setk(prevState => ({
        ...prevState,
        dt: {
          ...prevState.dt,
          moTa: event.target.value
        }
      }));
    }}
    placeholder="Nhập vào mô tả"
    value={k.dt.moTa}
    style={{resize: "vertical", width: "98%", height: "100px", borderRadius: "5px", borderColor: "#1C0F0A",marginLeft:"10px"}}
  />
</div>

      <div className="ma">
      <p className="mt-2"><strong>Chọn Món Ăn: </strong></p>

        <div>
        <ul style={{ listStyleType: "none", padding: 0, display: "flex", flexWrap: "wrap" }}>
  {lma.map((data) => {
    return (
      <button
        key={data.id}
        onClick={() => { setloai(data.id); console.log(k.dsma) }}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #1C0F0A", 
          padding: "10px 20px", 
          color: "#1C0F0A",
          textAlign: "center", 
          cursor: "pointer", 
          fontSize: "16px", 
          borderRadius: "5px", 
          margin: "7px", 
          outline: "none", 
          flex: "0 0 auto", 
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1C0F0A"; 
          e.target.style.color = "#fff"; 
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1C0F0A"; 
        }}
      >
        {data.tenLoai}
      </button>
    );
  })}
</ul>


        </div>
        <table className="w-100 mt-2" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }} >
  <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >STT</td>
    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Tên Món ăn</td>
    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Chọn</td>
    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Số lượng</td>
    <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Giá trị</td>
  </tr>
  {
    ma.map((data, index) => {
      return <>
        <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
          <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{index}</td>
          <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{data.ten}</td>
          <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >
            <input onChange={(e) => {
              if (e.target.checked) {
                let g = { ...k };
                g.dsma = [...g.dsma, { id: data.id, soLuong: 1, gia: 5 }];
                setk(g);
              }
              else {
                let g = { ...k };
                g.dsma = xoakhoimang(k.dsma, data.id);
                setk(g);
              }
            }} checked={isIdInArray(k.dsma, data.id)} type="checkbox"></input>
          </td>
          <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >
            {isIdInArray(k.dsma, data.id) ? <input onChange={(e) => {
              let g = { ...k };
              g.dsma = capnhat(k.dsma, data.id, e.target.value);
              setk(g);
            }} type="number" value={getsl(k.dsma, data.id)}></input> : null}
          </td>
          <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >
            {isIdInArray(k.dsma, data.id) ? <input onChange={(e) => {
              let g = { ...k };
              g.dsma = capnhatgia(k.dsma, data.id, e.target.value);
              setk(g);
            }} value={getgia(k.dsma, data.id)} type="number"></input> : null}
          </td>
        </tr>
      </>
    })
  }
</table>

      </div>
      <div className="tu">
      <p className="mt-2"><strong>Chọn Thức uống: </strong></p>

        <div>

        <ul style={{ listStyleType: "none", padding: 0, display: "flex", flexWrap: "wrap" }}>
  {ltu.map((data) => {
    return (
      <button
        key={data.ltuId}
        onClick={() => { setloait(data.ltuId); }}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #1C0F0A", 
          padding: "10px 20px", 
          color: "#1C0F0A",
          textAlign: "center", 
          cursor: "pointer", 
          fontSize: "16px", 
          borderRadius: "5px", 
          margin: "7px", 
          outline: "none", 
          flex: "0 0 auto", 
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1C0F0A"; 
          e.target.style.color = "#fff"; 
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1C0F0A"; 
        }}
      >
        {data.ltuTen}
      </button>
    );
  })}
</ul>
        </div>
        <table className="w-100 mt-2" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }} >
          <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }}  >
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >STT</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Tên Thức uống</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Chọn</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Số lượng</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Giá trị</td>
          </tr>
          {
            tu.map((data, index) => {
              return <>
                <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{index}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{data.ten}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} ><input onClick={(e) => {
                    if (e.target.checked) {
                      let g = { ...k };
                      g.dstu = [...g.dstu, { id: data.id, soLuong: 1, gia: 5 }]; setk(g);
                    }
                    else {
                      let g = { ...k };
                      g.dstu = xoakhoimang(k.dstu, data.id)
                      setk(g)
                    }

                  }} checked={isIdInArray(k.dstu, data.id)} type="checkbox"></input></td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} > {isIdInArray(k.dstu, data.id) ? <input onChange={(e) => {
                    let g = { ...k };
                    g.dstu = capnhat(k.dstu, data.id, e.target.value)
                    setk(g)
                  }} value={getsl(k.dstu,data.id)} type="number"></input> : null} </td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{isIdInArray(k.dstu, data.id) ? <input onChange={(e) => {
                    let g = { ...k };
                    g.dstu= capnhatgia(k.dstu, data.id, e.target.value)
                    setk(g)
                  }} value={getgia(k.dstu,data.id)} type="number" placeholder="Nhập vào phần trăm Khuyến mãi"></input> : null}</td>
                </tr>
              </>
            })
          }
        </table>
      </div>
      <div className="cb">
        <p className="mt-2"><strong>Chọn ComBo: </strong></p>

        <div>

        <ul style={{ listStyleType: "none", padding: 0, display: "flex", flexWrap: "wrap" }}>
  {lcb.map((data) => {
    return (
      <button
        key={data.id}
        onClick={() => { setloaic(data.id); }}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #1C0F0A", 
          padding: "10px 20px", 
          color: "#1C0F0A",
          textAlign: "center", 
          cursor: "pointer", 
          fontSize: "16px", 
          borderRadius: "5px", 
          margin: "7px", 
          outline: "none", 
          flex: "0 0 auto", 
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1C0F0A"; 
          e.target.style.color = "#fff"; 
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1C0F0A"; 
        }}
      >
        {data.ten}
      </button>
    );
  })}
</ul>
         
        </div>
        <table className="w-100 mt-2" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#f5f5f5", border: "1px solid #1C0F0A" }}  >
          <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >STT</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Tên Combo</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Chọn</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Số lượng</td>
            <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >Giá trị</td>
          </tr>
          {
            cb.map((data, index) => {
              return <>
                <tr style={{ backgroundColor: "#1C0F0A", color: "#fff" }} >
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{index}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{data.ten}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} ><input onClick={(e) => {
                    if (e.target.checked) {
                      let g = { ...k };
                      g.dscb = [...g.dscb, { id: data.id, soLuong: 1, gia: 5 }]; setk(g);
                    }
                    else {
                      let g = { ...k };
                      g.dscb = xoakhoimang(k.dscb, data.id)
                      setk(g)
                    }

                  }} checked={isIdInArray(k.dscb, data.id)} type="checkbox"></input></td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} > {isIdInArray(k.dscb, data.id) ? <input onChange={(e) => {
                    let g = { ...k };
                    g.dscb = capnhat(k.dscb, data.id, e.target.value)
                    setk(g)
                  }} type="number" value={getsl(k.dscb,data.id)} defaultValue={1}></input> : null} </td>
                  <td style={{ padding: "10px", borderTop: "1px solid #fff", borderBottom: "1px solid #fff", textAlign: "center" }} >{isIdInArray(k.dscb, data.id) ? <input onChange={(e) => {
                    let g = { ...k };
                    g.dscb = capnhatgia(k.dscb, data.id, e.target.value)
                    setk(g)
                  }} value={getgia(k.dscb,data.id)} type="number" placeholder="Nhập vào phần trăm Khuyến mãi"></input> : null}</td>
                </tr>
              </>
            })
          }
        </table>
      </div>
      <button 
  onClick={() => {
    if(prop.gv==false){
      axios.post("http://localhost:8080/khuyenmai/save", k)
      .then((data) => {
        if(data.data.status=="OK"){
          alert("Tạo khuyến mãi thành công");
        }
        else{
          alert(data.data.message)
        }
      })
    }
    else{
      const gioApDung = document.getElementById("gad");
      const gioKetThuc = document.getElementById("gkt").value;
    // alert(gioApDung)
      const newK = {
        ...k,
        dt: {
          ...k.dt,
          gioApDung: gioApDung,
          gioKetThuc: gioKetThuc
        }
      };
      axios.post("http://localhost:8080/khuyenmai/savek", newK)
      .then((data) => {
        if(data.data.status=="OK"){
          alert("Tạo khuyến mãi thành công");
        }
        else{
          alert(data.data.message)
        }
      })
    }
  }} 
  style={{
    backgroundColor: "#1C0F0A",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginRight: "10px"
  }}
>
  Thêm
</button>

<button 
  onClick={() => {
    prop.seto(false)
  }} 
  style={{
    backgroundColor: "white",
    color: "#1C0F0A",
    border: "2px solid #1C0F0A",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer"
  }}
>
  Đóng
</button>

    </div>
  );
}

export default Addkhuyenmai;
