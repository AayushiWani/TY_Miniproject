import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatMessage = ({ message }) => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const isCurrentUser = message.sender._id === user?._id;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // System messages (join/leave)
  if (message.content.includes('has joined the group') || message.content.includes('has left the group')) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.content} • {formatTime(message.createdAt)}
        </div>
      </div>
    );
  }
  
  // Job alerts
  if (message.isJobAlert && message.jobId) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-purple-100 text-purple-800 border border-purple-200 rounded-lg p-3 max-w-md">
          <div className="flex items-center mb-2">
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="font-medium">Job Alert</span>
          </div>
          <p className="text-sm">{message.content}</p>
          <button 
            className="text-purple-800 underline text-xs mt-2"
            onClick={() => navigate(`/description/${message.jobId._id}`)}
          >
            View Job Details
          </button>
          <div className="text-right text-xs text-gray-500 mt-1">
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    );
  }
  
  // Regular chat messages
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={message.sender.profile?.profilePhoto} />
        </Avatar>
      )}
      
      <div className={`max-w-md ${isCurrentUser ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-2 shadow-sm`}>
        {!isCurrentUser && (
          <div className="font-medium text-sm mb-1">{message.sender.fullname}</div>
        )}
        <p>{message.content}</p>
        <div className={`text-right text-xs ${isCurrentUser ? 'text-purple-200' : 'text-gray-500'} mt-1`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
