import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import ChatMessage from './ChatMessage';
import JobAlertCard from './JobAlertCard';
import SelectJobDialog from './SelectJobDialog';
import { ArrowLeft, Send, Users, Briefcase, LogOut, UserPlus } from 'lucide-react';
import { GROUP_API_END_POINT } from '@/utils/constant';
import { setCurrentGroup, setMessages, addMessage } from '@/redux/groupSlice';
import useGroupSocket from '@/hooks/useGroupSocket';
import { sendMessage } from '@/services/socketService';

const GroupChat = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGroup, messages, loading } = useSelector(state => state.group);
  const { user } = useSelector(state => state.auth);
  
  const [messageInput, setMessageInput] = useState('');
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize socket connection
  const socket = useGroupSocket(groupId);
  
  // Add socket message listener
  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('newMessage', (message) => {
        dispatch(addMessage(message));
      });

      // Clean up listener when component unmounts
      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, dispatch]);
  
  // Fetch group details and messages
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Fetch group details
        const groupResponse = await axios.get(
          `${GROUP_API_END_POINT}/${groupId}`,
          { withCredentials: true }
        );
        
        if (groupResponse.data.success) {
          dispatch(setCurrentGroup(groupResponse.data.group));
          
          // Check if user is a member to fetch messages
          const userIsMember = groupResponse.data.group.members.some(
            member => member._id === user?._id
          );
          
          if (userIsMember) {
            // Fetch messages only if user is a member
            const messagesResponse = await axios.get(
              `${GROUP_API_END_POINT}/${groupId}/messages`,
              { withCredentials: true }
            );
            
            if (messagesResponse.data.success) {
              dispatch(setMessages(messagesResponse.data.messages));
            }
          } else {
            // Clear messages if user is not a member
            dispatch(setMessages([]));
          }
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
        toast.error(error.response?.data?.message || 'Failed to load group data');
        // If there's an error, navigate back to the groups directory
        navigate('/groups');
      }
    };
    
    if (user) {
      fetchGroupData();
    }
    
    // Cleanup
    return () => {
      dispatch(setCurrentGroup(null));
      dispatch(setMessages([]));
    };
  }, [groupId, user, dispatch, navigate]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    try {
      const response = await axios.post(
        `${GROUP_API_END_POINT}/${groupId}/messages`,
        { content: messageInput },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setMessageInput('');
        
        // Add message locally for immediate feedback
        dispatch(addMessage(response.data.data));
        
        // Emit the message via socket
        if (socket) {
          sendMessage(groupId, response.data.data);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };
  
  const handleJoinLeaveGroup = async () => {
    try {
      setIsJoining(true);
      const isCurrentMember = currentGroup.members.some(
        member => member._id === user?._id
      );
      
      const endpoint = isCurrentMember ? 'leave' : 'join';
      const response = await axios.post(
        `${GROUP_API_END_POINT}/${groupId}/${endpoint}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        
        // Refresh group data
        const groupResponse = await axios.get(
          `${GROUP_API_END_POINT}/${groupId}`,
          { withCredentials: true }
        );
        
        if (groupResponse.data.success) {
          dispatch(setCurrentGroup(groupResponse.data.group));
          
          // If user just joined, fetch messages
          if (!isCurrentMember) {
            const messagesResponse = await axios.get(
              `${GROUP_API_END_POINT}/${groupId}/messages`,
              { withCredentials: true }
            );
            
            if (messagesResponse.data.success) {
              dispatch(setMessages(messagesResponse.data.messages));
            }
          } else {
            // User left, clear messages
            dispatch(setMessages([]));
          }
        }
      }
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleJobAlertSuccess = (message) => {
    // This will be handled by the socket connection to avoid duplication
  };
  
  const isGroupMember = currentGroup?.members?.some(
    member => member._id === user?._id
  );
  
  if (loading || !currentGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Chat */}
          <div className="flex-grow md:w-2/3">
            {/* Header */}
            <div className="bg-white p-4 rounded-t-lg shadow-sm border border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-2 p-2"
                  onClick={() => navigate('/groups')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold">{currentGroup.name}</h1>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {currentGroup.members.length} members
                  </p>
                </div>
              </div>
              
              {user && (
                <Button
                  variant={isGroupMember ? "destructive" : "default"}
                  className={isGroupMember ? "bg-red-500" : "bg-purple-600"}
                  onClick={handleJoinLeaveGroup}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isGroupMember ? (
                    <>
                      <LogOut className="h-4 w-4 mr-2" /> Leave Group
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" /> Join Group
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {/* Messages Area */}
            <div 
              className="bg-white p-4 h-[calc(100vh-320px)] overflow-y-auto border-l border-r border-gray-200"
              style={{ minHeight: '400px' }}
            >
              {!user ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Please <Link to="/login" className="text-purple-600 mx-1 hover:underline">log in</Link> to view and participate in group discussions
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map(message => (
                    <ChatMessage key={message._id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  {isGroupMember 
                    ? "No messages yet. Be the first to start the conversation!" 
                    : "Join the group to participate in discussions"}
                </div>
              )}
            </div>
            
            {/* Message Input */}
            {user ? (
              isGroupMember ? (
                <form 
                  onSubmit={handleSendMessage}
                  className="bg-white p-4 rounded-b-lg shadow-sm border border-t-0 border-gray-200 flex gap-2"
                >
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                  />
                  <Button type="submit" className="bg-purple-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="bg-gray-100 p-4 rounded-b-lg text-center text-gray-500 border border-t-0 border-gray-200">
                  Join the group to send messages
                </div>
              )
            ) : (
              <div className="bg-gray-100 p-4 rounded-b-lg text-center text-gray-500 border border-t-0 border-gray-200">
                Log in to join and send messages
              </div>
            )}
          </div>
          
          {/* Right Column - Job Alerts & Group Info */}
          <div className="md:w-1/3">
            {/* Group Description */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h2 className="font-bold text-lg mb-2">About this Group</h2>
              <p className="text-gray-600 mb-3">{currentGroup.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Profession:</span>
                <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {currentGroup.profession}
                </span>
              </div>
            </div>
            
            {/* Job Alerts */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Job Alerts</h2>
                {user && isGroupMember && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-purple-600 border-purple-200"
                    onClick={() => setShowJobDialog(true)}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Share Job
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {currentGroup.jobAlerts && currentGroup.jobAlerts.length > 0 ? (
                  currentGroup.jobAlerts.map(job => (
                    <JobAlertCard key={job._id} job={job} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No job alerts yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <SelectJobDialog 
        open={showJobDialog} 
        setOpen={setShowJobDialog} 
        groupId={groupId}
        onSuccess={handleJobAlertSuccess}
      />
    </div>
  );
};

export default GroupChat;
