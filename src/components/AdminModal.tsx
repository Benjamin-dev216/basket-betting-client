import React from "react";
import { useTranslation } from "react-i18next";

type AdminModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, children }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h3 className="m-4 text-2xl">{t("pleaseInputUserData")}</h3>
        {children}
      </div>
    </div>
  );
};

export default AdminModal;
