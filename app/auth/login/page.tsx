"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandSignature from "../../../components/login/BrandSignature";
import LoginForm from "../../../components/login/LoginForm";

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
      console.log(token);
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
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-start items-center h-screen bg-cover bg-center font-[family-name:var(--font-geist-sans)]"
      style={{ backgroundImage: "url('/login/blue_bg.png')" }}
    >
      <BrandSignature />
      <div className="flex justify-center flex-none w-full md:w-1/3 p-4 md:p-0">
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          error={error}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default LoginPage;
