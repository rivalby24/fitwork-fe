import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"; 
import { Eye, AlertCircle, UserSearch, CalendarDays, Star, Building } from 'lucide-react';
import { securedApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { enUS as localeEN } from 'date-fns/locale'; 

interface CandidateUserData {
    id: string;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string;
}

interface AdminAssessmentSessionData {
    id: string; 
    user: CandidateUserData;
    companyId: string;
    company_name: string;
    overall_score: number | null;
    created_at: string;
}

interface SessionFullDetailsData {
    id: string;
    user: CandidateUserData;
    company_name: string;
    overall_score: number | null;
    created_at: string;
    dimension_scores?: Record<string, number>; 
    answers?: Array<{
        question_id: string;
        question_statement: string;
        dimension: string;
        score: number;
    }>; 
}

function CandidateView() {

    const [sessions, setSessions] = useState<AdminAssessmentSessionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [companyNameForTitle, setCompanyNameForTitle] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSessionForModal, setSelectedSessionForModal] = useState<AdminAssessmentSessionData | null>(null);

    const [sessionFullDetails, setSessionFullDetails] = useState<SessionFullDetailsData | null>(null);
    const [isLoadingModalDetails, setIsLoadingModalDetails] = useState(false);

    useEffect(() => {
        const fetchCandidateSessions = async (): Promise<void> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await securedApi.get<AdminAssessmentSessionData[]>('/api/v1/assessments/company/candidate-sessions/');
                setSessions(response.data);
                if (response.data.length > 0 && response.data[0].company_name) {
                    setCompanyNameForTitle(response.data[0].company_name);
                } else {
                    setCompanyNameForTitle("Your Company");
                }
            } catch (err) {
                console.error("Error fetching candidate sessions:", err);
                if (err instanceof AxiosError) {
                    let errorMsg = "Failed to retrieve candidate session data.";
                    if (err.response) {
                        errorMsg += ` Status: ${err.response.status}.`;
                        if (err.response.status === 403) {
                            errorMsg = "You do not have permission to access this resource. Ensure you are a valid Company Admin.";
                        } else if (err.response.status === 405) { 
                            errorMsg += ` Request method (${err.config?.method?.toUpperCase()}) not allowed for this URL. Check backend endpoint configuration.`;
                        } else if (typeof err.response.data === 'string') {
                            errorMsg += ` Detail: ${err.response.data.substring(0, 300)}`;
                        } else if (err.response.data && err.response.data.detail) {
                            errorMsg += ` Detail: ${err.response.data.detail}`;
                        } else {
                            errorMsg += ` Detail: ${JSON.stringify(err.response.data).substring(0, 300)}`;
                        }
                    } else if (err.request) {
                        errorMsg = "No response from server. Check your network connection.";
                    } else {
                        errorMsg = `Unknown error: ${err.message}`;
                    }
                    setError(errorMsg);
                } else {
                    setError("An unknown general error occurred while fetching session data.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidateSessions();
    }, []);

    const getCandidateDisplayName = (user: CandidateUserData): string => {
        if (user.full_name && user.full_name.trim() !== "") return user.full_name;
        if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
        return user.username || user.email;
    };

    const fetchSessionFullDetails = async (sessionId: string) => {
        if (!sessionId) return;
        setIsLoadingModalDetails(true);
        setSessionFullDetails(null);
        try {
            const response = await securedApi.get<SessionFullDetailsData>(`/api/v1/assessments/session-details/${sessionId}/`);
            setSessionFullDetails(response.data);
        } catch (error) {
            console.error("Error fetching session full details:", error);
            setSessionFullDetails({
                id: sessionId,
                user: selectedSessionForModal!.user, 
                company_name: selectedSessionForModal!.company_name,
                overall_score: selectedSessionForModal!.overall_score,
                created_at: selectedSessionForModal!.created_at,
                answers: [], 
                dimension_scores: {}
            });
        } finally {
            setIsLoadingModalDetails(false);
        }
    };
    
    const handleViewDetails = (session: AdminAssessmentSessionData) => {
        setSelectedSessionForModal(session);
        setIsModalOpen(true);
        fetchSessionFullDetails(session.id);
    };


    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-8 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-10 w-2/5 bg-gray-300 rounded" />
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full bg-gray-300 rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Data Retrieval Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Candidate Assessments {companyNameForTitle && `at ${companyNameForTitle}`}
                </h1>
            </div>

            {sessions.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-md">
                    <UserSearch size={60} className="text-gray-400 mb-5" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Assessment Data Found</h2>
                    <p className="text-gray-500 max-w-md">Currently, no candidates have completed assessments for your company, or data could not be found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto"> 
                    <Table>
                        <TableHeader className="bg-slate-100">
                            <TableRow>
                                <TableHead className="px-4 py-3 md:px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Candidate</TableHead>
                                <TableHead className="px-4 py-3 md:px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Average Score</TableHead>
                                <TableHead className="px-4 py-3 md:px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</TableHead>
                                <TableHead className="px-4 py-3 md:px-6 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-200">
                            {sessions.map((session) => (
                                <TableRow key={session.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                                    <TableCell className="px-4 py-4 md:px-6 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{getCandidateDisplayName(session.user)}</div>
                                        <div className="text-xs text-slate-500">{session.user.email}</div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 md:px-6 whitespace-nowrap">
                                        {session.overall_score !== null ? (
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-tight font-semibold rounded-full ${session.overall_score >= 4 ? 'bg-green-100 text-green-800' :
                                                session.overall_score >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                                                    session.overall_score > 0 ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-200 text-gray-700'
                                                }`}>
                                                {session.overall_score.toFixed(1)} / 5.0
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-slate-600">
                                        {format(new Date(session.created_at), 'MMM dd, yyyy, HH:mm', { locale: localeEN })}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 md:px-6 whitespace-nowrap text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(session)}
                                            title="View Assessment Details"
                                            className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 focus:ring-indigo-500"
                                        >
                                            <Eye size={16} className="mr-0 sm:mr-1.5" />
                                            <span className="hidden sm:inline">Details</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {selectedSessionForModal && (
                <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                    setIsModalOpen(isOpen);
                    if (!isOpen) { 
                        setSessionFullDetails(null);
                        setSelectedSessionForModal(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                Candidate Assessment Details
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                {getCandidateDisplayName(selectedSessionForModal.user)}
                                <span className="text-gray-500"> ({selectedSessionForModal.user.email})</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="overflow-y-auto max-h-[65vh] md:max-h-[65vh] pr-3">
                            <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                <div className="flex items-start">
                                    <Building size={16} className="mr-2.5 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-gray-700">Company:</span>
                                        <p className="text-gray-800">{selectedSessionForModal.company_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CalendarDays size={16} className="mr-2.5 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-gray-700">Assessment Date:</span>
                                        <p className="text-gray-800">
                                            {format(new Date(selectedSessionForModal.created_at), 'EEEE, MMMM dd, yyyy, p', { locale: localeEN })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start sm:col-span-2">
                                    <Star size={16} className="mr-2.5 mt-0.5 text-yellow-500 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-gray-700">Average Score:</span>
                                        <p className={`font-semibold text-base ${selectedSessionForModal.overall_score !== null && selectedSessionForModal.overall_score >= 4 ? 'text-green-600' :
                                            selectedSessionForModal.overall_score !== null && selectedSessionForModal.overall_score >= 2.5 ? 'text-yellow-600' :
                                                selectedSessionForModal.overall_score !== null ? 'text-red-600' : 'text-gray-500'
                                            }`}>
                                            {selectedSessionForModal.overall_score !== null
                                                ? `${selectedSessionForModal.overall_score.toFixed(1)} / 5.0`
                                                : "No score available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:col-span-2 mt-3 pt-4 border-t border-gray-200">
                                    <h3 className="text-md font-semibold text-gray-800 mb-2">Additional Details:</h3>
                                    {isLoadingModalDetails ? (
                                        <div className="text-center py-4 flex items-center justify-center text-gray-500">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading further details...
                                        </div>
                                    ) : sessionFullDetails && sessionFullDetails.answers ? ( 
                                        <div>
                                            {sessionFullDetails.dimension_scores && Object.keys(sessionFullDetails.dimension_scores).length > 0 && (
                                                <>
                                                    <h4 className="font-semibold mt-2 mb-1 text-gray-700">Scores per Dimension:</h4>
                                                    <ul className="list-disc list-inside pl-1 space-y-0.5">
                                                        {Object.entries(sessionFullDetails.dimension_scores).map(([dim, score]) => (
                                                            <li key={dim} className="text-gray-600">{dim}: {typeof score === 'number' ? score.toFixed(1) : 'N/A'}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {sessionFullDetails.answers && sessionFullDetails.answers.length > 0 && (
                                                <>
                                                    <h4 className="font-semibold mt-3 mb-1 text-gray-700">Question Answers:</h4>
                                                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                                                        {sessionFullDetails.answers.map((ans, index) => (
                                                            <div key={ans.question_id || index} className="p-2 border rounded-md bg-gray-50 text-xs">
                                                                <p className="font-medium text-gray-700">Q: <span className="font-normal">{ans.question_statement}</span></p>
                                                                <p className="text-gray-600">Dimension: {ans.dimension}</p>
                                                                <p className="text-indigo-700 font-semibold">Score: {ans.score}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                            {(!sessionFullDetails.dimension_scores || Object.keys(sessionFullDetails.dimension_scores).length === 0) &&
                                            (!sessionFullDetails.answers || sessionFullDetails.answers.length === 0) && (
                                                <p className="text-slate-500 italic text-xs">No detailed scores per dimension or answers available for this session.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-slate-50 rounded-md text-center">
                                            <p className="text-slate-600 italic text-xs">
                                                The feature to display detailed scores per dimension or question answers will be available if data is received from the server.
                                                Ensure the endpoint `/api/v1/assessments/session-details/&lt;session_id&gt;/` is correctly implemented in the backend.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-end pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default CandidateView;