import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Comments({ restaurantId }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  // 🔥 load comments realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "restaurants", restaurantId, "comments"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(data);
      }
    );

    return () => unsubscribe();
  }, [restaurantId]);

  // 🔥 add comment
  const handleAdd = async () => {
    if (!text) return;

    await addDoc(
      collection(db, "restaurants", restaurantId, "comments"),
      {
        text,
        user: "Ẩn danh",
        createdAt: serverTimestamp(),
      }
    );

    setText("");
  };

  return (
    <div className="mt-3 space-y-2">
      {/* input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bình luận..."
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Gửi
        </button>
      </div>

      {/* list comment */}
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm">{c.text}</p>
            <p className="text-xs text-gray-400">
              👤 {c.user} •{" "}
              {c.createdAt?.toDate
                ? c.createdAt.toDate().toLocaleString("vi-VN")
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}