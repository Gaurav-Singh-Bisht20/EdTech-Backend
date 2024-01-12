const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        const newSection = await Section.create({sectionName});
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true},
                                        ).populate({
                                            path: "courseContent",
                                            populate: {
                                                path: "subSection",
                                            },
                                        })
                                        .exec();
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:error.message,
        });
    }
}

exports.updateSection = async (req,res) => {
    try {
        const {sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        });

    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:error.message,
        });
    }
};


exports.deleteSection = async (req,res) => {
    try {
        const {sectionId} = req.params
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })

    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again",
            error:error.message,
        });
    }
}