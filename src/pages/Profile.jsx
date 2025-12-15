import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency(user.currency || "INR");
      setNotifications(user.notifications ?? true);
      setProfileImage(user.profileImage || "");
    }
  }, [user]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api.put("/auth/profile", {
      name,
      currency,
      notifications,
      profileImage,
    });
    setUser(res.user);
    alert("Profile updated successfully ✅");
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      <form onSubmit={saveProfile} className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img src={profileImage || "https://via.placeholder.com/80"} className="w-20 h-20 rounded-full object-cover" />
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>

        <input className="input w-full" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input w-full bg-gray-100" value={user?.email || ""} disabled />

        <select className="input w-full" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
          Enable notifications
        </label>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
