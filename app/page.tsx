"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bytesToBase64 } from "./utils";

interface Document {
  id: number;
  title: string;
  image: string;
  lastActivity: Date;
}

interface User {
  name: string;
}

export default function Home() {
  const root = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [validFile, setValidFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(null);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${root}/document/user/all`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!response.ok) throw new Error("Error searching for documents");

        const data = await response.json();

        const sorted_data = data.sort((a: Document, b: Document) => {
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        });

        setDocuments(sorted_data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUser = async () => {
      console.log("Fetching user information...");
      try {
        const response = await fetch(`${root}/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!response.ok) throw new Error("Error fetching user information");

        const userData = await response.json();
        console.log("User data fetched successfully:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    const fetchData = async () => {
      await fetchDocuments();
      await fetchUser();
      setLoading(false);
    };

    fetchData();
  }, [router, root]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValidFile(true);
      setSelectedFile(file);
    } else {
      setDocumentName("");
      setValidFile(false);
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
  
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      setUploadError(true);
      setTimeout(() => setUploadError(false), 7000);
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", documentName);
  
    setIsUploading(true);

    try {
      const response = await fetch(`${root}/document`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const newDocument = await response.json();
        const base64Image = await bytesToBase64(Object.values(newDocument.image));
        newDocument.image = `data:${newDocument.mimetype};base64,${base64Image}`;
        setDocuments((prevDocuments) => [newDocument, ...prevDocuments]);
        setValidFile(false);
        setDocumentName("");
        setSelectedFile(null);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 7000);
      } else {
        const errorData = await response.json();
        setUploadErrorMessage(errorData.message || "An unexpected error occurred");
        console.error("Failed to upload file");
        setUploadError(true);
        setTimeout(() => setUploadError(false), 7000);
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
      setUploadError(true);
      setTimeout(() => setUploadError(false), 7000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocumentClick = (id: number) => {
    router.push(`/document/${id}`);
  }
  
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/auth/login");
  };

  const handleEditClick = (id: number) => {
    setCurrentDocumentId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCurrentDocumentId(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!currentDocumentId || !newDocumentName) return;

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${root}/document/${currentDocumentId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newDocumentName }),
      });

      if (response.ok) {
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === currentDocumentId ? { ...doc, title: newDocumentName } : doc
          )
        );
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to edit document");
      }
    } catch (error) {
      console.error("Error editing document: ", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentDocumentId) return;

    const token = localStorage.getItem("access_token");

    console.log("currentDocumentId: ", currentDocumentId);

    try {
      const response = await fetch(`${root}/document/${currentDocumentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== currentDocumentId)
        );
        setIsDeleteModalOpen(false);
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="outer-container font-[family-name:var(--font-geist-sans)] bg-gray-50 min-h-screen">
      <header className="top-0 left-0 p-4 border-b border-gray-300 bg-[white] shadow-md flex justify-between items-center">
        <img src="/logo/logo_black.png" alt="Logo" className="h-16 mr-4" />
        <button
          onClick={handleLogout}
          className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white hover:bg-red-600 hover:text-white hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer shadow-md"
        >
          Logout
        </button>
      </header>
      <section className="top-16 left-0 p-4 bg-white shadow-sm">
        <h1 className="text-4xl font-bold text-gray-800">Hello, {user ? user.name : "you"}!</h1>
        <p className="mt-4 text-lg font-semibold text-gray-500">Your uploaded documents</p>
      </section>
      <main className="flex flex-wrap justify-between items-center sm:items-start p-8 pb-20 sm:p-20 min-h-screen w-full bg-gray-200">
        {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src="/icons/file.svg" alt="Empty" className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">You don't have any documents yet.</h2>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-500 text-center">Upload your first one by submitting it below</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {documents.map((doc) => (
              <div key={doc.id} 
                   className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md border border-gray-200 mx-auto mb-12 cursor-pointer overflow-hidden group transform transition-transform duration-300 hover:scale-105"
                   style={{ width: "13vw", height: "20vw" }}
                   onClick={() => handleDocumentClick(doc.id)}
              >
                <div className="flex w-full justify-center items-center bg-gray-50 overflow-hidden group-hover:scale-110 transition-transform duration-300" style={{ height: "15vw" }}>
                  <div className="flex-1 bg-gray-50"></div>
                  <img src={doc.image} alt={doc.title} className="object-contain group-hover:scale-110 transition-transform duration-300" />
                  <div className="flex-1 bg-gray-50"></div>
                </div>
                <div className="w-full flex flex-col justify-between bg-gray-100 border-t border-gray-200 p-2 relative flex-grow">
                  <div className="flex flex-col justify-between flex-grow h-full">
                    <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold" style={{ maxWidth: "calc(100% - 2rem)" }}>
                      {doc.title}
                    </h2>
                    <div className="text-xxs sm:text-xxs md:text-xxs lg:text-xxs xl:text-xs text-gray-400 mt-auto">
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
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start flex-shrink-0 h-full absolute right-0 top-0 bg-gray-100 pr-2 pt-2">
                    <img
                      src="/icons/edit.svg"
                      alt="Edit"
                      className="h-7 w-7 cursor-pointer self-center rounded-sm mb-4"
                      style={{ filter: "brightness(0) invert(0.60)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(doc.id);
                      }}
                    />
                    <img
                      src="/icons/trash.svg"
                      alt="Delete"
                      className="h-7 w-7 cursor-pointer self-center rounded-sm"
                      style={{ filter: "brightness(0) invert(0.60)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(doc.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
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
            className="rounded border border-gray-300 p-2 bg-gray-100"
            disabled={!selectedFile}
          />
            <button
            id="submitButton"
            className={`rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center ${isUploading ? 'bg-blue-400 cursor-not-allowed' : validFile && documentName ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 shadow-md`}
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
      {uploadSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded shadow-md">
          File uploaded successfully.
        </div>
      )}
      {uploadError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded shadow-md">
          {uploadErrorMessage}
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4 break-words">Edit document '{documents.find(doc => doc.id === currentDocumentId)?.title}'</h2>
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
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
            <p className="mb-4">Are you sure you want to delete '{documents.find(doc => doc.id === currentDocumentId)?.title}'?</p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}