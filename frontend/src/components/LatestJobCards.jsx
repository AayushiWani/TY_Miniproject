import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={()=> navigate(`/description/${job._id}`)} 
            className='p-5 rounded-md shadow-xl bg-white border-2 border-orange-100 hover:border-orange-200 cursor-pointer transition-all duration-300'
        >
            <div className='flex justify-between items-start'>
                <div>
                    <h1 className='font-medium text-lg text-orange-900'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500 flex items-center gap-1'>
                        <span className='inline-block w-2 h-2 bg-orange-500 rounded-full'></span>
                        India
                    </p>
                </div>
            </div>
            <div className='my-3'>
                <h1 className='font-bold text-lg text-gray-800'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className='bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium' variant="secondary">
                    {job?.position} Openings
                </Badge>
                <Badge className='bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium' variant="secondary">
                    {job?.jobType}
                </Badge>
                <Badge className='bg-green-100 text-green-700 hover:bg-green-200 font-medium' variant="secondary">
                    ₹{job?.salary}K/month
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards