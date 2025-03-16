"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const root = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsernameError(false);
    setPasswordError(false);

    try {
      const response = await fetch(`${root}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      const token = data.access_token;
      localStorage.setItem("access_token", token);

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        if (error.message.toLowerCase().includes("username")) {
          setUsernameError(true);
        }
        if (error.message.toLowerCase().includes("password")) {
          setPasswordError(true);
        }
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-start items-center h-screen bg-cover bg-center font-[family-name:var(--font-geist-sans)]"
      style={{ backgroundImage: "url('/login/blue_bg.png')" }}
    >
      <div className="flex items-center justify-center w-full md:w-2/3 text-white mt-4 md:mt-0">
        <img
          src="/logo/logo_white.png"
          alt="Logo"
          className="h-24 md:h-48 mr-4 grayscale brightness-[1000%] contrast-[1000%]"
        />
        <div className="text-right">
          <h1 className="text-4xl md:text-8xl font-bold">
            Intelliscan<sup className="text-2xl md:text-4xl">®</sup>
          </h1>
          <p className="text-lg md:text-xl">Your AI partner for billing</p>
        </div>
      </div>
      <div className="flex justify-center flex-none w-full md:w-1/3 p-4 md:p-0">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-3/5 rounded-lg p-6 md:p-10 pb-16 md:pb-32 relative"
          style={{ backgroundColor: "rgba(255, 255, 255, 10%)" }}
        >
          <h2 className="text-xl md:text-2xl mb-4 font-bold text-white">Log in</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <label htmlFor="username" className="block mb-2 text-white">
            Username
          </label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
            required
            className={`w-full mb-4 p-2 rounded ${usernameError ? 'border border-red-500' : 'border-white'} text-white bg-transparent focus:outline-none`}
          />
          <label htmlFor="password" className="block mb-2 text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
            required
            className={`w-full mb-4 p-2 rounded ${passwordError ? 'border border-red-500' : 'border-white'} text-white bg-transparent focus:outline-none`}
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
      </div>
    </div>
  );
};

export default LoginPage;