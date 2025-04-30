import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, AlertCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setAllApplicants } from '@/redux/applicationSlice';
import { useParams } from 'react-router-dom';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const params = useParams();

    // Refresh applicants data after status update
    const refreshApplicants = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAllApplicants(res.data.job));
            }
        } catch (error) {
            console.error('Error refreshing applicants:', error);
        }
    };

    const statusHandler = async (status, id) => {
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
                // Refresh the applicants list to show updated status
                await refreshApplicants();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent job applicants</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : !applicants || !applicants?.applications || applicants.applications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <AlertCircle className="h-8 w-8 mb-2" />
                                    <p>No applications found for this job</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        applicants.applications.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.applicant?.profile?.resume ?
                                            <a className="text-blue-600 cursor-pointer"
                                               href={item?.applicant?.profile?.resume}
                                               target="_blank"
                                               rel="noopener noreferrer">
                                                {item?.applicant?.profile?.resumeOriginalName || 'View Resume'}
                                            </a> :
                                            <span className="text-gray-500">No resume</span>
                                    }
                                </TableCell>
                                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'accepted' ? 'bg-green-100 text-green-800' : item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="cursor-pointer" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div
                                                        onClick={() => statusHandler(status, item?._id)}
                                                        key={index}
                                                        className={`flex w-fit items-center my-2 cursor-pointer hover:text-${status === 'Accepted' ? 'green' : 'red'}-600`}
                                                    >
                                                        <span>{status}</span>
                                                    </div>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable