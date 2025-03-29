import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove, onValue, push, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCJxdSbVl4NtyMJh3j2qERD5jAHJadlzy8",
  authDomain: "projectlearning-55ae1.firebaseapp.com",
  databaseURL: "https://projectlearning-55ae1-default-rtdb.firebaseio.com",
  projectId: "projectlearning-55ae1",
  storageBucket: "projectlearning-55ae1.appspot.com",
  messagingSenderId: "802431177082",
  appId: "1:802431177082:web:b1458ca9ca20676343c6c3",
  measurementId: "G-FJLPZRKSFN"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function them(data, collection, id) {
  const newRef = ref(database, `${collection}/${id}`);
  const newData = { ...data, id };
  set(newRef, newData)
    .then(() => {
      console.log("Thêm thành công:", newData);
    })
    .catch((error) => {
      console.error("Lỗi khi thêm dữ liệu:", error);
    });
}

export async function xoaDuLieuTheoID(collection, idCanXoa) {
  const dataRef = ref(database, `${collection}/${idCanXoa}`);

  try {
    await remove(dataRef);
    console.log(`Xóa thành công phần tử có id: ${idCanXoa}`);
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu:", error);
  }
}

export async function layDuLieuTheoID(collection, idCanLay) {
  const dataRef = ref(database, `${collection}/${idCanLay}`);
  try {
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Không tìm thấy dữ liệu với id:", idCanLay);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return []; 
  }
}


export async function capNhatDuLieuTheoID(collection, idCanCapNhat, newData) {
  const dataRef = ref(database, `${collection}/${idCanCapNhat}`);
  try {
    await update(dataRef, newData);
    console.log(`Cập nhật thành công dữ liệu tại id: ${idCanCapNhat}`);
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu:", error);
  }
}





export { database };
