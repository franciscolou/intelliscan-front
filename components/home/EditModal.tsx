import React from 'react';

interface EditModalProps {
  isOpen: boolean;
  documentTitle: string;
  newDocumentName: string;
  setNewDocumentName: React.Dispatch<React.SetStateAction<string>>;
  handleEditConfirm: () => void;
  handleClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, 
  documentTitle, 
  newDocumentName, 
  setNewDocumentName, 
  handleEditConfirm, 
  handleClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 break-words">Edit document '{documentTitle}'</h2>
        <input
          type="text"
          value={newDocumentName}
          maxLength={40}
          onChange={(e) => setNewDocumentName(e.target.value)}
          placeholder="Enter new document name..."
          className="border border-gray-300 p-2 mb-4 w-full rounded outline-none"
        />
        <div className="flex justify-end">
            <button
            onClick={handleEditConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2 transition duration-300 ease-in-out hover:bg-blue-700 cursor-pointer"
            >
            Confirm
            </button>
            <button
            onClick={handleClose}
            className="bg-gray-300 text-black px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-gray-400 cursor-pointer"
            >
            Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;