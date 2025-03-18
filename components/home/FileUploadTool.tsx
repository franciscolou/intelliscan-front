import { ChangeEvent } from "react";

interface FileUploadProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  validFile: boolean;
  setValidFile: (valid: boolean) => void;
  selectedFile: File | null;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isUploading: boolean;
  fileName: string;
}

const FileUpload = ({
  documentName,
  setDocumentName,
  validFile,
  setValidFile,
  selectedFile,
  handleFileChange,
  handleSubmit,
  isUploading,
  fileName,
}: FileUploadProps) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center">
      <div className="flex flex-row gap-4 items-center">
        <label
          htmlFor="fileInput"
          className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer shadow-md"
        >
          Upload file
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFileChange(e);
              if (e.target.files?.[0]) {
                setDocumentName(e.target.files[0].name);
              }
            }}
          />
        </label>
        <input
          type="text"
          value={documentName}
          maxLength={40}
          onChange={(e) => {
            setDocumentName(e.target.value);
            setValidFile(!!e.target.value);
            }}
            placeholder="Enter document name..."
            className="rounded border border-gray-300 p-2 bg-gray-100 w-32 sm:w-64 placeholder:text-xs sm:placeholder:text-base"
            disabled={!selectedFile}
          />
        <button
          id="submitButton"
          className={`rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center ${
            isUploading
              ? "bg-blue-400 cursor-not-allowed"
              : validFile && documentName
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          } text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 shadow-md`}
          disabled={!validFile || !documentName || isUploading}
          onClick={handleSubmit}
        >
          {isUploading ? (
            <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
      {selectedFile && (
        <div className="text-xs text-gray-500 mt-2">
          Selected file: {fileName}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
