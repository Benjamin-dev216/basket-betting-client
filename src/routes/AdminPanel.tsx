// src/pages/AdminPanel.tsx
import React, { useEffect, useState } from "react";
import AdminModal from "../components/AdminModal";
import UserForm from "../components/UserForm";
import { addUser, deleteUser, fetchUser, updateUser } from "../api/user";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export interface User {
  id: string;
  email: string;
  role: string;
  balance: number;
  pendingTime1: number;
  pendingTime2: number;
}

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await fetchUser();
      setUsers(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (user: User) => {
    if (user.id) {
      await updateUser(user);
      setUsers(
        users.map((item) => (item.id === user.id ? { ...item, ...user } : item))
      );
    } else {
      await addUser(user);
      setUsers([...users, user]);
    }
    fetchUsers();
    setModalOpen(false);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
    toast.success("User deleted");
  };
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  return (
    <div className="p-6 min-h-[calc(100vh-112px)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">
          {t("adminPanel.title")}
        </h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + {t("adminPanel.newUser")}
        </button>
      </div>

      <table className="w-full text-sm border border-[#6e6358] rounded-md overflow-hidden table-fixed">
        <thead className="bg-[#5a5149] text-[#f1e7d0]">
          <tr>
            <th className="p-3 text-center w-1/5">{t("adminPanel.email")}</th>
            <th className="p-3 text-center w-1/6">{t("adminPanel.balance")}</th>
            <th className="p-3 text-center w-1/6">
              {t("adminPanel.pending1")}
            </th>
            <th className="p-3 text-center w-1/6">
              {t("adminPanel.pending2")}
            </th>
            <th className="p-3 text-center w-1/6">{t("adminPanel.role")}</th>
            <th className="p-3 text-center w-1/6">{t("adminPanel.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#6e6358]">
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={index % 2 === 0 ? "bg-[#3f3932]" : "bg-[#474134]"}
            >
              <td className="p-3 text-[#e0d9cd] break-all">{user.email}</td>
              <td className="p-3 text-[#e0d9cd]">{user.balance}</td>
              <td className="p-3 text-[#e0d9cd]">{user.pendingTime1}</td>
              <td className="p-3 text-[#e0d9cd]">{user.pendingTime2}</td>
              <td className="p-3 text-[#e0d9cd] capitalize">{user.role}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-orange-400 hover:underline mr-2"
                >
                  {t("adminPanel.edit")}
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="text-red-400 hover:underline"
                >
                  {t("adminPanel.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AdminModal isOpen={modalOpen}>
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </AdminModal>

      {confirmOpen && userToDelete && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-[#2f2b28] text-white p-6 rounded-xl shadow-2xl border border-gray-600 w-80">
            <h2 className="text-lg font-semibold mb-4">
              {t("adminPanel.confirmDelete")}
            </h2>
            <p className="mb-4">
              {t("adminPanel.confirmDeleteMessage")}{" "}
              <strong>{userToDelete.email}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
                onClick={() => setConfirmOpen(false)}
              >
                {t("adminPanel.cancel")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                onClick={() => {
                  handleDelete(userToDelete.id);
                  setConfirmOpen(false);
                }}
              >
                {t("adminPanel.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

// src/components/UserForm.tsx
