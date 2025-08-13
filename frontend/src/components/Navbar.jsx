import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "Home", underline: true },
        { label: "NIC Code", dropdown: true },
        { label: "Useful Documents", dropdown: true },
        { label: "Print / Verify", dropdown: true },
        { label: "Update Details", dropdown: true },
        { label: "Login", dropdown: true },
    ];

    return (
        <nav className="w-full fixed z-1000 bg-[#4A3FC8] text-white font-[Source_Sans_Pro]">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-12 py-4">

                {/* Left side - Logo & Title */}
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/MINISTRY_NAME.webp"
                        alt="Emblem"
                        className="h-10 w-auto"
                    />

                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-6 text-sm">
                    {menuItems.map((item, idx) => (
                        <li
                            key={idx}
                            className={`flex items-center gap-1 cursor-pointer ${item.underline ? "border-b-2 border-white pb-1" : ""
                                }`}
                        >
                            {item.label}
                            {item.dropdown && <ChevronDown size={16} />}
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <ul className="flex flex-col md:hidden bg-[#4A3FC8] px-4 pb-4 space-y-3 text-sm">
                    {menuItems.map((item, idx) => (
                        <li
                            key={idx}
                            className={`flex items-center justify-between cursor-pointer ${item.underline ? "border-b-2 border-white pb-1" : ""
                                }`}
                        >
                            {item.label}
                            {item.dropdown && <ChevronDown size={16} />}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
