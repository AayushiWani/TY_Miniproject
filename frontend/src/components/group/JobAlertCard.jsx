import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

const JobAlertCard = ({ job }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <Badge className="bg-purple-600">{job.jobType}</Badge>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-1" />
              {job.experienceLevel} years exp
            </div>
            
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary} LPA
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full border-purple-200 hover:bg-purple-100"
          onClick={() => navigate(`/description/${job._id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobAlertCard;
