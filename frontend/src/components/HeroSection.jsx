import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center bg-gradient-to-b from-orange-50 to-white'>
            <div className='flex flex-col gap-5 py-16 px-4'>
                <span className='mx-auto px-6 py-2 rounded-full bg-orange-100 text-orange-600 font-medium'>भारत का नंबर 1 रोज़गार पोर्टल</span>
                <h1 className='text-5xl font-bold text-gray-800'>
                    खोजें, आवेदन करें और <br /> 
                    पाएं अपना <span className='text-orange-600'>रोज़गार</span>
                </h1>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                    अपने कौशल के अनुसार नौकरी खोजें। हज़ारों नियोक्ता आपकी प्रतीक्षा कर रहे हैं।
                </p>
                <div className='flex w-[90%] md:w-[60%] lg:w-[40%] shadow-lg border border-orange-200 pl-3 rounded-full items-center gap-4 mx-auto bg-white'>
                    <input
                        type="text"
                        placeholder='अपनी मनपसंद नौकरी खोजें'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full py-3'
                    />
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-r-full bg-orange-600 hover:bg-orange-700 px-6 py-6"
                    >
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
                <div className='flex gap-4 justify-center text-sm text-gray-600 mt-4'>
                    <span>लोकप्रिय: </span>
                    <span className='hover:text-orange-600 cursor-pointer'>निर्माण कार्य</span>
                    <span className='hover:text-orange-600 cursor-pointer'>फैक्टरी जॉब</span>
                    <span className='hover:text-orange-600 cursor-pointer'>ड्राइवर</span>
                </div>
            </div>
        </div>
    )
}

export default HeroSection