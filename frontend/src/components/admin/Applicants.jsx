import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Button } from '../ui/button';
import { ArrowLeft, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hiringGroup, setHiringGroup] = useState(null);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job));
                }

                // Get job details to find the hiring group
                const jobRes = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, { withCredentials: true });
                if (jobRes.data.success && jobRes.data.hiringGroup) {
                    setHiringGroup(jobRes.data.hiringGroup);
                }
            } catch (error) {
                console.error('Error fetching applicants:', error);
                setError(error.response?.data?.message || 'Failed to load applicants');
                toast.error(error.response?.data?.message || 'Failed to load applicants');
            } finally {
                setLoading(false);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    const goBack = () => {
        navigate('/admin/jobs');
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between my-5'>
                    <div className='flex items-center gap-2'>
                        <Button variant="ghost" size="icon" onClick={goBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className='font-bold text-xl'>Applicants {!loading && !error && applicants?.applications?.length > 0 ? `(${applicants.applications.length})` : ''}</h1>
                    </div>

                    {hiringGroup && (
                        <Button
                            onClick={() => navigate(`/groups/${hiringGroup._id}`)}
                            className="bg-orange-500 hover:bg-purple-700 flex items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden md:inline">Hiring Group Chat</span>
                            <span className="md:hidden">Group</span>
                            {!loading && !error && applicants?.applications?.length > 0 && (
                                <span className="ml-1 flex items-center text-xs bg-white text-purple-700 rounded-full px-1.5 py-0.5">
                                    <Users className="h-3 w-3 mr-0.5" />
                                    {applicants.applications.length}
                                </span>
                            )}
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>{error}</p>
                        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <ApplicantsTable />
                )}
            </div>
        </div>
    )
}

export default Applicants