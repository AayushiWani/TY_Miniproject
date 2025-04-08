import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Users, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold truncate">{group.name}</CardTitle>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            {group.profession}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-500 line-clamp-2">
          {group.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{group.members.length} members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Created {formatDate(group.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={group.creator?.profile?.profilePhoto} />
            </Avatar>
            <span className="text-sm">
              Created by <span className="font-medium">{group.creator?.fullname}</span>
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => navigate(`/groups/${group._id}`)} 
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          View Group
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
