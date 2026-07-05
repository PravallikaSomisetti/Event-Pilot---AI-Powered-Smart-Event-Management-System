import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", attendance: 70 },
  { month: "Feb", attendance: 82 },
  { month: "Mar", attendance: 90 },
  { month: "Apr", attendance: 86 },
  { month: "May", attendance: 94 },
  { month: "Jun", attendance: 98 },
];

function AttendanceChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-xl font-bold mb-5">
        Attendance Trends
      </h2>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;