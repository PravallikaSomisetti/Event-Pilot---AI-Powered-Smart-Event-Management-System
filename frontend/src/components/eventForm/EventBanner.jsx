import { UploadCloud } from "lucide-react";

function EventBanner() {
  return (
    <div>

      <label className="block text-lg font-semibold mb-3">
        Event Banner
      </label>

      <div className="border-2 border-dashed border-blue-300 rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">

        <UploadCloud size={50} className="text-blue-500 mb-3" />

        <p className="text-gray-500">
          Drag & Drop or Click to Upload Banner
        </p>

      </div>

    </div>
  );
}

export default EventBanner;