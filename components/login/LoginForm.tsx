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
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 50%)';
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          Don't have an account?{" "}
          <a href="/auth/register" className="underline text-blue-300">
            Register
          </a>.
        </span>
      </div>
      <button
        type="submit"
        className="absolute bottom-4 right-4 p-2 bg-[#1ba7ca] text-white rounded hover:bg-black hover:cursor-pointer transition-colors duration-300"
      >
        Confirm
      </button>
    </form>
  );
};

export default LoginForm;
