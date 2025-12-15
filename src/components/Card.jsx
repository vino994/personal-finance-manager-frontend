export default function Card({ title, value, color }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
