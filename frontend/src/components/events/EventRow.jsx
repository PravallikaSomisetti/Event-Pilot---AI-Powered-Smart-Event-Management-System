import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import EventStatus from "./EventStatus";

function EventRow({ event }) {
  return (
    <tr className="border-b hover:bg-slate-50 transition">

      <td className="py-4 px-5 text-3xl">
        {event.icon}
      </td>

      <td className="py-4 font-semibold">
        {event.name}
      </td>

      <td>{event.date}</td>

      <td>{event.venue}</td>

      <td>
        <EventStatus status={event.status} />
      </td>

      <td>

        <div className="flex gap-3">

          <button className="text-blue-600 hover:text-blue-800">
            <Eye size={18} />
          </button>

          <button className="text-green-600 hover:text-green-800">
            <Pencil size={18} />
          </button>

          <button className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}

export default EventRow;