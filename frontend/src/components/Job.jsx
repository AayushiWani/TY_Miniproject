import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Users, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Progress } from './ui/progress'

const Job = ({job}) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {job?.location || 'India'}
                    </div>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">
                    <Users className="h-3 w-3 mr-1" />
                    {job?.position} Positions
                </Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">₹{job?.salary}</Badge>
                {job?.profession && (
                    <Badge className={'text-green-700 font-bold'} variant="ghost">
                        {job.profession.charAt(0).toUpperCase() + job.profession.slice(1)}
                    </Badge>
                )}
            </div>

            {/* Quota information */}
            {job?.quota?.enabled && (
                <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {job.quota.filled}/{job.quota.total} {job?.profession || 'workers'}
                        </span>
                        {job.quota.filled >= job.quota.total ? (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 flex items-center">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Filled
                            </Badge>
                        ) : (
                            <span className="text-xs text-blue-600">
                                {Math.round((job.quota.filled / job.quota.total) * 100)}% filled
                            </span>
                        )}
                    </div>
                    <Progress
                        value={(job.quota.filled / job.quota.total) * 100}
                        className="h-1.5"
                    />
                </div>
            )}

            <div className='flex items-center gap-4 mt-4'>
                <Button
                    onClick={()=> navigate(`/description/${job?._id}`)}
                    variant="outline"
                >
                    View Details
                </Button>
                <Button
                    className={`${!job?.isActive ? 'bg-red-600' : 'bg-[#7209b7]'}`}
                    disabled={!job?.isActive}
                >
                    {!job?.isActive ? 'Closed' : 'Apply Now'}
                </Button>
            </div>
        </div>
    )
}

export default Job