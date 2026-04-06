import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function List({ data, onSelectDetail, onSelectMap }) {
  const handleDelete = async (id, e) => {
    e.stopPropagation();

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
          className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
        >
          {/* IMAGE */}
          <div className="relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-44 object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* CATEGORY */}
            <div className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded-full">
              {item.category}
            </div>

            {/* DELETE */}
            <button
              onClick={(e) => handleDelete(item.id, e)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
            >
              ✕
            </button>

            {/* NAME + ACTION */}
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <h3 className="font-semibold text-lg">
                {item.name}
              </h3>

              <div className="flex justify-between items-center mt-1">
                <span className="text-yellow-300 text-sm">
                  ⭐ {item.rating}
                </span>

                <div className="flex gap-2">
                  {/* 🔍 DETAIL */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDetail(item);
                    }}
                    className="bg-white text-blue-500 px-2 py-1 rounded-full text-xs shadow"
                  >
                    🔍
                  </button>

                  {/* 📍 MAP */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMap(item);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
                  >
                    📍
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-3">
            <p className="text-sm text-gray-500">{item.address}</p>

            <div className="text-xs text-gray-400 mt-1">
              👤 {item.createdBy || "Ẩn danh"}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              ⏱{" "}
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleString("vi-VN")
                : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}