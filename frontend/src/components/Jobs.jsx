import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import FilterJobs from './FilterJobs';
import Footer from './shared/Footer';
import { motion } from 'framer-motion';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Loader2, Filter, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation } from 'react-router-dom';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const location = useLocation();

    // Check for query parameters on initial load
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialFilters = {};

        if (queryParams.has('profession')) {
            initialFilters.profession = queryParams.get('profession');
        }
        if (queryParams.has('location')) {
            initialFilters.location = queryParams.get('location');
        }

        if (Object.keys(initialFilters).length > 0) {
            setFilters(initialFilters);
        } else {
            fetchJobs({});
        }
    }, [location.search]);

    // Fetch jobs when filters change
    useEffect(() => {
        fetchJobs(filters);

        // Update URL with filters
        const queryParams = new URLSearchParams();
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.profession) queryParams.append('profession', filters.profession);
        if (filters.jobType) queryParams.append('jobType', filters.jobType);
        if (filters.salary) queryParams.append('salary', filters.salary);

        const queryString = queryParams.toString();
        const newUrl = queryString ? `?${queryString}` : '';

        // Update URL without reloading the page
        window.history.pushState({}, '', `${location.pathname}${newUrl}`);
    }, [filters]);

    const fetchJobs = async (filterParams) => {
        try {
            setLoading(true);

            // Build query params
            const queryParams = new URLSearchParams();
            if (filterParams.location) queryParams.append('location', filterParams.location);
            if (filterParams.profession) queryParams.append('profession', filterParams.profession);
            if (filterParams.jobType) queryParams.append('jobType', filterParams.jobType);
            if (filterParams.salary) queryParams.append('salary', filterParams.salary);

            const response = await axios.get(`${JOB_API_END_POINT}/get?${queryParams.toString()}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setJobs(response.data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const toggleMobileFilters = () => {
        setShowMobileFilters(!showMobileFilters);
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='font-bold text-2xl'>Available Jobs</h1>
                    <div className='md:hidden'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleMobileFilters}
                            className="flex items-center gap-1"
                        >
                            <Filter className="h-4 w-4" />
                            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-6'>
                    {/* Sidebar with filters */}
                    <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-1/4`}>
                        <FilterJobs onFilterChange={handleFilterChange} />
                    </div>

                    {/* Main content */}
                    <div className='w-full md:w-3/4'>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-gray-500 font-medium">No jobs found matching your criteria</p>
                                {Object.values(filters).some(f => f) && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setFilters({})}
                                    >
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-gray-500">
                                        Found <span className="font-medium">{jobs.length}</span> jobs
                                        {Object.values(filters).some(f => f) && ' matching your filters'}
                                    </p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {jobs.map(job => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            key={job._id}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Jobs