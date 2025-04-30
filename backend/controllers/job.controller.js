import { Job } from "../models/job.model.js";
import { Group } from "../models/group.model.js";
import { Message } from "../models/message.model.js";
import { createNotification } from "./notification.controller.js";

// admin post krega job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      contact,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      profession,
      quotaEnabled,
      quotaTotal,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !contact ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId ||
      !profession
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    // Create job with quota information if provided
    const job = await Job.create({
      title,
      contact,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experience),
      position: Number(position),
      profession,
      company: companyId,
      created_by: userId,
      quota: {
        enabled: quotaEnabled === 'true' || quotaEnabled === true,
        total: quotaTotal ? Number(quotaTotal) : 0,
        filled: 0
      }
    });

    // Create a hiring process group for this job
    const groupName = `${title} Hiring Process`;
    const groupDescription = `Group for managing applicants for the ${title} position. All applicants will be automatically added to this group.`;

    // Check if a group with this name already exists
    let hiringGroup = await Group.findOne({ name: groupName });

    if (!hiringGroup) {
      // Create new group if it doesn't exist
      hiringGroup = await Group.create({
        name: groupName,
        description: groupDescription,
        profession: profession,
        creator: userId,
        members: [userId] // Creator is the first member
      });

      // Add job to group's job alerts
      hiringGroup.jobAlerts.push(job._id);
      await hiringGroup.save();

      // Create initial message in the group
      await Message.create({
        group: hiringGroup._id,
        sender: userId,
        content: `This group has been created for managing applicants for the "${title}" position. All applicants will be automatically added to this group.`,
        isJobAlert: true,
        jobId: job._id
      });
    }

    return res.status(201).json({
      message: "New job created successfully. A hiring group has also been created for this job.",
      job,
      hiringGroupId: hiringGroup._id,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// Enhanced getAllJobs with better filtering
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, profession, salary, jobType } = req.query;

    // Build query object based on filters provided
    let query = { isActive: true }; // Only return active jobs

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (profession) {
      query.profession = { $regex: profession, $options: "i" };
    }

    if (salary) {
      // For simplicity, assuming salary is stored as a number
      // We'll need to handle this more carefully in a real app
      const numSalary = Number(salary);
      if (!isNaN(numSalary)) {
        query.salary = { $gte: numSalary };
      }
    }

    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    // Find the hiring group for this job
    const hiringGroup = await Group.findOne({
      name: `${job.title} Hiring Process`,
      jobAlerts: { $in: [job._id] }
    });

    return res.status(200).json({
      job,
      hiringGroup: hiringGroup ? {
        _id: hiringGroup._id,
        name: hiringGroup.name
      } : null,
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

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobContact = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).select("contact");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    res.status(200).json({ contact: job.contact, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Add endpoint to get filter options for frontend
export const getFilterOptions = async (req, res) => {
  try {
    // Get distinct locations
    const locations = await Job.distinct('location');

    // Get distinct professions
    const professions = await Job.distinct('profession');

    // Get distinct job types
    const jobTypes = await Job.distinct('jobType');

    // Get salary range (min and max)
    const salaryStats = await Job.aggregate([
      {
        $group: {
          _id: null,
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" }
        }
      }
    ]);

    const salaryRange = salaryStats.length > 0
      ? { min: salaryStats[0].minSalary, max: salaryStats[0].maxSalary }
      : { min: 0, max: 0 };

    return res.status(200).json({
      filters: {
        locations,
        professions,
        jobTypes,
        salaryRange
      },
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
