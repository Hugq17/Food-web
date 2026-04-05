import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";


export default function List({ data, onSelect }) {
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // 🔥 tránh click zoom map

    if (!confirm("Bạn có chắc muốn xoá không?")) return;

    try {
      await deleteDoc(doc(db, "restaurants", id));
    } catch (err) {
      console.error(err);
      alert("Xoá lỗi!");
    }
  };

  return (
    <div className="p-3 space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
        >
          {/* IMAGE */}
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />

            {/* ❌ NÚT XOÁ */}
            <button
              onClick={(e) => handleDelete(item.id, e)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-3">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.address}</p>

            <div className="flex justify-between mt-2">
              <span className="text-yellow-500">⭐ {item.rating}</span>
              <span className="text-gray-400">{item.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}