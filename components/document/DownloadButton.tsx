import { Document } from "../../types";

interface DownloadButtonProps {
  document: Document;
  generatePDF: (document: Document) => void;
}

const DownloadButton = ({ document, generatePDF }: DownloadButtonProps) => {
  return (
    <button
      className="px-4 py-2 bg-green-500 text-white rounded flex items-center cursor-pointer"
      onClick={() => generatePDF(document)}
    >
      Download
      <img src="/icons/download.svg" alt="Download" className="ml-2 w-4 h-4 filter invert" />
    </button>
  );
};

export default DownloadButton;
