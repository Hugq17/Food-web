export default function Category({ selected, setSelected }) {
  const categories = [
    { name: "Tất cả", icon: "🍽️" },
    { name: "Bún/Phở", icon: "🍜" },
    { name: "Ăn vặt", icon: "🍟" },
    { name: "Cà phê", icon: "☕" },
    { name: "Gà rán", icon: "🍗" },
    { name: "Sushi", icon: "🍣" },
  ];

  return (
    <div className="px-3 py-2 bg-gray-100 sticky top-0 z-10">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelected(cat.name)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 shadow-sm ${selected === cat.name
                ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white scale-105 shadow"
                : "bg-white border border-gray-200 text-gray-700"
              }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}