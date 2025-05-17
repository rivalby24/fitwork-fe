import React from 'react'
import {
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

function FooterDashboard() {
    return (
        <footer className="w-full h-[69px] bg-indigo-500 border-t border-neutral-200 mt-auto">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="flex justify-between items-center h-[68px]">
                    <div className="text-[#fffefe] text-sm">© 2025 Fitwork</div>
                    <div className="flex space-x-4">
                        <Mail className="h-4 w-4 text-white" />
                        <Linkedin className="h-4 w-3.5 text-white" />
                        <Instagram className="h-4 w-4 text-white" />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterDashboard