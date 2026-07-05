function EventSchedule() {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 font-semibold">
          Event Date
        </label>

        <input
          type="date"
          className="w-full border rounded-xl p-3"
        />

      </div>

      <div>

        <label className="block mb-2 font-semibold">
          Event Time
        </label>

        <input
          type="time"
          className="w-full border rounded-xl p-3"
        />

      </div>

    </div>
  );
}

export default EventSchedule;