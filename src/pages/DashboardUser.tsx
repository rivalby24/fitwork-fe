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
            id: "personal",
            title: "Personal Assessment",
            description: "Complete your personality and skills evaluation",
            icon: <ClipboardList className="w-7 h-9" />,
            buttonText: "Start Assessment",
        },
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
                <div className="bg-neutral-100 py-16">
                    <Card className="max-w-7xl mx-auto shadow-sm">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-medium mb-6">AI Career Consultation</h2>
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Chat Panel */}
                                <div className="bg-neutral-100 rounded-lg p-4 flex-1">
                                    <div className="mb-4 space-y-4">
                                        {chatMessages.map((message, index) => (
                                            <div key={index} className="flex items-start">
                                                {message.isUser ? (
                                                    <>
                                                        <Avatar className="h-8 w-8 mr-3">
                                                            <AvatarFallback>{message.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="bg-gray-200 rounded-lg p-3 max-w-[333px]">
                                                            <p className="text-base">{message.message}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex ml-auto items-start">
                                                        <div className="bg-indigo-500 rounded-lg p-3 max-w-[498px] text-white">
                                                            <p className="text-base">{message.message}</p>
                                                        </div>
                                                        <Avatar className="h-8 w-8 ml-3 bg-gray-200">
                                                            <AvatarFallback>
                                                                <Bot className="h-4 w-4" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex mt-4">
                                        <Input
                                            className="flex-grow mr-2 h-[42px]"
                                            placeholder="Type your question..."
                                            aria-label="Chat input"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSend();
                                            }}
                                        />
                                        <Button
                                            className="h-[42px] w-12 bg-indigo-500 hover:bg-indigo-600 p-0"
                                            title="Send"
                                            onClick={handleSend}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Suggested Topics */}
                                <div className="bg-neutral-100 rounded-lg p-4 w-full md:w-[400px]">
                                    <h3 className="text-base font-normal mb-4">Suggested Topics</h3>
                                    <div className="space-y-3">
                                        {suggestedTopics.map((topic) => (
                                            <Button
                                                key={topic}
                                                className="w-full h-10 bg-indigo-500 hover:bg-indigo-600 justify-start px-2"
                                            >
                                                {topic}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
