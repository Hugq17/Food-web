import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import Category from "./components/Category";
import List from "./components/List";
import AddRestaurant from "./components/AddRestaurant";
import RestaurantDetail from "./components/RestaurantDetail";

function App() {
  const [selected, setSelected] = useState("Tất cả");
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "restaurants"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered =
  selected === "Tất cả"
    ? restaurants
    : restaurants.filter((r) => r.category === selected);

// 🔥 sort mới nhất lên đầu
const sorted = [...filtered].sort((a, b) => {
  return (
    (b.createdAt?.seconds || 0) -
    (a.createdAt?.seconds || 0)
  );
});

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {/* HEADER */}
      <h1 className="sticky top-0 z-20 text-xl font-bold p-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow">
        🍜 Food Map by QH
      </h1>

      {/* CATEGORY */}
      <Category
        selected={selected}
        setSelected={setSelected}
      />

      {/* LIST */}
      <List
        data={sorted}
        onSelectDetail={(item) => setSelectedDetail(item)}
      />

      {/* DETAIL */}
      {selectedDetail && (
        <RestaurantDetail
          item={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {/* FORM */}
      {showForm && (
        <AddRestaurant onClose={() => setShowForm(false)} />
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-500 to-blue-400 text-white w-14 h-14 rounded-full text-2xl shadow-lg flex items-center justify-center transition hover:scale-110 active:scale-95"
      >
        +
      </button>
    </div>
  );
}

export default App;