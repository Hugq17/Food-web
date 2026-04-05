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
                    <div key={c.id} className="flex gap-2 items-start">
                        {/* AVATAR */}
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                            {c.user?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        {/* CONTENT */}
                        <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-[80%]">
                            {/* NAME */}
                            <p className="text-xs font-semibold text-gray-800">
                                {c.user || "Ẩn danh"}
                            </p>

                            {/* TEXT */}
                            <p className="text-sm text-gray-700">{c.text}</p>

                            {/* TIME */}
                            <p className="text-[10px] text-gray-400 mt-1">
                                {c.createdAt?.toDate
                                    ? c.createdAt
                                        .toDate()
                                        .toLocaleString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "2-digit",
                                        })
                                    : ""}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}