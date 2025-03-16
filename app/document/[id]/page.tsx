"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { arrayBufferToBase64 } from "../../utils";

interface Document {
  id: string;
  title: string;
  image: string;
  content: string;
  interactions: { prompt: string; answer: string }[];
}

interface User {
  name: string;
}

export default function DocumentPage() {
  const root = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

        const userData = await response.json();
        setUser(userData);
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

        const updatedDocument: Document = {
          id: document!.id,
          title: document!.title,
          image: document!.image,
          content: document!.content,
          interactions: [...(document?.interactions || []), { prompt, answer }],
        };
        setDocument(updatedDocument);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error sending prompt:", error);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const generatePDF = async (document: Document) => {
    if (!document) return;

    const doc = new jsPDF();

    if (document.image) {
      try {
        const imageBytes = await fetch(document.image).then((res) =>
          res.arrayBuffer()
        );
        const imageBase64 = await arrayBufferToBase64(imageBytes);

        const img = new Image();
        img.src = `data:image/png;base64,${imageBase64}`;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const pdfWidth = 180;
          const pdfHeight = pdfWidth / aspectRatio;

          doc.addImage(
            `data:image/png;base64,${imageBase64}`,
            "PNG",
            10,
            10,
            pdfWidth,
            pdfHeight
          );

          doc.addPage();
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("Extracted Text:", 10, 10);
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          const textLines = doc.splitTextToSize(document.content, 180);
          let textY = 20;
          textLines.forEach((line: string) => {
            if (textY > 280) {
              doc.addPage();
              textY = 10;
            }
            doc.text(line, 10, textY);
            textY += 10;
          });

          if (document.interactions.length > 0) {
            doc.addPage();
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Interaction", 10, 10);
            textY = 20;
            document.interactions.forEach(({ prompt, answer }) => {
              if (textY > 280) {
                doc.addPage();
                textY = 10;
              }
              doc.setFontSize(12);
              doc.setFont("helvetica", "bold");
              const promptLines = doc.splitTextToSize(`Question: ${prompt}`, 180);
              promptLines.forEach((line: string) => {
                if (textY > 280) {
                  doc.addPage();
                  textY = 10;
                }
                doc.text(line, 10, textY);
                textY += 10;
              });
              doc.setFont("helvetica", "normal");
              const answerLines = doc.splitTextToSize(`Answer: ${answer}`, 180);
              answerLines.forEach((line: string) => {
                if (textY > 280) {
                  doc.addPage();
                  textY = 10;
                }
                doc.text(line, 10, textY);
                textY += 10;
              });
              textY += 10;
            });
          }

          doc.save(`${document.title}.pdf`);
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error loading image:", error);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-800 border-t-transparent rounded-full mb-4"></div>
          <div className="text-2xl font-bold text-gray-800">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-lg text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-500 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }
  if (!document) return <div>Document not found</div>;

  return (
    <div className="outer-container font-[family-name:var(--font-geist-sans)] bg-gray-50 min-h-screen">
      <header className="top-0 left-0 p-4 border-b border-gray-300 bg-[white] shadow-md flex justify-between items-center">
        <img src="/logo/logo_black.png" alt="Logo" className="h-16 mr-4" />
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            router.push("/auth/login");
          }}
          className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white hover:bg-red-600 hover:text-white hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer shadow-md"
        >
          Logout
        </button>
      </header>
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
          <div
            className="w-3/10 p-4 overflow-y-auto bg-white shadow-lg rounded-lg"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <img
              src={document.image}
              alt={document.title}
              className="w-full rounded-lg shadow-lg"
            />
            <h2 className="text-xl font-semibold mt-4">Extracted text</h2>
            <p className="mt-2 whitespace-pre-line">{document.content}</p>
          </div>
          <div
            className="w-7/10 p-4 flex flex-col bg-white shadow-lg rounded-lg ml-4"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <h2 className="text-xl font-semibold sticky top-0 bg-white z-10">
              Ask for information
            </h2>
            <div className="flex-grow overflow-y-auto mt-4" ref={chatContainerRef}>
              {document.interactions.map((p, index) => (
                <div key={index} className="mb-4 flex flex-col items-end">
                  <div className="text-right bg-gray-200 p-2 rounded-lg inline-block max-w-full break-words mb-2 self-end">
                    <p>{p.prompt}</p>
                  </div>
                  <div className="text-left bg-gray-100 p-2 rounded-lg inline-block max-w-full break-words self-start whitespace-pre-line">
                    <p>{p.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center relative">
              <div className="flex-grow relative">
                <input
                  type="text"
                  className="w-full p-2 pl-4 border border-gray-300 rounded-full focus:outline-none pr-12"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full flex items-center ${
                    inputValue.trim()
                      ? "bg-black text-white cursor-pointer"
                      : "bg-gray-600 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    handleKeyPress({ key: "Enter" } as React.KeyboardEvent<HTMLInputElement>)
                  }
                  disabled={!inputValue.trim()}
                >
                  <img src="/icons/send_msg.svg" alt="Send" className="w-4 h-4 filter invert" />
                </button>
              </div>
              <button
                className="ml-4 px-4 py-2 bg-green-500 text-white rounded flex items-center cursor-pointer"
                onClick={() => generatePDF(document)}
              >
                Download
                <img src="/icons/download.svg" alt="Download" className="ml-2 w-4 h-4 filter invert" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}