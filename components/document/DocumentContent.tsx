interface DocumentContentProps {
    document: {
      id: string;
      title: string;
      image: string;
      content: string;
      interactions: { prompt: string; answer: string }[];
    };
  }

  const DocumentContent = ({ document }: DocumentContentProps) => {
    return (
      <div className="overflow-y-auto bg-white shadow-lg rounded-lg" style={{ maxHeight: "calc(100vh - 100px)" }}>
        <img src={document.image} alt={document.title} className="w-full rounded-lg shadow-lg" />
        <h2 className="text-xl font-semibold mt-4 ml-4">Extracted text</h2>
        <p className="ml-4 mt-2 whitespace-pre-line">{document.content}</p>
      </div>
    );
  };
  
  export default DocumentContent;