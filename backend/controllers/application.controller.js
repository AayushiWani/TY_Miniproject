import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Group } from "../models/group.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "./notification.controller.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // check if the job exists and is active
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Check if job is still active
        if (!job.isActive) {
            return res.status(400).json({
                message: "This job is no longer accepting applications",
                success: false
            });
        }

        // Check quota if enabled
        if (job.quota.enabled && job.quota.filled >= job.quota.total) {
            job.isActive = false;
            await job.save();

            return res.status(400).json({
                message: "This job has reached its application quota",
                success: false
            });
        }

        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);

        // Update quota if enabled
        if (job.quota.enabled) {
            job.quota.filled += 1;

            // Check if quota is now filled
            if (job.quota.filled >= job.quota.total) {
                job.isActive = false;

                // Notify job creator that quota is filled
                await createNotification({
                    recipient: job.created_by,
                    type: 'job_quota_filled',
                    content: `Your job "${job.title}" has reached its quota of ${job.quota.total} applicants.`,
                    relatedJobId: job._id
                });
            }
        }

        await job.save();

        // Create notification for job poster
        await createNotification({
            recipient: job.created_by,
            sender: userId,
            type: 'job_application',
            content: `New application for your job: ${job.title}`,
            relatedJobId: job._id
        });

        // Find the hiring group for this job
        const hiringGroup = await Group.findOne({
            name: `${job.title} Hiring Process`,
            jobAlerts: { $in: [job._id] }
        });

        if (hiringGroup) {
            // Check if user is already a member
            const isMember = hiringGroup.members.some(memberId =>
                memberId.toString() === userId.toString()
            );

            if (!isMember) {
                // Add user to group members
                hiringGroup.members.push(userId);
                await hiringGroup.save();

                // Get user details for the message
                const user = await User.findById(userId).select('fullname');

                // Add system message about new applicant
                await Message.create({
                    group: hiringGroup._id,
                    sender: userId,
                    content: `${user.fullname} has applied for the job and joined the group.`,
                    isJobAlert: false
                });

                // Create notification for the applicant about being added to the group
                await createNotification({
                    recipient: userId,
                    type: 'group_invitation',
                    content: `You've been added to the "${hiringGroup.name}" group for your job application.`,
                    relatedGroupId: hiringGroup._id,
                    relatedJobId: job._id
                });
            }
        }

        return res.status(201).json({
            message: "Job applied successfully. You've been added to the hiring group for this job.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        // First verify if the job belongs to the current user
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant',
                select: 'fullname email phoneNumber profile' // Include necessary fields
            }
        });

        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            });
        }

        // Check if the current user is the creator of this job
        if(job.created_by.toString() !== userId) {
            return res.status(403).json({
                message:'You are not authorized to view these applicants.',
                success:false
            });
        }

        return res.status(200).json({
            job,
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path: 'job',
            options: {sort: {createdAt: -1}},
            populate: {
                path: 'company',
                options: {sort: {createdAt: -1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            })
        };

        // Find the application by application id and populate job details
        const application = await Application.findById(applicationId).populate('job');
        if(!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        // Create notification for applicant
        await createNotification({
            recipient: application.applicant,
            sender: req.id,
            type: 'job_status_update',
            content: `Your application for ${application.job.title} has been ${status.toLowerCase()}.`,
            relatedJobId: application.job._id
        });

        // Find the hiring group for this job
        const hiringGroup = await Group.findOne({
            name: `${application.job.title} Hiring Process`,
            jobAlerts: { $in: [application.job._id] }
        });

        if (hiringGroup) {
            // Get user details for the message
            const applicant = await User.findById(application.applicant).select('fullname');
            const recruiter = await User.findById(req.id).select('fullname');

            // Add status update message to the group
            await Message.create({
                group: hiringGroup._id,
                sender: req.id,
                content: `${recruiter.fullname} has ${status.toLowerCase()} ${applicant.fullname}'s application.`,
                isJobAlert: false
            });
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};