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

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);

    // 👉 nếu đang ẩn map thì bật lên
    setShowMap(true);

    // 👉 scroll lên đầu
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      <h1 className="sticky top-0 z-20 text-xl font-bold p-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow">
        🍜 Food Map by QH
      </h1>

      <div className="flex justify-end px-3 mt-2">
        <button
          onClick={() => setShowMap(!showMap)}
          className="text-sm bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
        >
          {showMap ? "🗺️ Ẩn map" : "📍 Hiện map"}
        </button>
      </div>
     
      {showMap && (
        <div className="relative z-0">
          <div className="p-3">
            <Map data={filtered} selectedPlace={selectedPlace} />
          </div>
        </div>
      )}
       <Category
        selected={selected}
        setSelected={(value) => {
          setSelected(value);
          setSelectedPlace(null);
        }}
      />
      <List data={filtered} onSelect={handleSelectPlace} />

      {/* FORM */}
      {showForm && <AddRestaurant onClose={() => setShowForm(false)} />}

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