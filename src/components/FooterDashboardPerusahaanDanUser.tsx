import { Facebook, Linkedin, Mail } from "lucide-react";
import React from "react";

export default function FooterDashboardPerusahaanDanUser() {
  return (
    <footer className="w-full h-[69px] bg-indigo-500 border-t border-neutral-200">
      <div className="max-w-[1280px] h-[68px] mx-auto px-4">
        <div className="flex justify-between items-center h-full py-6">
          <div>
            <p className="font-normal text-white text-sm">© 2025 Fitwork</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Email"
              className="text-white hover:text-white/80"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-white hover:text-white/80"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-white hover:text-white/80"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
