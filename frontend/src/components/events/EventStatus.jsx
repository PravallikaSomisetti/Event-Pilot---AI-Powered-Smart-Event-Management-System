function EventStatus({ status }) {

  const colors = {
    Upcoming: "bg-blue-100 text-blue-700",
    Open: "bg-green-100 text-green-700",
    Completed: "bg-gray-200 text-gray-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default EventStatus;