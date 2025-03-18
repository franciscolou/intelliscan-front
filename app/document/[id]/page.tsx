"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/Header";
import DocumentContent from "../../../components/document/DocumentContent";
import ChatSection from "../../../components/document/ChatSection";
import ErrorState from "../../../components/ErrorState";
import LoadingScreen from "../../../components/LoadingScreen";

interface Interaction {
  prompt: string;
  answer: string;
}

interface Document {
  id: string;
  title: string;
  image: string;
  content: string;
  interactions: Interaction[];
}

export default function DocumentPage() {
  const root = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const params = useParams();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchDocument = async () => {
      if (params.id && token) {
        try {
          const response = await fetch(`${root}/document/${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            const errorData = await response.json();
            setLoading(false);
            setError(errorData.message || "Failed to fetch document");
            throw new Error(errorData.message || "Failed to fetch document");
          }
          const data = await response.json();
          if (!data.interactions) {
            data.interactions = [];
          }
          setDocument(data);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error fetching document:", error);
            setError(error.message);
          } else {
            console.error("Unexpected error:", error);
            setError("An unexpected error occurred");
          }
        }
      } else if (!params.id || !token) {
        setError("You must log in before trying to access a document");
      } else {
        setError("No document ID or token found");
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(`${root}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!response.ok) throw new Error("Error fetching user information");

      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching user information:", error);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    const fetchData = async () => {
      await fetchDocument();
      await fetchUser();
      setLoading(false);
    };

    fetchData();
  }, [params.id, router, root]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [document?.interactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("access_token");
    if (e.key === "Enter" && inputValue.trim()) {
      const prompt = inputValue.trim();
      setInputValue("");
      setIsSending(true);

      const newInteraction: Interaction = { prompt, answer: "" };
      setDocument((prevDocument) => {
        if (!prevDocument) return null;
        return {
          ...prevDocument,
          interactions: [...prevDocument.interactions, newInteraction],
        };
      });

      try {
        const response = await fetch(`${root}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            content: document?.content,
            documentId: document?.id,
          }),
        });

        const data = await response.json();
        const answer = data.answer;

        setDocument((prevDocument) => {
          if (!prevDocument) return null;
          const updatedInteractions = prevDocument.interactions.map((interaction) =>
            interaction.prompt === prompt ? { ...interaction, answer } : interaction
          );
          return {
            ...prevDocument,
            interactions: updatedInteractions,
          };
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error sending prompt:", error);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!document) return <div>Document not found</div>;

  return (
    <div className="outer-container font-[family-name:var(--font-geist-sans)] bg-gray-50 min-h-screen">
      <Header handleLogout={() => {
        localStorage.removeItem("access_token");
        router.push("/auth/login");
      }} />
      <main className="flex flex-wrap justify-between items-center sm:items-start p-8 pb-20 sm:p-20 min-h-screen w-full bg-gray-100">
        <div className="w-full pl-4"></div>
        <img
          src="/icons/back.svg"
          alt="Back"
          className="w-6 h-6 cursor-pointer mb-4 ml-4"
          onClick={() => router.back()}
        />
        <h1 className="text-2xl font-bold mb-4 mt-4 border-b border-gray-300 pb-2 w-full pl-4">
          {document.title}
        </h1>
        <div className="flex w-full h-full">
          <DocumentContent document={document} />
          <ChatSection
            document={document}
            interactions={document.interactions}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            isSending={isSending}
          />
        </div>
      </main>
    </div>
  );
}