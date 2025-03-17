import React from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleLogout }) => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <header className="top-0 left-0 p-4 border-b border-gray-300 bg-gray-300 shadow-md flex justify-between items-center">
      <img
        src="/logo/logo_black.png"
        alt="Logo"
        className="h-16 mr-4 cursor-pointer transition-transform duration-500 hover:scale-110"
        onClick={handleLogoClick}
      />
      <button
        onClick={handleLogout}
        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white hover:bg-red-600 hover:text-white hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer shadow-md"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
