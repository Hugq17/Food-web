// import { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase";

// export default function AddRestaurant({ onClose }) {
//   const [name, setName] = useState("");
//   const [lat, setLat] = useState("");
//   const [lng, setLng] = useState("");
//   const [category, setCategory] = useState("Ăn vặt");
//   const [file, setFile] = useState(null);

//   // 🔥 UPLOAD ẢNH LÊN CLOUDINARY
//   const uploadImage = async () => {
//     if (!file) {
//       alert("Chọn ảnh trước!");
//       return null;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "food-web"); // 🔥 sửa
//     formData.append("cloud_name", "dronxgw1h"); // 🔥 sửa

//     try {
//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dronxgw1h/image/upload", // 🔥 sửa
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       console.log(data);
//       return data.secure_url; // link ảnh
//     } catch (err) {
//       console.error(err);
//       alert("Upload ảnh lỗi!");
//       return null;
//     }
//   };

//   // 🔥 SUBMIT
//   const handleSubmit = async () => {
//     const imageUrl = await uploadImage();
//     if (!imageUrl) return;

//     try {
//       await addDoc(collection(db, "restaurants"), {
//         name,
//         lat: Number(lat),
//         lng: Number(lng),
//         category: String(category),
//         address: "Demo",
//         rating: 4,
//         image: imageUrl,
//       });

//       alert("Đã thêm quán!");
//     } catch (err) {
//       console.error(err);
//       alert("Lỗi lưu dữ liệu!");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="p-4 bg-white w-[90%] rounded-xl space-y-2 relative">

//         {/* NÚT ĐÓNG */}
//         <div
//           className="absolute top-2 right-2 text-lg"
//           onClick={onClose}
//         >
//           ✖
//         </div>

//         <h2 className="text-lg font-bold">Thêm quán</h2>

//         <input
//           placeholder="Tên quán"
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 w-full"
//         />

//         <input
//           placeholder="lat"
//           onChange={(e) => setLat(e.target.value)}
//           className="border p-2 w-full"
//         />

//         <input
//           placeholder="lng"
//           onChange={(e) => setLng(e.target.value)}
//           className="border p-2 w-full"
//         />
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-2 w-full"
//         >
//           <option value="Ăn vặt">Ăn vặt</option>
//           <option value="Bún/Phở">Bún/Phở</option>
//           <option value="Cà phê">Cà phê</option>
//           <option value="Gà rán">Gà rán</option>

//         </select>

//         <input
//           type="file"
//           onChange={(e) => setFile(e.target.files[0])}
//         />

//         <button
//           onClick={handleSubmit}
//           className="bg-black text-white px-4 py-2 rounded w-full"
//         >
//           Thêm quán
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddRestaurant({ onClose }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Ăn vặt");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 LẤY LAT/LNG TỪ ĐỊA CHỈ
  const getLatLngFromAddress = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      const data = await res.json();

      if (data.length === 0) {
        alert("Không tìm thấy địa chỉ!");
        return null;
      }

      return {
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
      };
    } catch (err) {
      console.error(err);
      alert("Lỗi tìm địa chỉ");
      return null;
    }
  };

  // 🔥 UPLOAD ẢNH CLOUDINARY
  const uploadImage = async () => {
    if (!file) {
      alert("Chọn ảnh trước!");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "food-web");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dronxgw1h/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error(err);
      alert("Upload ảnh lỗi!");
      return null;
    }
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!name || !address) {
      alert("Nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const location = await getLatLngFromAddress();
      if (!location) {
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImage();
      if (!imageUrl) {
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "restaurants"), {
        name,
        address,
        lat: location.lat,
        lng: location.lng,
        category,
        rating: 4,
        image: imageUrl,
      });

      alert("Đã thêm quán!");

      // reset
      setName("");
      setAddress("");
      setCategory("Ăn vặt");
      setFile(null);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div
        className="relative bg-white p-4 rounded-2xl w-full max-w-md space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Thêm quán</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* name */}
        <input
          placeholder="Tên quán"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {/* address */}
        <input
          placeholder="Địa chỉ (vd: 74 Hàng Quạt, Hà Nội)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {/* category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="Ăn vặt">Ăn vặt</option>
          <option value="Bún/Phở">Bún/Phở</option>
          <option value="Cà phê">Cà phê</option>
          <option value="Gà rán">Gà rán</option>
        </select>

        {/* file */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* preview */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="h-32 object-cover rounded"
          />
        )}

        {/* button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Đang xử lý..." : "Thêm quán"}
        </button>
      </div>
    </div>
  );
}