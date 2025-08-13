import { Mail, Phone, HelpCircle, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r mt-8 from-blue-900 to-blue-800 text-white p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Left Column - Contact Info */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-white">UDYAM REGISTRATION</h1>
                        <div className="space-y-1 text-gray-200">
                            <p className="text-lg">Ministry of MSME</p>
                            <p>Udyog bhawan - New Delhi</p>
                        </div>

                        <div className="space-y-3 mt-6">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-3 text-blue-300" />
                                <span className="font-semibold">Email:</span>
                                <span className="ml-2 text-blue-200">champions@gov.in</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-3 text-blue-300" />
                                    <span className="font-semibold">Contact Us</span>
                                </div>
                                <div className="flex items-center">
                                    <HelpCircle className="h-4 w-4 mr-3 text-blue-300" />
                                    <span>For Grievances / Problems</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Our Services */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-white">Our Services</h2>
                        <ul className="space-y-3 text-gray-200">
                            <li className="flex items-center">
                                <span className="text-blue-300 mr-2">▶</span>
                                <span>CHAMPIONS</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-300 mr-2">▶</span>
                                <span>MSME Samadhaan</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-300 mr-2">▶</span>
                                <span>MSME Sambandh</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-300 mr-2">▶</span>
                                <span>MSME Dashboard</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-blue-300 mr-2">▶</span>
                                <span>Entrepreneurship Skill Development Programme (ESDP)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column - Video */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-white">Video</h2>
                        <div className="bg-blue-800 rounded-lg p-4 border border-blue-600">
                            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg p-6 text-center relative overflow-hidden">
                                {/* Video Player Mockup */}
                                <div className="relative">
                                    <div className="text-yellow-300 text-xl font-bold mb-2">♦</div>
                                    <div className="text-yellow-300 text-2xl font-bold mb-2">Udyam Registration</div>
                                    <div className="text-white text-lg mb-4">www.udyamregistration.gov.in</div>

                                    {/* Play Button */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Video Controls */}
                                    <div className="flex items-center justify-between text-white text-sm">
                                        <span>0:00 / 0:47</span>
                                        <div className="flex items-center space-x-3">
                                            <button className="hover:text-yellow-300">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.759L4.617 13.21A1 1 0 014 12.43V7.57a1 1 0 01.617-.769l3.766-3.549a1 1 0 011 .824zM16 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button className="hover:text-yellow-300">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button className="hover:text-yellow-300">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 000-2H3zm0 2h14v10a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5V6z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-blue-700 pt-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        {/* Copyright */}
                        <div className="text-sm text-gray-300 space-y-1 flex-1">
                            <p>© Copyright <span className="font-semibold text-white">Udyam Registration</span>. All Rights Reserved, Website Content Managed by Ministry of Micro Small and Medium Enterprises, GoI</p>
                            <p>Website hosted & managed by National Informatics Centre, Ministry of Communications and IT, Government of India</p>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;