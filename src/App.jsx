import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import Map from "./components/Map";
import Category from "./components/Category";
import List from "./components/List";
import AddRestaurant from "./components/AddRestaurant";

function App() {
  const [selected, setSelected] = useState("Tất cả");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [showForm, setShowForm] = useState(false); // 🔥

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

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold p-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow">
        🍜 Food Map by QH
      </h1>

      <div className="flex justify-end px-3 mt-2">
        <button
          onClick={() => setShowMap(!showMap)}
          className="text-sm bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
        >
          {showMap ? "🗺️ Ẩn map" : "📍 Hiện map"}
        </button>
      </div>
      <Category
        selected={selected}
        setSelected={(value) => {
          setSelected(value);
          setSelectedPlace(null);
        }}
      />
      {showMap && (
        <div className="relative z-0">
          <div className="p-3">
            <Map data={filtered} selectedPlace={selectedPlace} />
          </div>
        </div>
      )}
      <List data={filtered} onSelect={setSelectedPlace} />

      {/* FORM */}
      {showForm && <AddRestaurant onClose={() => setShowForm(false)} />}

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-5 right-5 bg-black text-white w-14 h-14 rounded-full text-2xl shadow-lg"
      >
        +
      </button>
    </div>
  );
}

export default App;