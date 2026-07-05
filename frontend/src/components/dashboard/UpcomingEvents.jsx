function UpcomingEvents() {
  const events = [
    {
      name: "AI Workshop",
      date: "Tomorrow",
      participants: 120,
      status: "Upcoming",
    },
    {
      name: "Hackathon",
      date: "15 Jul",
      participants: 350,
      status: "Open",
    },
    {
      name: "Tech Fest",
      date: "22 Jul",
      participants: 850,
      status: "Popular",
    },
    {
      name: "Startup Expo",
      date: "28 Jul",
      participants: 450,
      status: "Upcoming",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Upcoming Events
        </h2>

        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b text-slate-500">

              <th className="text-left py-3 w-[45%]">
                Event
              </th>

              <th className="text-left py-3 w-[20%]">
                Date
              </th>

              <th className="text-center py-3 w-[20%]">
                Participants
              </th>

              <th className="text-right py-3 w-[15%]">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {events.map((event, index) => (

              <tr
                key={index}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="py-5 font-semibold text-slate-700 whitespace-nowrap">
                  {event.name}
                </td>

                <td className="py-5 text-slate-500 whitespace-nowrap">
                  {event.date}
                </td>

                <td className="py-5 text-center font-semibold">
                  {event.participants}
                </td>

                <td className="py-5 text-right">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "Popular"
                        ? "bg-orange-100 text-orange-600"
                        : event.status === "Open"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {event.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default UpcomingEvents;