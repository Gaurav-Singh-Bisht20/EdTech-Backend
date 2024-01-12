const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const {courseName, courseDescription, whatYoutWillLearn, price, tag,status,category,instructions} = req.body;
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYoutWillLearn || !price || !tag || !thumbnail|| !category) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        if(!status || status === undefined){
            status: "Draft"
        }

        //check for instructor
        const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }

        //check given tag is valid or not
        const categoryDetails = await Category.findById(Category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'Category Details not found',
            });
        }

        //Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYoutWillLearn,
            price,
            tag:tag,
            category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
        })

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
        
        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
};





//getAllCourses handler function

exports.getAllCourses = async (req, res) => {
    try {
            const allCourses = await Course.find({},{
                courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
            })
            .populate("instructor")
			.exec();
            return res.status(200).json({
                success:true,
                message:'Data for all courses fetched successfully',
                data:allCourses,
            })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            const {courseId} = req.body;
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}