import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { JOB_API_END_POINT, GROUP_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';

const SelectJobDialog = ({ open, setOpen, groupId, onSuccess }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${JOB_API_END_POINT}/get`, { 
          withCredentials: true 
        });
        
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchJobs();
    }
  }, [open]);
  
  const handleShareJob = async (jobId) => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${GROUP_API_END_POINT}/${groupId}/job-alert`,
        { jobId },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Job alert shared in the group');
        setOpen(false);
        onSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Error sharing job alert:', error);
      toast.error(error.response?.data?.message || 'Failed to share job alert');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share a Job with the Group</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4 mt-4">
            {jobs.map(job => (
              <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company?.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-2">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary} LPA</span>
                      <span>•</span>
                      <span>{job.jobType}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={submitting}
                    onClick={() => handleShareJob(job._id)}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Share'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No jobs available to share
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectJobDialog;
