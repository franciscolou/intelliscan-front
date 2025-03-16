"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
            setConfirmPasswordError("Passwords do not match");
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
        } catch (error: any) {
            if (error.message.includes("already a user with this name")) {
                setUsernameError("This username is already taken.");
            } else {
                console.error("Error:", error);
            }
        }
    };

    const isSubmitDisabled = passwordErrors.length > 0 || usernameErrors.length > 0 || password !== confirmPassword;

    return (
        <div
            className="flex justify-center items-center h-screen bg-cover bg-center text-white font-[family-name:var(--font-geist-sans)]"
            style={{ backgroundImage: "url('/login/blue_bg_inverted.png')" }}
        >
            <div className="flex justify-center w-full md:w-1/3 p-4 md:p-0">
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-3/5 rounded-lg p-6 md:p-10 pb-16 md:pb-32 relative"
                    style={{ backgroundColor: "rgba(255, 255, 255, 20%)" }}
                >
                    <h2 className="text-xl md:text-2xl mb-4 font-bold">Create an account</h2>
                    <label htmlFor="username" className="block mb-2">
                        Choose your username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setUsernameErrors(validateUsername(e.target.value));
                        }}
                        style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
                        required
                        className={`w-full mb-4 p-2 rounded outline-none ${usernameErrors.length > 0 ? " border border-red-500" : ""}`}
                    />
                    {usernameErrors.length > 0 && (
                        <p className="text-[#f587a4] mb-4 text-sm">{usernameErrors[0]}</p>
                    )}
                    {usernameError && (
                        <p className="text-[#f587a4] mb-4 text-sm">{usernameError}</p>
                    )}
                    <label htmlFor="password" className="block mb-2">
                        Create a password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordErrors(validatePassword(e.target.value));
                            setConfirmPasswordError(e.target.value !== confirmPassword ? "Passwords do not match" : null);
                        }}
                        style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
                        required
                        className={`w-full mb-4 p-2 rounded outline-none ${passwordErrors.length > 0 ? "border border-red-500" : ""}`}
                    />
                    {passwordErrors.length > 0 && (
                        <ul className="text-[#f587a4] mb-4 text-sm">
                            <li>Your password must contain at least:</li>
                            {passwordErrors.map((error, index) => (
                                <li key={index}>
                                    - {error}
                                    {index === passwordErrors.length - 1 ? "." : ";"}
                                </li>
                            ))}
                        </ul>
                    )}
                    <label htmlFor="confirmPassword" className="block mb-2">
                        Confirm your password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordError(e.target.value !== password ? "Passwords do not match" : null);
                        }}
                        style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
                        required
                        className={`w-full mb-4 p-2 rounded outline-none ${confirmPasswordError ? "border border-red-500" : ""}`}
                    />
                    {confirmPasswordError && (
                        <p className="text-[#f587a4] mb-4 text-sm">{confirmPasswordError}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`absolute bottom-4 right-4 p-2 rounded transition-colors duration-300 ${
                            isSubmitDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-[#1ba7ca] hover:bg-[#5bde7e] cursor-pointer"
                        }`}
                    >
                        Register
                    </button>
                    <div className="flex justify-end mb-4">
                        <span className="right-4">
                            Already have an account? <a href="/auth/login" className="underline text-blue-200">Log in</a>.
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
