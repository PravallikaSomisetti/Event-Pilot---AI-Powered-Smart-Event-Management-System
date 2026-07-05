import { Users, Calendar, Brain, BarChart3 } from "lucide-react";

const stats = [
  {
    icon: <Calendar size={36} />,
    value: "500+",
    label: "Events",
  },
  {
    icon: <Users size={36} />,
    value: "25K+",
    label: "Participants",
  },
  {
    icon: <Brain size={36} />,
    value: "95%",
    label: "Prediction Accuracy",
  },
  {
    icon: <BarChart3 size={36} />,
    value: "100%",
    label: "Analytics",
  },
];

function Stats() {
  return (
    <section className="bg-white py-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-8">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-slate-50 rounded-2xl p-8 text-center shadow hover:shadow-xl transition"
          >

            <div className="text-blue-600 flex justify-center mb-4">

              {item.icon}

            </div>

            <h2 className="text-4xl font-bold">

              {item.value}

            </h2>

            <p className="text-gray-500 mt-2">

              {item.label}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Stats;