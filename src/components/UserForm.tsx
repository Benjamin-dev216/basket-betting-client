import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  user: any;
  onSave: (user: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ user, onSave, onCancel }) => {
  const { t } = useTranslation();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        placeholder={t("userForm.emailPlaceholder")}
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

      {!user && (
        <input
          name="password"
          type="password"
          placeholder={t("userForm.passwordPlaceholder")}
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
        <option value="user">{t("userForm.roleUser")}</option>
        <option value="admin">{t("userForm.roleAdmin")}</option>
      </select>

      <input
        name="balance"
        type="number"
        placeholder={t("userForm.balancePlaceholder")}
        value={form.balance}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        name="pendingTime1"
        type="number"
        placeholder={t("userForm.pendingTime1Placeholder")}
        value={form.pendingTime1}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        name="pendingTime2"
        type="number"
        placeholder={t("userForm.pendingTime2Placeholder")}
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
          {t("userForm.cancelButton")}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {t("userForm.saveButton")}
        </button>
      </div>
    </form>
  );
};

export default UserForm;

// src/components/AdminModal.tsx
