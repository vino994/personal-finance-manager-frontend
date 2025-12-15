import { useEffect, useState } from "react";
import Card from "../components/Card";
import ChartCard from "../components/ChartCard";
import api from "../utils/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    expenses: [],
    totalExpense: 0,
    totalBudget: 0,
    totalIncome: 0,
    savings: 0,
    remainingBudget: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
   const [expRes, budRes, incRes] = await Promise.all([
  api.get("/expenses"),
  api.get("/budgets"),
  api.get("/income"),
]);
const expenses = Array.isArray(expRes.data) ? expRes.data : [];
const budgets = Array.isArray(budRes.data) ? budRes.data : [];
const income = Array.isArray(incRes.data) ? incRes.data : [];



        const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
        const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
        const totalIncome = income.reduce((s, i) => s + i.amount, 0);
        const savings = totalIncome - totalExpense;
        const remainingBudget = totalBudget - totalExpense;

        setStats({
          expenses,
          totalExpense,
          totalBudget,
          totalIncome,
          savings,
          remainingBudget,
        });
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;

  /* PIE CHART */
  const categoryMap = {};
  stats.expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#4F46E5",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#6366F1",
        ],
      },
    ],
  };

return (
  <div className="p-6">
    {/* MAIN GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT SIDE — DETAILS */}
      <div className="lg:col-span-2 space-y-6">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card
            title="Total Expenses"
            value={formatCurrency(stats.totalExpense, user?.currency)}
          />
          <Card
            title="Total Budget"
            value={formatCurrency(stats.totalBudget, user?.currency)}
          />
          <Card
            title="Remaining Budget"
            value={formatCurrency(stats.remainingBudget, user?.currency)}
          />
          <Card
            title="Income"
            value={formatCurrency(stats.totalIncome, user?.currency)}
          />
          <Card
            title="Savings"
            value={formatCurrency(stats.savings, user?.currency)}
          />
        </div>

        {/* OPTIONAL: recent expenses / notes later */}
      </div>

      {/* RIGHT SIDE — CHART */}
      <div className="lg:col-span-1">
        <ChartCard title="Expense Breakdown">
          <Pie data={pieData} />
        </ChartCard>
      </div>

    </div>
  </div>
);

}
