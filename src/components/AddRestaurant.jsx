import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddRestaurant({ onClose }) {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Ăn vặt");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdBy, setCreatedBy] = useState("");

  // 🔥 LẤY LAT/LNG TỪ ĐỊA CHỈ


  // 🔥 UPLOAD ẢNH CLOUDINARY
  const uploadImages = async () => {
    const urls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "food-web");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dronxgw1h/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      urls.push(data.secure_url);
    }

    return urls;
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!name || !street || !ward || !city) {
      alert("Nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const fullAddress = `${street}, ${ward}, ${city}`;

      const imageUrls = await uploadImages(); // ✅ đúng

      await addDoc(collection(db, "restaurants"), {
        name,
        address: fullAddress,
        category,
        rating: 4,
        images: imageUrls,
        createdBy: createdBy || "Ẩn danh",
        createdAt: new Date(),
      });

      alert("Đã thêm quán!");

      setName("");
      setStreet("");
      setWard("");
      setCity("");
      setCategory("Ăn vặt");
      setFiles([]);
      setCreatedBy("");

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
          placeholder="Tên đường (vd: 74 Hàng Quạt)"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Phường (vd: Hàng Gai)"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Thành phố (vd: Hà Nội)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {/* category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="Ăn vặt">Ăn vặt</option>
          <option value="Nhậu lai rai">Nhậu lai rai</option>
          <option value="Món Hàn">Món Hàn</option>
          <option value="Món Trung">Món Trung</option>
          <option value="Món Nhật">Món Nhật</option>
          <option value="Món Thái">Món Thái</option>
          <option value="Món nước">Món nước (bún, phở, mì…)</option>
          <option value="Món khô">Món khô (cơm, mì trộn…)</option>
          <option value="BBQ / Nướng">BBQ / Nướng</option>
          <option value="Lẩu">Lẩu</option>
          <option value="Trà sữa/Trà Trái Cây">Trà sữa / Trà trái cây</option>
          <option value="Cà phê">Cà phê</option>
        </select>

        <input
          placeholder="Người thêm (vd: Hùng Máy Dập)"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {/* file */}
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />
        {/* preview */}
        {files.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {files.map((f, i) => (
              <img
                key={i}
                src={URL.createObjectURL(f)}
                className="h-24 w-24 object-cover rounded"
              />
            ))}
          </div>
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