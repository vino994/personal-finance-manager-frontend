import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ChartCard from "../components/ChartCard";
import { Bar } from "react-chartjs-2";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Budgets() {
  const { user } = useAuth();

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("monthly");

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const budRes = await api.get("/budgets");
      const expRes = await api.get("/expenses");

      // handle both {data} and {success,data}
      setBudgets(budRes.data || []);
      setExpenses(expRes.data || []);
    } catch (err) {
      console.error("Budget load error", err);
      setBudgets([]);
      setExpenses([]);
    }
  };

  // -----------------------------
  // ADD BUDGET
  // -----------------------------
  const addBudget = async (e) => {
    e.preventDefault();

    if (!category || !limit) {
      alert("Category & limit required");
      return;
    }

    try {
      const res = await api.post("/budgets", {
        category,
        limit: Number(limit),
        period,
      });

      setBudgets(prev => [...prev, res.data]);
      setShowModal(false);
      setCategory("");
      setLimit("");
      setPeriod("monthly");
    } catch (err) {
      console.error("Add budget error", err);
    }
  };

  // -----------------------------
  // CALCULATIONS
  // -----------------------------
  const getUsedAmount = (cat) =>
    expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);

  // -----------------------------
  // CHART
  // -----------------------------
  const chartData = {
    labels: budgets.map(b => b.category),
    datasets: [
      {
        label: "Budget Limit",
        data: budgets.map(b => b.limit),
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          New Budget
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LIST */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          {budgets.map((b) => {
            const used = getUsedAmount(b.category);
            const remaining = b.limit - used;
            const over = remaining < 0;

            return (
              <div key={b._id} className="border-b pb-3">
                <p className="font-semibold">
                  {b.category} ({b.period})
                </p>

                <p>
                  Limit: {formatCurrency(b.limit, user?.currency)}
                </p>

                <p>
                  Used: {formatCurrency(used, user?.currency)}
                </p>

                <p className={over ? "text-red-600" : "text-green-600"}>
                  Remaining: {formatCurrency(remaining, user?.currency)}
                </p>

                {over && (
                  <p className="text-red-500 text-sm">
                    ⚠ Budget Exceeded
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* CHART */}
        <ChartCard title="Budgets Overview">
          <Bar data={chartData} />
        </ChartCard>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={addBudget}
            className="bg-white p-6 rounded-xl w-80 space-y-3"
          >
            <h3 className="text-xl font-bold">Add Budget</h3>

            <select
              className="border p-2 rounded w-full"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              placeholder="Category"
              className="border p-2 rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              placeholder="Limit"
              type="number"
              className="border p-2 rounded w-full"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <button className="bg-indigo-600 text-white py-2 rounded w-full">
              Add Budget
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
