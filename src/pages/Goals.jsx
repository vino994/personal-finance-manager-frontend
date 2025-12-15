import React, { useEffect, useState } from "react";
import api from "../utils/api";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function Goals() {
  const { user } = useAuth();

  const [goals, setGoals] = useState([]);
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const res = await api.get("/goals");
    setGoals(res.data || []);
  };

  // ADD GOAL
  const addGoal = async (e) => {
    e.preventDefault();

    if (!title || !targetAmount) {
      alert("Title & Target Amount required");
      return;
    }

    const res = await api.post("/goals", {
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      deadline,
    });

    setGoals([...goals, res.data]);

    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline("");
    setShow(false);
  };

  // UPDATE PROGRESS
  const addProgress = async (goal, amount) => {
    const updated = await api.put(`/goals/${goal._id}`, {
      currentAmount: goal.currentAmount + amount,
    });

    setGoals(goals.map(g => g._id === goal._id ? updated.data : g));
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Financial Goals</h2>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          New Goal
        </button>
      </div>

      {/* GOALS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const pct = Math.min(
            Math.round((g.currentAmount / g.targetAmount) * 100),
            100
          );

          const remaining = g.targetAmount - g.currentAmount;

          return (
            <div key={g._id} className="bg-white p-4 rounded-xl shadow space-y-2">
              <h3 className="font-bold">{g.title}</h3>

              <p className="text-sm text-gray-600">
                {formatCurrency(g.currentAmount, user?.currency)} /{" "}
                {formatCurrency(g.targetAmount, user?.currency)}
              </p>

              <p className="text-xs text-gray-500">
                Remaining: {formatCurrency(remaining, user?.currency)}
              </p>

              <p className="text-xs text-gray-400">
                Deadline: {g.deadline
                  ? dayjs(g.deadline).format("MMM D, YYYY")
                  : "—"}
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="text-xs">{pct}% completed</p>

              {/* ADJUST PLAN */}
              <button
                onClick={() => addProgress(g, 1000)}
                className="text-sm text-indigo-600"
              >
                + Add {formatCurrency(1000, user?.currency)}
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD GOAL MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            className="bg-white p-6 rounded-xl w-80 space-y-3"
            onSubmit={addGoal}
          >
            <h3 className="text-xl font-bold">Add Goal</h3>

            <input
              placeholder="Goal Title"
              className="border p-2 rounded w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Target Amount"
              type="number"
              className="border p-2 rounded w-full"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />

            <input
              placeholder="Current Amount"
              type="number"
              className="border p-2 rounded w-full"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />

            <input
              type="date"
              className="border p-2 rounded w-full"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <button className="bg-indigo-600 w-full text-white py-2 rounded">
              Add Goal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
