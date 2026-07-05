function EventDetails() {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 font-semibold">
          Event Name
        </label>

        <input
          type="text"
          placeholder="Enter event name"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div>

        <label className="block mb-2 font-semibold">
          Category
        </label>

        <select className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">

          <option>Workshop</option>

          <option>Seminar</option>

          <option>Hackathon</option>

          <option>Conference</option>

          <option>Fest</option>

        </select>

      </div>

      <div>

        <label className="block mb-2 font-semibold">
          Venue
        </label>

        <input
          type="text"
          placeholder="Venue"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div>

        <label className="block mb-2 font-semibold">
          Capacity
        </label>

        <input
          type="number"
          placeholder="200"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

    </div>
  );
}

export default EventDetails;