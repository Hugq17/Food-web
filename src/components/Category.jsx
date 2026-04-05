export default function Category({ selected, setSelected }) {
  const categories = ["Tất cả", "Bún/Phở", "Ăn vặt", "Cà phê"];

  return (
    <div className="flex gap-2 overflow-x-auto p-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selected === cat
              ? "bg-black text-white"
              : "bg-white border"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}