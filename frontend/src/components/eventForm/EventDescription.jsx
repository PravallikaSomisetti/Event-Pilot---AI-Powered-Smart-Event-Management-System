function EventDescription() {
  return (
    <div>

      <label className="block mb-2 font-semibold">
        Description
      </label>

      <textarea
        rows="6"
        placeholder="Describe your event..."
        className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>

    </div>
  );
}

export default EventDescription;