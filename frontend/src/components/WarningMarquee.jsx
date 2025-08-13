import React from 'react';
import { AlertTriangle } from 'lucide-react';

const WarningMarquee = () => {
    return (
        <div className="bg-red-600 text-white py-2 overflow-hidden relative">
            <div className="flex items-center animate-marquee whitespace-nowrap">
                <div className="flex items-center space-x-4 mx-8">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold text-sm md:text-base">
                        ⚠️ WARNING: This is NOT a real government website - Created for LEARNING PURPOSE ONLY - DO NOT enter real personal details ⚠️
                    </span>
                </div>
                <div className="flex items-center space-x-4 mx-8">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold text-sm md:text-base">
                        ⚠️ WARNING: This is NOT a real government website - Created for LEARNING PURPOSE ONLY - DO NOT enter real personal details ⚠️
                    </span>
                </div>
                <div className="flex items-center space-x-4 mx-8">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold text-sm md:text-base">
                        ⚠️ WARNING: This is NOT a real government website - Created for LEARNING PURPOSE ONLY - DO NOT enter real personal details ⚠️
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default WarningMarquee;