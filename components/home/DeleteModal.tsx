import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  documentTitle: string;
  handleDeleteConfirm: () => void;
  handleClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ 
  isOpen, 
  documentTitle, 
  handleDeleteConfirm, 
  handleClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <p className="mb-4">Are you sure you want to delete &apos;{documentTitle}&apos;?</p>
        <div className="flex justify-end">
          <button
            onClick={handleDeleteConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded mr-2 cursor-pointer transition-colors duration-300 hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;