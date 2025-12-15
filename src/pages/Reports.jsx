import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import api from "../utils/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";

ChartJS.register(ArcElement, Tooltip, Legend);
pdfMake.vfs = pdfFonts.vfs;

export default function Reports() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const exp = await api.get("/expenses");
    const inc = await api.get("/income");
    const bud = await api.get("/budgets");
    setExpenses(exp.data || []);
    setIncome(inc.data || []);
    setBudgets(bud.data || []);
  };

  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return (!from || d >= new Date(from)) && (!to || d <= new Date(to));
  });

  const totalExpense = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const savings = totalIncome - totalExpense;

  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6"],
      },
    ],
  };

  const download = (content, name) => {
    const blob = new Blob([content], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  };

  const exportExpenseCSV = () =>
    download(Papa.unparse(filteredExpenses), "expenses.csv");

  const exportIncomeCSV = () =>
    download(Papa.unparse(income), "income.csv");

  const exportPDF = () => {
    pdfMake
      .createPdf({
        content: [
          { text: "Financial Report", style: "header" },
          {
            table: {
              widths: ["*", "auto"],
              body: [
                ["Total Income", formatCurrency(totalIncome, user?.currency)],
                ["Total Expenses", formatCurrency(totalExpense, user?.currency)],
                ["Savings", formatCurrency(savings, user?.currency)],
              ],
            },
          },
        ],
        styles: {
          header: { fontSize: 18, bold: true, marginBottom: 10 },
        },
      })
      .download("financial-report.pdf");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold">Financial Reports</h1>

      {/* DATE FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="date" className="border p-2 rounded w-full sm:w-auto" onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className="border p-2 rounded w-full sm:w-auto" onChange={(e) => setTo(e.target.value)} />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Income" value={formatCurrency(totalIncome, user?.currency)} />
        <Card title="Expenses" value={formatCurrency(totalExpense, user?.currency)} />
        <Card title="Savings" value={formatCurrency(savings, user?.currency)} />
      </div>

      {/* CHART */}
      <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
        <h3 className="font-bold mb-2 text-center">Expense by Category</h3>
        <div className="relative w-full aspect-square">
          <Pie data={pieData} />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={exportExpenseCSV} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Expense CSV
        </button>
        <button onClick={exportIncomeCSV} className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Income CSV
        </button>
        <button onClick={exportPDF} className="bg-purple-600 text-white px-4 py-2 rounded w-full">
          Full PDF
        </button>
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);
