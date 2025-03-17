const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-gray-500 border-t-transparent rounded-full"></div>
        {/* <div className="text-3xl font-bold text-gray-700">Loading...</div> */}
      </div>
    </div>
  );
};

export default LoadingScreen;
