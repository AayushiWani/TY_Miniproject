import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'

const AdminJobsTable = () => {
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent  posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No jobs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterJobs?.map((job) => (
                                <TableRow key={job._id}>
                                    <TableCell>{job?.company?.name}</TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>{job?.location}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {job?.applications?.length || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {job.isActive ? 'Active' : 'Closed'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(job?.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger><MoreHorizontal className="cursor-pointer" /></PopoverTrigger>
                                            <PopoverContent className="w-40">
                                                <div onClick={()=> navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer hover:text-blue-600'>
                                                    <Edit2 className='w-4' />
                                                    <span>Edit Job</span>
                                                </div>
                                                <div
                                                    onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)}
                                                    className='flex items-center w-fit gap-2 cursor-pointer mt-3 hover:text-purple-600'
                                                >
                                                    <Users className='w-4'/>
                                                    <span>View Applicants</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable