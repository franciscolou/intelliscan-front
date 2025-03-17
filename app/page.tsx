"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bytesToBase64 } from "./utils";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import DocumentCard from "../components/home/DocumentCard";
import EditModal from "../components/home/EditModal";
import DeleteModal from "../components/home/DeleteModal";
import FileUploadTool from "../components/home/FileUploadTool";

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
        setUser(userData);
      } catch (error) {
        console.error(error);
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
    return <LoadingScreen />;
  }

  return (
    <div className="outer-container font-[family-name:var(--font-geist-sans)] bg-gray-50 min-h-screen">
      <Header handleLogout={handleLogout} />
      <section className="top-16 left-0 p-4 bg-white shadow-sm">
        <h1 className="text-4xl font-bold text-gray-800">Hello, {user ? user.name : "you"}!</h1>
        <p className="mt-4 text-lg font-semibold text-gray-500">Your uploaded documents</p>
      </section>
      <main className="flex flex-wrap justify-between items-center sm:items-start p-8 pb-20 sm:p-20 min-h-screen w-full bg-gray-200">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <img src="/icons/file.svg" alt="Empty" className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">You don&apos;t have any documents yet.</h2>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-500 text-center">Upload your first one by submitting it below</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                handleDocumentClick={() => handleDocumentClick(doc.id)}
                handleEditClick={() => handleEditClick(doc.id)}
                handleDeleteClick={() => handleDeleteClick(doc.id)}
              />
            ))}
          </div>
        )}
      </main>
      <div className="fixed bottom-4 right-4 flex flex-col items-center">
        <div className="flex flex-row gap-4 items-center">
          <FileUploadTool 
              documentName={documentName}
              setDocumentName={setDocumentName}
              validFile={validFile}
              setValidFile={setValidFile}
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              isUploading={isUploading}
              fileName={fileName}
          />
        </div>
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
        <EditModal
        isOpen={isEditModalOpen}
        documentTitle={documents.find(doc => doc.id === currentDocumentId)?.title || ""}
        newDocumentName={newDocumentName}
        setNewDocumentName={setNewDocumentName}
        handleEditConfirm={handleEditConfirm}
        handleClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          documentTitle={documents.find(doc => doc.id === currentDocumentId)?.title || ""}
          handleDeleteConfirm={handleDeleteConfirm}
          handleClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}