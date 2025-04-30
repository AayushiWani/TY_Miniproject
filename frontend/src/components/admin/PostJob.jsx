import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

// Common professions list for reuse
export const professionsList = [
    "Carpenter",
    "Plumber",
    "Electrician",
    "Painter",
    "Mason",
    "Landscaper",
    "Driver",
    "Cleaner",
    "Security Guard",
    "Cook",
    "Tailor",
    "Mechanic",
    "Welder",
    "Fabricator",
    "Helper"
];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        contact: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        profession: "",
        quotaEnabled: false,
        quotaTotal: 0
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (checked) => {
        setInput({ ...input, quotaEnabled: checked });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({...input, companyId: selectedCompany._id});
    };

    const selectProfessionHandler = (value) => {
        setInput({...input, profession: value});
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate quota if enabled
        if (input.quotaEnabled && (!input.quotaTotal || input.quotaTotal <= 0)) {
            toast.error("Please set a valid quota total");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if(res.data.success) {
                toast.success(res.data.message);

                // Show additional toast about the hiring group
                if (res.data.hiringGroupId) {
                    toast.info(
                        <div>
                            <p>A hiring group has been created for this job.</p>
                            <p className="text-xs mt-1">Applicants will be automatically added to this group.</p>
                        </div>,
                        { duration: 5000 }
                    );
                }

                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5 px-4'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl w-full border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='text-2xl font-bold mb-6'>Post New Job</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Contact</Label>
                            <Input
                                type="text"
                                name="contact"
                                value={input.contact}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level (years)</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>

                        {/* New Profession field */}
                        <div>
                            <Label>Profession</Label>
                            <Select onValueChange={selectProfessionHandler}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a Profession" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {professionsList.map((profession) => (
                                            <SelectItem key={profession} value={profession.toLowerCase()}>
                                                {profession}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Company Selection */}
                        {companies.length > 0 && (
                            <div>
                                <Label>Company</Label>
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Quota section */}
                    <div className="border-t mt-6 pt-4">
                        <h3 className="font-medium mb-2">Job Quota Settings</h3>
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox
                                id="quotaEnabled"
                                checked={input.quotaEnabled}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label htmlFor="quotaEnabled" className="flex items-center gap-2">
                                <span>Enable quota for this job</span>
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800">
                                    Recommended for group hiring
                                </Badge>
                            </Label>
                        </div>

                        {input.quotaEnabled && (
                            <div className="mb-4 bg-blue-50 p-4 rounded-md border border-blue-100">
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="w-full md:w-1/2">
                                        <Label className="font-medium">Maximum Number of Applicants</Label>
                                        <Input
                                            type="number"
                                            name="quotaTotal"
                                            value={input.quotaTotal}
                                            onChange={changeEventHandler}
                                            className="mt-1 bg-white"
                                            placeholder="e.g. 15"
                                            min="1"
                                        />
                                        <p className="text-xs text-gray-600 mt-1">
                                            Job will automatically close when this limit is reached.
                                        </p>
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <h4 className="font-medium mb-2">How it works:</h4>
                                        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                                            <li>Set a maximum number of workers needed</li>
                                            <li>Job posting will show progress (e.g., "5/15 painters")</li>
                                            <li>Job automatically closes when quota is filled</li>
                                            <li>You'll receive a notification when quota is reached</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Post New Job
                        </Button>
                    )}

                    {companies.length === 0 && (
                        <p className='text-xs text-red-600 font-bold text-center my-3'>
                            *Please register a company first, before posting a job
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostJob