import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Bell, Menu, X, Shield, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT, NOTIFICATION_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUnreadNotificationsCount();
        }
    }, [user]);

    const fetchUnreadNotificationsCount = async () => {
        try {
            const response = await axios.get(NOTIFICATION_API_END_POINT, {
                withCredentials: true
            });

            if (response.data.success) {
                const unreadNotifications = response.data.notifications.filter(n => !n.read);
                setUnreadCount(unreadNotifications.length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const navigateHome = () => {
        navigate("/");
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-[#14389C] font-semibold border-b-2 border-[#14389C]' : 'hover:text-[#14389C]';
    };

    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            {/* Government style header band */}
            <div className="bg-orange-500 py-1">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-white text-xs">
                        <div>
                            भारत सरकार | Government of India
                        </div>
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center">
                        <Shield className="h-8 w-8 text-blue-700 mr-2" />
                        <Link to="/" className="text-2xl font-bold text-blue-700">
                            RojGar
                        </Link>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Official Portal
                        </span>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <div className='hidden md:flex items-center gap-8'>
                        <ul className='flex font-medium items-center gap-5 text-gray-700'>
                            {
                                user && user.role === 'recruiter' ? (
                                    <>
                                        <li><Link to="/admin/companies" className={isActive("/admin/companies")}>Companies</Link></li>
                                        <li><Link to="/admin/jobs" className={isActive("/admin/jobs")}>Jobs</Link></li>
                                        <li><Link to="/guidelines" className={isActive("/guidelines")}>Guidelines</Link></li>
                                        <li><Link to="/tools" className={isActive("/tools")}>Tools</Link></li>
                                        <li><Link to="/groups" className={isActive("/groups")}>Groups</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/" className={isActive("/")}>Home</Link></li>
                                        <li><Link to="/jobs" className={isActive("/jobs")}>Jobs</Link></li>
                                        <li><Link to="/browse" className={isActive("/browse")}>Browse</Link></li>
                                        <li><Link to="/guidelines" className={isActive("/guidelines")}>Guidelines</Link></li>
                                        <li><Link to="/tools" className={isActive("/tools")}>Tools</Link></li>
                                        <li><Link to="/groups" className={isActive("/groups")}>Groups</Link></li>
                                    </>
                                )
                            }
                        </ul>
                        <div className='flex items-center gap-4'>
                            {user && (
                                <Link to="/notifications" className="relative">
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            {
                                !user ? (
                                    <div className='flex items-center gap-2'>
                                        <Link to="/login"><Button variant="outline" className="border-[#14389C] text-[#14389C] hover:bg-blue-50">Login</Button></Link>
                                        <Link to="/signup"><Button className="bg-[#14389C] hover:bg-blue-800 text-white">Signup</Button></Link>
                                    </div>
                                ) : (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="relative">
                                                <Avatar className="cursor-pointer border-2 border-[#14389C]">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                </Avatar>
                                                {user?.isAadharVerified && user?.role === 'student' && (
                                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                                {user?.isGstinVerified && user?.role === 'recruiter' && (
                                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className=''>
                                                <div className='flex gap-2 space-y-2'>
                                                    <Avatar className="cursor-pointer border-2 border-[#14389C]">
                                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center">
                                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                                            {user?.isAadharVerified && user?.role === 'student' && (
                                                                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Verified
                                                                </span>
                                                            )}
                                                            {user?.isGstinVerified && user?.role === 'recruiter' && (
                                                                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                                        {user?.role === 'student' && user?.aadharNumber && (
                                                            <p className="text-xs text-gray-500">Aadhar: XXXX-XXXX-{user.aadharNumber}</p>
                                                        )}
                                                        {user?.role === 'recruiter' && user?.gstin && (
                                                            <p className="text-xs text-gray-500">GSTIN: {user.gstin}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col my-2 text-gray-600'>
                                                    {
                                                        user && user.role === 'student' && (
                                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                                <User2 />
                                                                <Button variant="link" className="text-[#14389C]"> <Link to="/profile">View Profile</Link></Button>
                                                            </div>
                                                        )
                                                    }

                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <LogOut />
                                                        <Button onClick={logoutHandler} variant="link" className="text-[#14389C]">Logout</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>



            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white pb-4 px-4 border-t border-gray-200">
                    <ul className='flex flex-col font-medium gap-3 text-gray-700 mt-2'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className={isActive("/admin/companies") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className={isActive("/admin/jobs") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
                                    <li><Link to="/guidelines" className={isActive("/guidelines") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Guidelines</Link></li>
                                    <li><Link to="/tools" className={isActive("/tools") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Tools</Link></li>
                                    <li><Link to="/groups" className={isActive("/groups") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Groups</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className={isActive("/") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                                    <li><Link to="/jobs" className={isActive("/jobs") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
                                    <li><Link to="/browse" className={isActive("/browse") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Browse</Link></li>
                                    <li><Link to="/guidelines" className={isActive("/guidelines") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Guidelines</Link></li>
                                    <li><Link to="/tools" className={isActive("/tools") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Tools</Link></li>
                                    <li><Link to="/groups" className={isActive("/groups") + " block py-2"} onClick={() => setMobileMenuOpen(false)}>Groups</Link></li>
                                </>
                            )
                        }
                        {
                            !user && (
                                <div className='flex items-center gap-2 pt-2'>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="border-[#14389C] text-[#14389C] hover:bg-blue-50">Login</Button></Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}><Button className="bg-[#14389C] hover:bg-blue-800 text-white">Signup</Button></Link>
                                </div>
                            )
                        }
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;