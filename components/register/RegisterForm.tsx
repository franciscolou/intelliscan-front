import React from "react";
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
    handleSubmit: (e: React.FormEvent) => void;
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
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full md:w-3/5 rounded-lg p-6 md:p-10 pb-16 md:pb-32 relative"
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
                disabled={isSubmitDisabled}
                className={`absolute bottom-4 right-4 p-2 rounded transition-colors duration-300 ${
                    isSubmitDisabled
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#1ba7ca] hover:bg-[#5bde7e] cursor-pointer"
                }`}
            >
                Register
            </button>
        </form>
    );
};

export default RegisterForm;