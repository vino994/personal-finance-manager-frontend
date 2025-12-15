export default function Toast({ message, type = "success", onClose }) {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={`px-4 py-3 rounded shadow text-white ${
          type === "error" ? "bg-red-600" : "bg-emerald-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{message}</span>
          <button onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}
