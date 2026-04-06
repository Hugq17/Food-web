import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";

export default function List({ data, onSelectDetail }) {
  const [openMenuId, setOpenMenuId] = useState(null);
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
          className="relative bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex items-center gap-2 p-3">
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {item.name?.charAt(0)}
            </div>

            {/* INFO */}
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-gray-400">
                👤 {item.createdBy || "Ẩn danh"} •{" "}
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString("vi-VN")
                  : ""}
              </p>
            </div>

            {/* 🔥 NÚT XOÁ */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === item.id ? null : item.id);
              }}
              className="text-gray-500 text-xl"
            >
              ⋯
            </button>
          </div>
          {openMenuId === item.id && (
            <div className="absolute right-3 top-12 bg-white shadow-lg rounded-xl w-32 z-50 overflow-hidden">

              {/* SỬA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Chưa làm edit 😄");
                  setOpenMenuId(null);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                ✏️ Sửa
              </button>

              {/* XOÁ */}
              <button
                onClick={(e) => {
                  handleDelete(item.id, e);
                  setOpenMenuId(null);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-red-100 text-red-500 text-sm"
              >
                🗑 Xoá
              </button>

              {/* BÁO CÁO */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Đã báo cáo!");
                  setOpenMenuId(null);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                🚩 Báo cáo
              </button>
            </div>
          )}

          {/* IMAGE */}
          {(item.images?.length || item.image) && (
            <>
              {/* 1 ảnh */}
              {(item.images?.length === 1 || item.image) && (
                <img
                  src={item.images?.[0] || item.image}
                  className="w-full h-[220px] object-cover"
                />
              )}

              {/* nhiều ảnh */}
              {item.images?.length > 1 && (
                <div className="grid grid-cols-2 gap-[2px]">
                  {item.images.slice(0, 4).map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        className="w-full h-[120px] object-cover"
                      />

                      {index === 3 && item.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold">
                          +{item.images.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* CONTENT */}
          <div className="p-3 space-y-1">
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              {item.category}
            </span>

            <p className="text-sm text-gray-600">
              📍 {item.address}
            </p>

            <p className="text-yellow-500 text-sm">
              ⭐ {item.rating}
            </p>
          </div>

          {/* ACTION */}
          <div className="flex border-t text-sm">
            <button
              onClick={() => onSelectDetail(item)}
              className="flex-1 py-2 text-blue-500 font-medium"
            >
              🔍 Xem chi tiết
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}