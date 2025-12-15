import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { formatCurrency } from "../utils/formatCurrency";
import { useAuth } from "../context/AuthContext";

export default function Expenses() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const res = await api.get("/expenses");
    const list = Array.isArray(res.data) ? res.data : [];
    setExpenses(list);
    setAllExpenses(list);
  };

  /* ADD / UPDATE */
  const submitExpense = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      amount,
      category,
      date,
      isRecurring,
      frequency: isRecurring ? "monthly" : null,
    };

    let res;
    if (editing) {
      res = await api.put(`/expenses/${editing._id}`, payload);
      setExpenses(expenses.map((e) => (e._id === editing._id ? res.data : e)));
      setAllExpenses(allExpenses.map((e) => (e._id === editing._id ? res.data : e)));
    } else {
      res = await api.post("/expenses", payload);
      setExpenses([...expenses, res.data]);
      setAllExpenses([...allExpenses, res.data]);
    }

    resetForm();
  };

  /* DELETE */
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    setExpenses(expenses.filter((e) => e._id !== id));
    setAllExpenses(allExpenses.filter((e) => e._id !== id));
  };

  const startEdit = (e) => {
    setEditing(e);
    setTitle(e.title);
    setAmount(e.amount);
    setCategory(e.category);
    setDate(e.date.split("T")[0]);
    setDescription(e.description);
    setIsRecurring(e.isRecurring);
    setShow(true);
  };

  const resetForm = () => {
    setShow(false);
    setEditing(null);
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
    setIsRecurring(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => setShow(true)}
        >
          Add Expense
        </button>
      </div>

      {/* FILTER */}
      <select
        className="border p-2 rounded w-full sm:w-60"
        onChange={(e) =>
          setExpenses(
            e.target.value
              ? allExpenses.filter((x) => x.category === e.target.value)
              : allExpenses
          )
        }
      >
        <option value="">All Categories</option>
        {[...new Set(allExpenses.map((e) => e.category))].map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      {/* 🖥 DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl">
          <thead>
            <tr className="border-b">
              {["Title", "Amount", "Category", "Date", "Recurring", "Actions"].map((h) => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id} className="border-b">
                <td className="p-3">{e.title}</td>
                <td className="p-3">{formatCurrency(e.amount, user?.currency)}</td>
                <td className="p-3">{e.category}</td>
                <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-3">{e.isRecurring ? "Yes" : "No"}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => startEdit(e)} className="text-blue-600">Edit</button>
                  <button onClick={() => deleteExpense(e._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {expenses.map((e) => (
          <div key={e._id} className="bg-white rounded-xl shadow p-4 space-y-2">
            <p className="font-semibold">{e.title}</p>
            <p>{formatCurrency(e.amount, user?.currency)}</p>
            <p className="text-sm text-gray-500">{e.category}</p>
            <p className="text-sm">{e.description}</p>
            <p className="text-sm">{new Date(e.date).toLocaleDateString()}</p>

            <div className="flex justify-end gap-4">
              <button onClick={() => startEdit(e)} className="text-blue-600">Edit</button>
              <button onClick={() => deleteExpense(e._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={submitExpense}
            className="bg-white p-4 rounded-xl w-full max-w-sm space-y-3"
          >
            <h3 className="text-xl font-bold">
              {editing ? "Edit Expense" : "Add Expense"}
            </h3>

            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="input" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
              Recurring (Monthly)
            </label>

            <div className="flex gap-2">
              <button className="bg-indigo-600 text-white py-2 rounded w-full">
                {editing ? "Update" : "Add"}
              </button>
              <button type="button" onClick={resetForm} className="border py-2 rounded w-full">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
