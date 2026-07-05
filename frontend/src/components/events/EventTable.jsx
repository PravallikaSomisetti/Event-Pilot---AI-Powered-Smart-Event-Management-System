import EventRow from "./EventRow";

function EventTable() {

  const events = [

    {
      icon: "🧠",
      name: "AI Workshop",
      date: "12 Jul 2026",
      venue: "Hall A",
      status: "Upcoming",
    },

    {
      icon: "💻",
      name: "Hackathon",
      date: "15 Jul 2026",
      venue: "Lab 5",
      status: "Open",
    },

    {
      icon: "🎉",
      name: "Tech Fest",
      date: "22 Jul 2026",
      venue: "College Ground",
      status: "Completed",
    },

    {
      icon: "🚀",
      name: "Startup Expo",
      date: "28 Jul 2026",
      venue: "Seminar Hall",
      status: "Upcoming",
    },

  ];

  return (

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="text-left px-5 py-4">Banner</th>

            <th className="text-left">Event</th>

            <th className="text-left">Date</th>

            <th className="text-left">Venue</th>

            <th className="text-left">Status</th>

            <th className="text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {events.map((event, index) => (
            <EventRow
              key={index}
              event={event}
            />
          ))}

        </tbody>

      </table>

      <div className="p-5 border-t text-gray-500">
        Showing {events.length} events
      </div>

    </div>

  );
}

export default EventTable;