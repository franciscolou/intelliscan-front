import React, { useState } from "react";
import InputField from "../InputField";

interface RegisterFormProps {
    username: string;
    password: string;
    confirmPassword: string;
    usernameErrors: string[];
    passwordErrors: string[];
    confirmPasswordError: string | null;
    usernameError: string | null;
    handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    isSubmitDisabled: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    username,
    password,
    confirmPassword,
    usernameErrors,
    passwordErrors,
    confirmPasswordError,
    usernameError,
    handleUsernameChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    isSubmitDisabled,
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
            className="w-full md:w-3/5 lg:w-full xl:w-2/4 rounded-lg p-6 md:p-10 pb-16 md:pb-32 relative"
            style={{ backgroundColor: "rgba(255, 255, 255, 20%)" }}
        >
            <h2 className="text-xl md:text-2xl mb-4 font-bold">Create an account</h2>
            <InputField
                id="username"
                label="Choose your username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                error={usernameErrors.length > 0 ? usernameErrors[0] : usernameError}
                hasErrorDescription={true}
                style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
            />

            <InputField
                id="password"
                label="Create a password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={
                    passwordErrors.length > 0
                        ? "Your password must contain at least:\n- " + passwordErrors.join(";\n- ") + "."
                        : ""
                }
                hasErrorDescription={true}
                style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
            />

            <InputField
                id="confirmPassword"
                label="Confirm your password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError || ""}
                hasErrorDescription={true}
                style={{ backgroundColor: "rgba(255, 255, 255, 30%)" }}
            />
            <div className="flex justify-end mb-4">
                <span className="text-gray-300">
                    Already have an account? <a href="/auth/login" className="underline text-blue-300">Log in</a>.
                </span>
            </div>
            <button
                type="submit"
                disabled={isSubmitDisabled || loading}
                className={`absolute bottom-4 right-4 p-2 w-24 h-10 rounded transition-colors duration-300 ${
                    isSubmitDisabled || loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#1ba7ca] hover:bg-[#5bde7e] cursor-pointer"
                } flex items-center justify-center`}
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
                    'Register'
                )}
            </button>
        </form>
    );
};

export default RegisterForm;