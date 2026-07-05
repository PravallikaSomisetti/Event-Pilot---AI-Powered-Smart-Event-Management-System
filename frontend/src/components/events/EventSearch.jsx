import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EventSearch() {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    console.log("Navigating to Create Event...");
    navigate("/create-event");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Box */}
      <div className="flex items-center w-full md:w-96 bg-gray-100 rounded-xl px-4 py-3">
        <Search size={20} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search events..."
          className="ml-3 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Create Event Button */}
      <button
        type="button"
        onClick={handleCreateEvent}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300"
      >
        <Plus size={20} />
        Create Event
      </button>
    </div>
  );
}

export default EventSearch;