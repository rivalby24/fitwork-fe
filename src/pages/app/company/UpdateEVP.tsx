import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { securedApi } from "@/lib/api"; // Assuming securedApi is configured (e.g., Axios)
import { useUserStore } from "@/stores/useUserStore"; // Assuming a store like Zustand

interface CompanyData {
    name?: string;
    career_url?: string;
    logo?: string | null;
    mission_statement?: string;
    core_values?: string[];
    culture_keywords?: string[];
}

function UpdateEVP() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [careerUrl, setCareerUrl] = useState("");
    const [logo, setLogo] = useState<string | null>(null);

    const [missionStatement, setMissionStatement] = useState("");
    const [coreValueInput, setCoreValueInput] = useState("");
    const [coreValues, setCoreValues] = useState<string[]>([]);
    const [cultureKeywordInput, setCultureKeywordInput] = useState("");
    const [cultureKeywords, setCultureKeywords] = useState<string[]>([]);

    const [isEditable, setIsEditable] = useState(false);
    const { fetchUser, companyId } = useUserStore();

    const fetchEVP = async () => {
        console.log("fetchEVP called. Current companyId:", companyId);
        if (!companyId) {
            console.warn("fetchEVP aborted: Company ID is not available.");
            toast.info("Cannot load/reload data: Company ID is not available.");
            setLoading(false);
            return;
        }

        const url = `/api/v1/companies/${companyId}/`;
        console.log("Fetching EVP data from URL:", url);

        setLoading(true);
        try {
            let data: CompanyData;
            if (securedApi && typeof securedApi.get === 'function') {
                const response = await securedApi.get(url);
                data = response.data;
            } else {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Fetch error response text:", errorText);
                    throw new Error(`HTTP ${res.status} ${res.statusText}: ${errorText}`);
                }
                data = await res.json();
            }
            console.log("Fetched EVP data successfully:", data);

            setName(data.name || "");
            setCareerUrl(data.career_url || "");
            setLogo(data.logo || null);
            setMissionStatement(data.mission_statement || "");
            setCoreValues(Array.isArray(data.core_values) ? data.core_values : []);
            setCultureKeywords(Array.isArray(data.culture_keywords) ? data.culture_keywords : []);

        } catch (err) {
            console.error("Error during fetchEVP API call:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            toast.error(`Failed to load company data: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeUserAndCompany = async () => {
            try {
                console.log("Initializing user data to get companyId...");
                await fetchUser();
            } catch (err) {
                console.error("Error fetching user:", err);
                toast.error("Failed to load initial user data.");
                setLoading(false);
            }
        };
        initializeUserAndCompany();
    }, [fetchUser]);

    useEffect(() => {
        if (companyId) {
            console.log("companyId is available:", companyId, "Fetching EVP data...");
            fetchEVP();
        } else {
            console.log("companyId is not yet available after user fetch attempt or change.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    const addToList = (
        value: string,
        list: string[],
        setter: (val: string[]) => void,
        inputSetter: (val: string) => void
    ) => {
        const trimmedValue = value.trim();
        if (trimmedValue && !list.includes(trimmedValue)) {
            setter([...list, trimmedValue]);
        }
        inputSetter("");
    };

    const removeFromList = (
        valueToRemove: string,
        list: string[],
        setter: (val: string[]) => void
    ) => {
        setter(list.filter(item => item !== valueToRemove));
    };

    const handleToggleEditMode = () => {
        const newEditState = !isEditable;
        setIsEditable(newEditState);

        if (!newEditState) {
            console.log("Edit mode canceled. Refetching EVP data to revert changes.");
            if (companyId) {
                fetchEVP();
            } else {
                toast.error("Cannot reload data on cancel: Company ID is not available.");
                console.error("Cannot refetch on cancel: company_id is missing when trying to cancel edit.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!companyId) {
            toast.error("Company ID not available. Cannot save changes.");
            return;
        }
        if (!isEditable) {
            toast.info("Edit mode is not active. Nothing to save.");
            return;
        }

        setSubmitting(true);
        const payload = {
            name,
            career_url: careerUrl,
            mission_statement: missionStatement,
            core_values: coreValues,
            culture_keywords: cultureKeywords,
        };
        const url = `/api/v1/companies/${companyId}/update/`;
        console.log("Submitting EVP data to URL:", url, "Payload:", payload);

        try {
            if (securedApi && typeof securedApi.put === 'function') {
                await securedApi.put(url, payload);
            } else {
                const res = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: res.statusText }));
                    console.error("Submit error response data:", errorData);
                    throw new Error(`Update failed: HTTP ${res.status} - ${errorData.message || res.statusText}`);
                }
            }
            toast.success("EVP updated successfully!");
            setIsEditable(false);
            fetchEVP();
        } catch (err) {
            console.error("Error submitting EVP:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            toast.error(`Failed to update EVP: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !submitting) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">
                    Loading company data...
                </span>
            </div>
        );
    }

    if (!companyId && !loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center p-4">
                <p className="text-muted-foreground mb-4">
                    Cannot load company data because Company ID was not found after attempting to fetch user data.
                </p>
                <Button onClick={async () => {
                    setLoading(true);
                    console.log("Retrying fetchUser to get company_id...");
                    await fetchUser();
                }}>Retry Loading User Data</Button>
            </div>
        );
    }

    return (
        // Changed max-w-2xl to max-w-4xl for a wider card
        <div className="mx-50 my-10 mt-10 p-4 md:p-0">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>
                        {isEditable ? "Edit Company EVP Details" : "Company EVP Details"}
                    </CardTitle>
                    <Button
                        variant={!isEditable ? "default" : "outline"}
                        onClick={handleToggleEditMode}
                    >
                        {isEditable ? "Cancel" : "Edit"}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div>
                        <label htmlFor="companyName" className="block font-semibold mb-2 text-sm">Company Name</label>
                        <Input
                            id="companyName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!isEditable}
                            className={!isEditable ? "bg-gray-100 dark:bg-gray-800 cursor-default" : ""}
                            placeholder="Company name"
                        />
                    </div>

                    <div>
                        <label htmlFor="careerUrl" className="block font-semibold mb-2 text-sm">Career URL</label>
                        <Input
                            id="careerUrl"
                            type="url"
                            value={careerUrl}
                            onChange={(e) => setCareerUrl(e.target.value)}
                            readOnly={!isEditable}
                            className={!isEditable ? "bg-gray-100 dark:bg-gray-800 cursor-default" : ""}
                            placeholder="https://company.com/careers"
                        />
                    </div>

                    {logo && (
                        <div>
                            <label className="block font-semibold mb-2 text-sm">Company Logo</label>
                            {/* This new div will center its child (the logo's bordered container) */}
                            <div className="mt-1 flex justify-center">
                                <div className="p-2 border rounded-md inline-block bg-gray-50 dark:bg-gray-800">
                                    <img
                                        src={logo}
                                        alt="Company Logo"
                                        className="h-24 w-auto object-contain"
                                    // ... onError handler
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="missionStatement" className="block font-semibold mb-2 text-sm">Mission Statement</label>
                        <Textarea
                            id="missionStatement"
                            value={missionStatement}
                            onChange={(e) => setMissionStatement(e.target.value)}
                            readOnly={!isEditable}
                            className={!isEditable ? "bg-gray-100 dark:bg-gray-800 cursor-default" : ""}
                            placeholder="Your company's mission statement"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label htmlFor="coreValuesInput" className="block font-semibold mb-2 text-sm">Core Values</label>
                        {isEditable && (
                            <div className="flex space-x-2 mb-2">
                                <Input
                                    id="coreValuesInput"
                                    placeholder="Add core value"
                                    value={coreValueInput}
                                    onChange={(e) => setCoreValueInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addToList(coreValueInput, coreValues, setCoreValues, setCoreValueInput);
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={() => addToList(coreValueInput, coreValues, setCoreValues, setCoreValueInput)}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <div className={`flex flex-wrap gap-2 mt-2 min-h-[38px] p-2 rounded-md ${!isEditable ? 'bg-gray-100 dark:bg-gray-800' : 'border dark:border-gray-700'}`}>
                            {coreValues.length > 0 ? coreValues.map((val, index) => (
                                <Badge
                                    key={`core-${index}-${val}`}
                                    variant={isEditable ? "secondary" : "default"}
                                    className={isEditable ? "cursor-pointer hover:bg-indigo-200 hover:text-indigo-800 dark:hover:bg-indigo-700 dark:hover:text-white transition-colors" : "cursor-default"}
                                    onClick={() => isEditable && removeFromList(val, coreValues, setCoreValues)}
                                    title={isEditable ? `Remove "${val}"` : val}
                                >
                                    {val} {isEditable && <span aria-hidden="true" className="ml-1.5 font-semibold">✕</span>}
                                </Badge>
                            )) : (<p className="text-sm text-muted-foreground italic">
                                {isEditable ? "Start adding core values." : "No core values listed yet."}
                            </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="cultureKeywordsInput" className="block font-semibold mb-2 text-sm">Culture Keywords</label>
                        {isEditable && (
                            <div className="flex space-x-2 mb-2">
                                <Input
                                    id="cultureKeywordsInput"
                                    placeholder="Add culture keyword"
                                    value={cultureKeywordInput}
                                    onChange={(e) => setCultureKeywordInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addToList(cultureKeywordInput, cultureKeywords, setCultureKeywords, setCultureKeywordInput);
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={() => addToList(cultureKeywordInput, cultureKeywords, setCultureKeywords, setCultureKeywordInput)}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <div className={`flex flex-wrap gap-2 mt-2 min-h-[38px] p-2 rounded-md ${!isEditable ? 'bg-gray-100 dark:bg-gray-800' : 'border dark:border-gray-700'}`}>
                            {cultureKeywords.length > 0 ? cultureKeywords.map((val, index) => (
                                <Badge
                                    key={`culture-${index}-${val}`}
                                    variant="outline"
                                    className={isEditable ? "cursor-pointer hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors" : "cursor-default text-foreground/80 border-foreground/30"}
                                    onClick={() => isEditable && removeFromList(val, cultureKeywords, setCultureKeywords)}
                                    title={isEditable ? `Remove "${val}"` : val}
                                >
                                    {val} {isEditable && <span aria-hidden="true" className="ml-1.5 font-semibold">✕</span>}
                                </Badge>
                            )) : (<p className="text-sm text-muted-foreground italic">
                                {isEditable ? "Start adding culture keywords." : "No culture keywords listed yet."}
                            </p>
                            )}
                        </div>
                    </div>

                    {isEditable && (
                        <Button onClick={handleSubmit} className="w-full mt-8" disabled={submitting}>
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin w-5 h-5" /> Updating...
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default UpdateEVP;