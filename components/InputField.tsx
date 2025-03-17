import React from "react";

interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    hasErrorDescription: boolean;
    style?: React.CSSProperties;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    label,
    type,
    value,
    onChange,
    error,
    hasErrorDescription,
    style,
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block mb-2 text-white">
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                style={style}
                required
                className={`w-full p-2 rounded outline-none ${
                    error ? "border border-red-500" : "border-white"
                } text-white bg-transparent focus:outline-none`}
            />
            {error && hasErrorDescription && <p className="text-[#f587a4] text-sm mt-2 whitespace-pre-wrap">{error}</p>}
        </div>
    );
};

export default InputField;