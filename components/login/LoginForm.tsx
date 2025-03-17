import React, { useState } from 'react';
import InputField from '../InputField';

interface FormProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const LoginForm: React.FC<FormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  error,
  handleSubmit,
}) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    setLoading(true); // Set loading to true when the form is submitted
    await handleSubmit(e);
    setLoading(false); // Set loading back to false after the submission is finished
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full md:w-3/5 rounded-lg p-6 md:p-10 pb-16 md:pb-32 relative"
      style={{ backgroundColor: 'rgba(255, 255, 255, 10%)' }}
    >
      <h2 className="text-xl md:text-2xl mb-4 font-bold text-white">Log in</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <InputField
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ backgroundColor: 'rgba(255, 255, 255, 30%)' }}
        hasErrorDescription={false}
        error={error}
      />
      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ backgroundColor: 'rgba(255, 255, 255, 30%)' }}
        hasErrorDescription={false}
        error={error}
      />
      <div className="flex justify-end mb-4">
        <span className="text-gray-300">
          Don&apos;t have an account?{" "}
          <a href="/auth/register" className="underline text-blue-300">
            Register
          </a>.
        </span>
      </div>
      <button
        type="submit"
        className={`absolute bottom-4 right-4 p-2 w-24 h-10 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1ba7ca] text-white'} rounded hover:${loading ? '' : 'bg-black hover:cursor-pointer'} transition-colors duration-300 flex items-center justify-center`}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 0116 0"
              className="opacity-75"
            />
          </svg>
        ) : (
          'Confirm'
        )}
      </button>
    </form>
  );
};

export default LoginForm;