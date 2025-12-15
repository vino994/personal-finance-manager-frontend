import { useEffect, useState } from "react";
import api from "../utils/api";
import { formatCurrency } from "../utils/formatCurrency";
import { useAuth } from "../context/AuthContext";
export default function Income() {
  const [income, setIncome] = useState([]);
  const [form, setForm] = useState({ source: "", amount: "" });
const { user } = useAuth();
  useEffect(() => {
 api.get("/income").then(res => {
  setIncome(Array.isArray(res.data) ? res.data : []);
});
  }, []);

  const addIncome = async () => {
    if (!form.source || !form.amount) return alert("Fill all fields");

    const res = await api.post("/income", form);
    setIncome(prev => [...prev, res.data]);
    setForm({ source: "", amount: "" });
  };

return (
  <div className="p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-4">Income</h1>

    {/* ADD FORM */}
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        placeholder="Source"
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={addIncome}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        Add Income
      </button>
    </div>

    {/* LIST */}
    <ul className="space-y-2">
      {income.map((i) => (
        <li
          key={i._id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <span>{i.source}</span>
          <span className="font-semibold">
            {formatCurrency(i.amount, user?.currency)}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

}
