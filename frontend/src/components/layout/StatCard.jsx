function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition">
      <div>
        <p className="text-gray-500">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;