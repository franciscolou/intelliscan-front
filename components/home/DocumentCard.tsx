import React from 'react';

interface Document {
  id: number;
  title: string;
  image: string;
  lastActivity: Date;
}

interface DocumentCardProps {
  doc: Document;
  handleDocumentClick: (id: number) => void;
  handleEditClick: (id: number) => void;
  handleDeleteClick: (id: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc, handleDocumentClick, handleEditClick, handleDeleteClick }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md border border-gray-200 mx-auto mb-12 cursor-pointer overflow-hidden group transform transition-transform duration-300 hover:scale-105 w-10/12 sm:w-9/12 h-[60vh] md:h-[20vw] lg:w-8/12 xl:w-13vw"
      onClick={() => handleDocumentClick(doc.id)}
    >
      <div className="flex w-full justify-center items-center bg-gray-50 overflow-hidden group-hover:scale-110 transition-transform duration-300 sm:flex-grow md:h-[15vw]">
        <img src={doc.image} alt={doc.title} className="object-contain group-hover:scale-110 transition-transform duration-300 w-full h-full md" />
      </div>
      
      <div className="w-full flex flex-col justify-between bg-gray-100 border-t border-gray-200 p-2 relative sm:flex-grow md:h-[5vw]">
        <div className="flex flex-col">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold overflow-hidden overflow-ellipsis whitespace-nowrap">
            {doc.title}
          </h2>
        </div>
        
        {/* Last Activity section */}
        <div className="text-gray-400 w-full">
          <h6 className="text-xxs sm:text-xxs md:text-xxs lg:text-xxs xl:text-xs truncate">
            {doc.lastActivity
              ? new Date(doc.lastActivity).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Sem data"}
          </h6>
        </div>

        {/* Action buttons */}
        <div className="absolute right-0 top-0 h-full w-10 flex flex-col justify-center items-center bg-gray-100 p-2 space-y-2">
          <div className="flex flex-col items-center space-y-2">
            <img
              src="/icons/edit.svg"
              alt="Edit"
              className="h-7 w-7 cursor-pointer rounded-sm"
              style={{ filter: "brightness(0) invert(0.60)" }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(doc.id);
              }}
            />
            <img
              src="/icons/trash.svg"
              alt="Delete"
              className="h-7 w-7 cursor-pointer rounded-sm"
              style={{ filter: "brightness(0) invert(0.60)" }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(doc.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;