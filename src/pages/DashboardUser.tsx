import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BarChart3,
    Bot,
    Building2,
    ClipboardList,
    Send,
} from "lucide-react";

import FooterDashboard from "@/components/FooterDashboard";
import NavbarUser from "@/components/NavbarUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { securedApi } from "@/api";
import ChatBotBox from "../components/ChatBotBox";

function DashboardUser() {
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [newMessage, setNewMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([
        {
            isUser: true,
            message: "How can I improve my career prospects?",
            avatar: "U",
        },
        {
            isUser: false,
            message: "Based on your assessment results, I recommend focusing on...",
            avatar: "AI",
        },
    ]);

    const navigate = useNavigate();

    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await securedApi.get("http://127.0.0.1:8000/api/v1/me/");
                setUsername(res.data.username);
            } catch (error) {
                console.error("Failed to fetch user info", error);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const assessmentCards = [
        {
            id: "company",
            title: "Company Culture Fit",
            description: "Evaluate your compatibility with company values",
            icon: <Building2 className="w-7 h-9" />,
            buttonText: "Get Started",
        },
    ];

    const suggestedTopics = [
        "Career Path Analysis",
        "Skill Development",
        "Industry Trends",
    ];

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const userMsg = {
            isUser: true,
            message: newMessage,
            avatar: "U",
        };

        const aiResponse = {
            isUser: false,
            message: "This is a placeholder AI response. Real integration coming soon!",
            avatar: "AI",
        };

        setChatMessages((prev) => [...prev, userMsg, aiResponse]);
        setNewMessage("");
    };

    return (
        <div className="w-full bg-neutral-50">
            <NavbarUser />
            <div className="relative">
                <div className="pt-16 pb-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="pt-16 pb-8 text-center">
                            {loading ? (
                                <h1 className="text-3xl font-bold mb-10">Loading...</h1>
                            ) : error ? (
                                <p role="alert" className="text-red-500">{error}</p>
                            ) : (
                                <h1 className="text-3xl font-bold mb-10">Welcome back, {username}</h1>
                            )}

                            <div className="flex flex-wrap justify-center gap-6">
                                {assessmentCards.map((card) => (
                                    <Card key={card.id} className="w-[400px] shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center mb-6">
                                                {card.icon}
                                            </div>
                                            <h2 className="text-base font-normal mb-2">{card.title}</h2>
                                            <p className="text-base font-normal text-neutral-600 mb-6">
                                                {card.description}
                                            </p>
                                            <Button className="w-full h-10 bg-neutral-600 hover:bg-neutral-700 rounded-lg">
                                                {card.buttonText}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Consultation */}
                <ChatBotBox/>

                {/* Comparison Panel */}
                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-normal mb-4">Assessment Comparison</h2>
                        <Card className="shadow-sm">
                            <CardContent className="flex rounded-lg overflow-hidden">
                                {/* Left panel */}
                                <div className="bg-gray-200 flex flex-col items-center justify-center w-1/2 py-10 space-y-4">
                                    <Building2 className="w-6 h-6 text-gray-700" />
                                    <p className="text-center text-base font-medium px-6">
                                        Compare your assessment with other company
                                    </p>
                                    <Button className="h-9 w-32 bg-neutral-700 hover:bg-neutral-800 text-white text-sm">
                                        Compare
                                    </Button>
                                </div>

                                {/* Right panel */}
                                <div className="bg-white flex items-center justify-center w-1/2 py-10">
                                    <Building2 className="w-6 h-6 text-indigo-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <FooterDashboard />
            </div>
        </div>
    );
}

export default DashboardUser;
