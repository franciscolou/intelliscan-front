import { useRouter } from "next/navigation";

const ErrorState = ({ error }: { error: string }) => {
  const router = useRouter();

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
};

export default ErrorState;
