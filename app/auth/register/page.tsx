"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "../../../components/register/RegisterForm";

const RegisterPage = () => {
  const root = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("one special character");
    return errors;
  };

  const validateUsername = (username: string) => {
    const errors: string[] = [];
    if (username.length < 4) errors.push("Username must be at least 4 characters long.");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);

    const usernameValidationErrors = validateUsername(username);
    if (usernameValidationErrors.length > 0) {
      setUsernameErrors(usernameValidationErrors);
      return;
    }

    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${root}/auth/register`, {
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

      router.push("/auth/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("already a user with this name")) {
          setUsernameError("This username is already taken.");
        } else {
          console.error("Error:", error);
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameErrors(validateUsername(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordErrors(validatePassword(e.target.value));
    setConfirmPasswordError(e.target.value !== confirmPassword ? "Passwords do not match." : null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(e.target.value !== password ? "Passwords do not match." : null);
  };

  const isSubmitDisabled = passwordErrors.length > 0 || usernameErrors.length > 0 || password !== confirmPassword;

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center text-white font-[family-name:var(--font-geist-sans)]"
      style={{ backgroundImage: "url('/login/blue_bg_inverted.png')" }}
    >
      <div className="flex justify-center w-full lg:w-1/3 xl:w-2/4 p-4 md:p-0">
        <RegisterForm
          username={username}
          password={password}
          confirmPassword={confirmPassword}
          usernameErrors={usernameErrors}
          passwordErrors={passwordErrors}
          confirmPasswordError={confirmPasswordError}
          usernameError={usernameError}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          handleConfirmPasswordChange={handleConfirmPasswordChange}
          handleSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
