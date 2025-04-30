import React, { useState, useEffect } from "react";

interface Props {
  user: any;
  onSave: (user: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
    role: "user",
    balance: 0,
    pendingTime1: 3,
    pendingTime2: 5,
  });

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-4"
    >
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      {!user && (
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      )}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <input
        name="balance"
        type="number"
        placeholder="Balance"
        value={form.balance}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        name="pendingTime1"
        type="number"
        placeholder="Pending Time 1"
        value={form.pendingTime1}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        name="pendingTime2"
        type="number"
        placeholder="Pending Time 2"
        value={form.pendingTime2}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UserForm;

// src/components/AdminModal.tsx
