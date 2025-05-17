import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { BellIcon, UserIcon } from "lucide-react";
import React from "react";

export default function NavbarDashboardPerusahaan() {
    // Navigation items data
    const navItems = [
        { label: "Home", href: "/" },
        { label: "Assessment", href: "#" },
        { label: "EVP", href: "#" },
        { label: "Reports", href: "#" },
    ];

    return (
        <header className="w-full h-16 bg-indigo-500 border-b border-neutral-200">
            <div className="max-w-[1280px] h-16 mx-auto px-4">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img className="" alt="Logo" src="src/assets/fwok2.svg" />
                    </div>

                    {/* Navigation */}
                    <NavigationMenu className="flex-1 ml-12">
                        <NavigationMenuList className="flex space-x-6">
                            {navItems.map((item, index) => (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuLink
                                        className="font-normal text-white text-base leading-4 hover:text-white/80 transition-colors"
                                        href={item.href}
                                    >
                                        {item.label}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
