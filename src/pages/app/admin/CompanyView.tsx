import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label"; // For form labels
import { Edit, Trash2, PlusCircle, AlertCircle, Building, Briefcase, LinkIcon } from 'lucide-react';
import { securedApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { toast } from "sonner"; // For notifications

interface CompanyData {
    id: string;
    name: string;
    career_url: string;
    logo: string | null; // URL string or null
    mission_statement: string;
    core_values: string[];
    culture_keywords: string[];
    created_at?: string; // Optional, if provided by API
}

// For form data
type CompanyFormData = Omit<CompanyData, 'id' | 'created_at' | 'logo'> & { logoFile?: File | null };

function CompanyView() {
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
    const [companyFormData, setCompanyFormData] = useState<CompanyFormData>({
        name: '',
        career_url: '',
        mission_statement: '',
        core_values: [],
        culture_keywords: [],
        logoFile: null,
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<CompanyData | null>(null);

   const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
        console.error("API Error:", err);
        let errorMsg = defaultMessage;
        if (err instanceof AxiosError) {
            if (err.response) {
                errorMsg += ` Status: ${err.response.status}.`;
                if (err.response.data && err.response.data.detail) {
                    errorMsg += ` Detail: ${err.response.data.detail}`;
                } else if (typeof err.response.data === 'string') {
                    errorMsg += ` Detail: ${err.response.data.substring(0,300)}`;
                } else {
                    try { errorMsg += ` Detail: ${JSON.stringify(err.response.data).substring(0,300)}`; }
                    catch { /* Ignore stringify error */ }
                }
            } else if (err.request) {
                errorMsg = "No response from server. Check your network connection.";
            } else {
                errorMsg = `Error: ${err.message}`;
            }
        }
        setError(errorMsg); // setError is stable
        toast.error(errorMsg); // toast.error is stable
    }, [setError]);

    const fetchCompanies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await securedApi.get<CompanyData[]>('/api/v1/companies/');
            setCompanies(response.data);
        } catch (err) {
            handleApiError(err, "Failed to fetch companies.");
        } finally {
            setIsLoading(false);
        }
    }, [handleApiError, setIsLoading, setError, setCompanies]); // Dependencies of fetchCompanies

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const resetFormData = () => {
        setCompanyFormData({
            name: '',
            career_url: '',
            mission_statement: '',
            core_values: [],
            culture_keywords: [],
            logoFile: null,
        });
        setEditingCompany(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCompanyFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJsonFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fieldName: 'core_values' | 'culture_keywords') => {
        setCompanyFormData(prev => ({ ...prev, [fieldName]: e.target.value.split(',').map(s => s.trim()).filter(s => s) }));
    };
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCompanyFormData(prev => ({ ...prev, logoFile: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Or a specific form loading state

        const formData = new FormData();
        formData.append('name', companyFormData.name);
        formData.append('career_url', companyFormData.career_url);
        formData.append('mission_statement', companyFormData.mission_statement);
        
        // Django JSONField can often take a JSON string
        formData.append('core_values', JSON.stringify(companyFormData.core_values));
        formData.append('culture_keywords', JSON.stringify(companyFormData.culture_keywords));

        if (companyFormData.logoFile) {
            formData.append('logo', companyFormData.logoFile);
        }

        try {
            if (editingCompany) {
                await securedApi.put(`/api/v1/companies/${editingCompany.id}/update/`, formData, {
                     headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Company updated successfully!");
            } else {
                await securedApi.post('/api/v1/companies/create/', formData, {
                     headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Company created successfully!");
            }
            setIsFormModalOpen(false);
            fetchCompanies(); // Refresh list
            resetFormData();
        } catch (err) {
            handleApiError(err, editingCompany ? "Failed to update company." : "Failed to create company.");
        } finally {
            setIsLoading(false); // Or a specific form loading state
        }
    };

    const openCreateModal = () => {
        resetFormData();
        setEditingCompany(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (company: CompanyData) => {
        setEditingCompany(company);
        setCompanyFormData({
            name: company.name,
            career_url: company.career_url,
            mission_statement: company.mission_statement,
            core_values: company.core_values || [],
            culture_keywords: company.culture_keywords || [],
            logoFile: null, 
        });
        setIsFormModalOpen(true);
    };
    
    const openDeleteModal = (company: CompanyData) => {
        setCompanyToDelete(company);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!companyToDelete) return;
        try {
            await securedApi.delete(`/api/v1/companies/${companyToDelete.id}/`); // Assuming standard RESTful DELETE
            toast.success(`Company "${companyToDelete.name}" deleted successfully.`);
            setIsDeleteModalOpen(false);
            setCompanyToDelete(null);
            fetchCompanies(); // Refresh list
        } catch (err) {
             handleApiError(err, "Failed to delete company.");
        }
    };


    if (isLoading && companies.length === 0) { // Show full page skeleton only on initial load
        return (
            <div className="container mx-auto p-4 md:p-8 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-10 w-2/5 bg-gray-300 rounded" />
                    <Skeleton className="h-10 w-32 bg-gray-300 rounded" />
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full bg-gray-300 rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    if (error && companies.length === 0) { // Show full page error only if no data could be loaded initially
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <Building className="mr-3 h-8 w-8 text-indigo-600" /> Manage Companies
                </h1>
                <Button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700">
                    <PlusCircle size={18} className="mr-2" /> Create Company
                </Button>
            </div>
             {error && <Alert variant="destructive" className="mb-4"> {/* Show non-critical errors here */}
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>}

            {companies.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-md">
                    <Briefcase size={60} className="text-gray-400 mb-5" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Companies Found</h2>
                    <p className="text-gray-500 max-w-md">Get started by creating a new company.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-100">
                            <TableRow>
                                <TableHead className="px-4 py-3 md:px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Logo</TableHead>
                                <TableHead className="px-4 py-3 md:px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</TableHead>
                                <TableHead className="px-4 py-3 md:px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Mission (Snippet)</TableHead>
                                <TableHead className="px-4 py-3 md:px-6 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-200">
                            {companies.map((company) => (
                                <TableRow key={company.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                                    <TableCell className="px-4 py-3 md:px-6">
                                        {company.logo ? (
                                            <img src={company.logo} alt={`${company.name} logo`} className="h-10 w-10 bg-indigo-300 object-contain rounded-full" />
                                        ): (
                                            <div className="h-10 w-10 bg-gray-200 rounded-sm flex items-center justify-center text-gray-400 text-xs">No Logo</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 md:px-6">
                                        <div className="text-sm font-medium text-slate-900">{company.name}</div>
                                        <a href={company.career_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                                            Career Page <LinkIcon size={12} className="inline ml-1"/>
                                        </a>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 md:px-6 text-sm text-slate-600 max-w-xs truncate" title={company.mission_statement}>
                                        {company.mission_statement.substring(0, 100)}{company.mission_statement.length > 100 && '...'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 md:px-6 whitespace-nowrap text-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(company)} className="text-blue-600 border-blue-300 hover:bg-blue-50">
                                            <Edit size={14} className="mr-1" /> Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openDeleteModal(company)} className="text-red-600 border-red-300 hover:bg-red-50">
                                            <Trash2 size={14} className="mr-1" /> Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create/Edit Company Modal */}
            <Dialog open={isFormModalOpen} onOpenChange={(isOpen) => {
                setIsFormModalOpen(isOpen);
                if (!isOpen) resetFormData();
            }}>
                <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                     <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {editingCompany ? 'Edit Company' : 'Create New Company'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCompany ? `Update details for ${editingCompany.name}.` : 'Fill in the details to add a new company.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Company Name</Label>
                            <Input id="name" name="name" value={companyFormData.name} onChange={handleInputChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="career_url" className="text-sm font-medium text-gray-700">Career Page URL</Label>
                            <Input id="career_url" name="career_url" type="url" value={companyFormData.career_url} onChange={handleInputChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="mission_statement" className="text-sm font-medium text-gray-700">Mission Statement</Label>
                            <Textarea id="mission_statement" name="mission_statement" value={companyFormData.mission_statement} onChange={handleInputChange} required rows={3} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="core_values" className="text-sm font-medium text-gray-700">Core Values (comma-separated)</Label>
                            <Textarea id="core_values" name="core_values" value={companyFormData.core_values.join(', ')} onChange={(e) => handleJsonFieldChange(e, 'core_values')} rows={2} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="culture_keywords" className="text-sm font-medium text-gray-700">Culture Keywords (comma-separated)</Label>
                            <Textarea id="culture_keywords" name="culture_keywords" value={companyFormData.culture_keywords.join(', ')} onChange={(e) => handleJsonFieldChange(e, 'culture_keywords')} rows={2} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="logoFile" className="text-sm font-medium text-gray-700">Company Logo</Label>
                            <Input id="logoFile" name="logoFile" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1 py-4 h-14 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            {editingCompany && editingCompany.logo && !companyFormData.logoFile && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Current logo:</p>
                                    <img src={editingCompany.logo} alt="Current logo" className="h-16 w-auto rounded border p-1" />
                                </div>
                            )}
                        </div>
                        <DialogFooter className="pt-5">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                {editingCompany ? 'Save Changes' : 'Create Company'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            {companyToDelete && (
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Confirm Deletion</DialogTitle>
                            <DialogDescription className="mt-2">
                                Are you sure you want to delete the company "<strong>{companyToDelete.name}</strong>"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-6 sm:justify-end space-x-2">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => setCompanyToDelete(null)}>Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete Company
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default CompanyView;