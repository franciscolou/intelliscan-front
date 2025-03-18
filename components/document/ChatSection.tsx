import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import DownloadButton from "./DownloadButton";
import { jsPDF } from "jspdf";
import { arrayBufferToBase64 } from "../../app/utils";

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

interface ChatSectionProps {
  document: Document;
  interactions: Interaction[];
  inputValue: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  isSending: boolean;
}

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

const ChatSection = ({
  document,
  interactions,
  inputValue,
  handleInputChange,
  handleKeyPress,
  isSending,
}: ChatSectionProps) => {
  const lastInteractionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastInteractionRef.current) {
      lastInteractionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [interactions]);

  return (
    <div
      className="w-7/10 p-4 flex flex-col bg-white shadow-lg rounded-lg ml-4"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      <h2 className="text-xl font-semibold sticky top-0 bg-white z-10">
        Ask for information
      </h2>
      <div className="flex-grow overflow-y-auto mt-4 relative">
        {interactions.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500">
              <p className="text-black font-bold">You haven&apos;t started a conversation yet</p>
              <p className="text-sm">Get started by typing a message below</p>
              <img src="/icons/chat.svg" alt="Chat Illustration" className="w-24 h-24 filter grayscale"/>
            </div>
        ) : (
          interactions.map((p, index) => (
            <div
              key={index}
              className="mb-4 flex flex-col items-end"
              ref={index === interactions.length - 1 ? lastInteractionRef : null}
            >
              <div className="text-right bg-gray-200 p-2 rounded-lg inline-block max-w-full break-words mb-2 self-end">
                <p>{p.prompt}</p>
              </div>
              <div className="text-left bg-gray-100 p-2 rounded-lg inline-block max-w-full break-words self-start whitespace-pre-line">
                <p>{p.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex items-center relative">
        <DownloadButton
          document={document}
          generatePDF={() => generatePDF(document)}
        />
        <div className="flex-grow relative ml-2">
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
              handleKeyPress({ key: "Enter" } as KeyboardEvent<HTMLInputElement>)
            }
            disabled={!inputValue.trim() || isSending}
          >
            {isSending ? (
              <div className="animate-spin h-4 w-4 border-4 border-white border-t-transparent rounded-full"></div>
            ) : (
              <img
                src="/icons/send_msg.svg"
                alt="Send"
                className="w-4 h-4 filter invert"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;