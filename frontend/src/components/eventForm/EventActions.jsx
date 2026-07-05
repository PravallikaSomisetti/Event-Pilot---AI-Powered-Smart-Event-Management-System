import { useNavigate } from "react-router-dom";

function EventActions({ eventData }) {
  const navigate = useNavigate();

  const handleCreate = () => {
    const events =
      JSON.parse(localStorage.getItem("events")) || [];

    events.push({
      id: Date.now(),
      ...eventData,
      status: "Upcoming",
    });

    localStorage.setItem("events", JSON.stringify(events));

    alert("Event Created Successfully!");

    navigate("/events");
  };

  return (
    <div className="flex justify-end gap-4">
      <button
        className="px-6 py-3 rounded-lg border"
        onClick={() => navigate("/events")}
      >
        Cancel
      </button>

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Create Event
      </button>
    </div>
  );
}

export default EventActions;