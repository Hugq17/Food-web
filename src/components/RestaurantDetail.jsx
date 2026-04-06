import Comments from "./Comments";

export default function RestaurantDetail({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* MODAL (BOTTOM SHEET STYLE 🔥) */}
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE */}
        <div className="relative">
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {(item.images?.length ? item.images : [item.image]).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full h-56 object-cover flex-shrink-0 snap-center"
                />
              ))}
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full shadow"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          {/* NAME */}
          <h2 className="text-xl font-bold">
            {item.name}
          </h2>

          {/* ADDRESS */}
          <p className="text-sm text-gray-500">
            📍 {item.address}
          </p>

          {/* CATEGORY + RATING */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {item.category}
            </span>

            <span className="text-yellow-500 font-semibold">
              ⭐ {item.rating}
            </span>
          </div>

          {/* USER + TIME */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>
              👤 {item.createdBy || "Ẩn danh"}
            </span>

            <span>
              ⏱{" "}
              {item.createdAt?.toDate
                ? item.createdAt
                  .toDate()
                  .toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })
                : ""}
            </span>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded-xl">
              📍 Xem trên map
            </button>

            <button className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-xl">
              ❤️ Yêu thích
            </button>
          </div>

          {/* COMMENT TITLE */}
          <h3 className="font-semibold mt-4">
            💬 Bình luận
          </h3>

          {/* COMMENTS */}
          <Comments restaurantId={item.id} />
        </div>
      </div>
    </div>
  );
}