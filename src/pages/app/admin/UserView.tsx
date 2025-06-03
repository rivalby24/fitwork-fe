import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For company dropdown
import { Edit, Trash2, PlusCircle, AlertCircle, Users as UsersIcon, UserCog } from 'lucide-react'; // Renamed Users to UsersIcon
import { securedApi } from '@/lib/api';
import { AxiosError } from 'axios';
import { toast } from "sonner";

interface FitworkAdminUserData {
    id: string;
    username: string;
    email: string;
    is_candidate: boolean;
    is_company_admin: boolean;
    is_fitwork_admin: boolean;
    company: string | null;
    company_name?: string; 
}

// For User Form
type UserFormData = {
    email: string;
    username: string;
    password?: string; // Optional for edit, required for create
    is_candidate: boolean;
    is_company_admin: boolean;
    is_fitwork_admin: boolean;
    company_id: string | null; // Store as string for Select compatibility, or null
};

// Minimal company data for dropdown
interface CompanyOption {
    id: string;
    name: string;
}

function UserView() {
    const [users, setUsers] = useState<FitworkAdminUserData[]>([]);
    const [companies, setCompanies] = useState<CompanyOption[]>([]); // For company dropdown in form
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<FitworkAdminUserData | null>(null);
    const [userFormData, setUserFormData] = useState<UserFormData>({
        email: '',
        username: '',
        password: '',
        is_candidate: true,
        is_company_admin: false,
        is_fitwork_admin: false,
        company_id: null,
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<FitworkAdminUserData | null>(null);
    
    const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
        console.error("API Error:", err);
        let errorMsg = defaultMessage;
        if (err instanceof AxiosError) {
            if (err.response) {
                errorMsg += ` Status: ${err.response.status}.`;
                if (err.response.data && err.response.data.detail) {
                    errorMsg += ` Detail: ${err.response.data.detail}`;
                } else if (err.response.data && typeof err.response.data === 'object') {
                    const drfErrors = err.response.data as Record<string, string[] | string>;
                    const firstErrorField = Object.keys(drfErrors)[0];
                    if (firstErrorField) {
                        const firstMessage = Array.isArray(drfErrors[firstErrorField]) ? (drfErrors[firstErrorField] as string[])[0] : drfErrors[firstErrorField];
                        errorMsg += ` ${firstErrorField}: ${firstMessage}`;
                    } else {
                        errorMsg += ` Detail: ${JSON.stringify(err.response.data).substring(0,100)}`;
                    }
                } else if (typeof err.response.data === 'string') {
                    errorMsg += ` Detail: ${err.response.data.substring(0,300)}`;
                }
            } else if (err.request) {
                errorMsg = "No response from server. Check your network connection.";
            } else {
                errorMsg = `Error: ${err.message}`;
            }
        }
        setError(errorMsg); 
        toast.error(errorMsg);
    }, [setError]); 

    // Memoize fetchUsersAndCompanies
    const fetchUsersAndCompanies = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const usersResponse = await securedApi.get<FitworkAdminUserData[]>('/api/v1/admin/users/');
            setUsers(usersResponse.data); // setUsers is stable
            
            const companiesResponse = await securedApi.get<CompanyOption[]>('/api/v1/companies/'); 
            setCompanies(companiesResponse.data); // setCompanies is stable
        } catch (err) {
            handleApiError(err, "Failed to fetch user or company data.");
        } finally {
            setIsLoading(false); // setIsLoading is stable
        }
    }, [handleApiError, setIsLoading, setError, setCompanies, setUsers]); // Dependencies for this useCallback

    useEffect(() => {
        fetchUsersAndCompanies();
    }, [fetchUsersAndCompanies]);

    const resetFormData = () => {
        setUserFormData({
            email: '',
            username: '',
            password: '',
            is_candidate: true,
            is_company_admin: false,
            is_fitwork_admin: false,
            company_id: null,
        });
        setEditingUser(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUserFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleCompanyChange = (companyId: string) => {
        setUserFormData(prev => ({ ...prev, company_id: companyId === "null" ? null : companyId }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { company_id, ...restOfPayload } = userFormData;
        
        const payload: Partial<UserFormData> & { company?: string | null } = { ...restOfPayload };

        if (userFormData.is_company_admin && company_id) {
            payload.company = company_id;
        } else if (userFormData.is_company_admin && !company_id) {
            toast.error("Please select a company for the company admin.");
            return;
        } else {
            payload.company = null; // Ensure company is null if not a company admin
        }
        
        if (editingUser && (!userFormData.password || userFormData.password === '')) {
            delete payload.password;
        } else if (!editingUser && (!userFormData.password || userFormData.password === '')) {
            toast.error("Password is required for new users.");
            return;
        }
        
        // Ensure is_fitwork_admin is always false when submitting from this form
        payload.is_fitwork_admin = false;

        try {
            if (editingUser) {
                await securedApi.put(`/api/v1/admin/users/${editingUser.id}/`, payload);
                toast.success("User updated successfully!");
            } else {
                await securedApi.post('/api/v1/admin/users/', payload); // POST to the list endpoint for creation
                toast.success("User created successfully!");
            }
            setIsFormModalOpen(false);
            fetchUsersAndCompanies(); 
            resetFormData();
        } catch (err) {
             handleApiError(err, editingUser ? "Failed to update user." : "Failed to create user.");
        }
    };
    
    const openCreateModal = () => {
        resetFormData();
        setIsFormModalOpen(true);
    };

    const openEditModal = (user: FitworkAdminUserData) => {
        setEditingUser(user);
        setUserFormData({
            email: user.email,
            username: user.username,
            password: '',
            is_candidate: user.is_candidate,
            is_company_admin: user.is_company_admin,
            is_fitwork_admin: user.is_fitwork_admin,
            company_id: user.company || null,
        });
        setIsFormModalOpen(true);
    };

    const openDeleteModal = (user: FitworkAdminUserData) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        try {
            await securedApi.delete(`/api/v1/admin/users/${userToDelete.id}/`); // Example endpoint
            toast.success(`User "${userToDelete.username}" deleted successfully.`);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsersAndCompanies(); // Refresh list
        } catch (err) {
            handleApiError(err, "Failed to delete user.");
        }
    };
    
    const getUserRoles = (user: FitworkAdminUserData): string => {
        const roles = [];
        if (user.is_candidate) roles.push("Candidate");
        if (user.is_company_admin) roles.push("Company Admin");
        return roles.join(', ') || 'No Role';
    };


    if (isLoading && users.length === 0) {
        return (
             <div className="container mx-auto p-4 md:p-8 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-10 w-2/5 bg-gray-300 rounded" />
                    <Skeleton className="h-10 w-32 bg-gray-300 rounded" />
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full bg-gray-300 rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
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
                   <UserCog className="mr-3 h-8 w-8 text-indigo-600" /> Manage Users
                </h1>
                <Button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700">
                    <PlusCircle size={18} className="mr-2" /> Create User
                </Button>
            </div>
            {error && <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>}


            {users.length === 0 && !isLoading ? (
                 <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-md">
                    <UsersIcon size={60} className="text-gray-400 mb-5" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h2>
                    <p className="text-gray-500 max-w-md">Get started by creating a new user.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-100">
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-200">
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-slate-50/70">
                                    <TableCell className="font-medium text-slate-900">{user.username}</TableCell>
                                    <TableCell className="text-slate-600">{user.email}</TableCell>
                                    <TableCell className="text-slate-600 text-xs">{getUserRoles(user)}</TableCell>
                                    <TableCell className="text-slate-600">{user.company_name || 'N/A'}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(user)} className="text-blue-600 border-blue-300 hover:bg-blue-50">
                                            <Edit size={14} className="mr-1" /> Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openDeleteModal(user)} className="text-red-600 border-red-300 hover:bg-red-50">
                                            <Trash2 size={14} className="mr-1" /> Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create/Edit User Modal */}
            <Dialog open={isFormModalOpen} onOpenChange={(isOpen) => {
                setIsFormModalOpen(isOpen);
                if (!isOpen) resetFormData();
            }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {editingUser ? 'Edit User' : 'Create New User'}
                        </DialogTitle>
                         <DialogDescription>
                            {editingUser ? `Update details for ${editingUser.username}.` : 'Fill in the details for the new user.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={userFormData.email} onChange={handleInputChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" value={userFormData.username} onChange={handleInputChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password {editingUser && "(Leave blank to keep current)"}</Label>
                            <Input id="password" name="password" type="password" value={userFormData.password} onChange={handleInputChange} required={!editingUser} className="mt-1" />
                        </div>
                        
                        <div className="space-y-3 pt-2">
                            <Label>Roles:</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="is_candidate" name="is_candidate" checked={userFormData.is_candidate} onCheckedChange={(checked) => setUserFormData(p => ({...p, is_candidate: !!checked}))} />
                                <Label htmlFor="is_candidate" className="font-normal">Candidate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="is_company_admin" name="is_company_admin" checked={userFormData.is_company_admin} onCheckedChange={(checked) => setUserFormData(p => ({...p, is_company_admin: !!checked}))} />
                                <Label htmlFor="is_company_admin" className="font-normal">Company Admin</Label>
                            </div>
                             {userFormData.is_company_admin && (
                                <div className="pl-6">
                                    <Label htmlFor="company_id">Assign to Company</Label>
                                     <Select value={userFormData.company_id || "null"} onValueChange={handleCompanyChange}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">None</SelectItem>
                                            {companies.map(company => (
                                                <SelectItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="pt-5">
                            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">{editingUser ? 'Save Changes' : 'Create User'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Modal */}
            {userToDelete && (
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Confirm User Deletion</DialogTitle>
                            <DialogDescription className="mt-2">
                                Are you sure you want to delete the user "<strong>{userToDelete.username}</strong>" ({userToDelete.email})? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-6 sm:justify-end space-x-2">
                            <DialogClose asChild><Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button></DialogClose>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default UserView;