import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ContactButton from "./ContactButton";
import { Progress } from "./ui/progress";
import { Users, Clock, MapPin, Briefcase, CheckCircle2, MessageSquare } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [contactEmail, setContactEmail] = useState("");
  const [hiringGroup, setHiringGroup] = useState(null);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          ); // Ensure the state is in sync with fetched data

          // Set hiring group if available
          if (res.data.hiringGroup) {
            setHiringGroup(res.data.hiringGroup);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  useEffect(() => {
    const fetchContactEmail = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/contact/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setContactEmail(res.data.contact);
        } else {
          toast.error("Failed to fetch contact information");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to fetch contact information");
      }
    };
    fetchContactEmail();
  }, [jobId]);


  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl">{singleJob?.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              <Users className="h-3 w-3 mr-1" />
              {singleJob?.position} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              <Briefcase className="h-3 w-3 mr-1" />
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              ₹{singleJob?.salary}
            </Badge>
            <Badge className={"text-green-700 font-bold"} variant="ghost">
              <MapPin className="h-3 w-3 mr-1" />
              {singleJob?.location}
            </Badge>
            <Badge className={"text-gray-700 font-bold"} variant="ghost">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(singleJob?.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          {/* Quota information */}
          {singleJob?.quota?.enabled && (
            <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 max-w-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  Applications: {singleJob.quota.filled}/{singleJob.quota.total}
                </span>
                <span className="text-xs text-blue-600">
                  {Math.round((singleJob.quota.filled / singleJob.quota.total) * 100)}%
                </span>
              </div>
              <Progress
                value={(singleJob.quota.filled / singleJob.quota.total) * 100}
                className="h-2"
              />
              {singleJob.quota.filled >= singleJob.quota.total && (
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Quota filled
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied || !singleJob?.isActive}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : !singleJob?.isActive
              ? "bg-red-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied
            ? "Already Applied"
            : !singleJob?.isActive
            ? "Applications Closed"
            : "Apply Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length || 0}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : ''}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Profession:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.profession ? singleJob.profession.charAt(0).toUpperCase() + singleJob.profession.slice(1) : ''}
          </span>
        </h1>
        {singleJob?.quota?.enabled && (
          <h1 className="font-bold my-1">
            Quota Status:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob.quota.filled}/{singleJob.quota.total} filled
              {singleJob.quota.filled >= singleJob.quota.total && " (Closed)"}
            </span>
          </h1>
        )}
        <h1 className="font-bold my-1">
          Contact The Owner:
          <span className="pl-4">
            <ContactButton email={contactEmail} />
          </span>
        </h1>

        {hiringGroup && (
          <div className="mt-4">
            <Button
              onClick={() => navigate(`/groups/${hiringGroup._id}`)}
              className="bg-orange-500 hover:bg-purple-700 flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Join Hiring Group Chat
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              All applicants are automatically added to the hiring group chat for this job.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescription;