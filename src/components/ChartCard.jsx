export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
