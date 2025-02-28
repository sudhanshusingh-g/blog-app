import React from "react";

function DeleteDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-black dark:text-white">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDialog;
