const express = require("express")
const router = express.Router()

const { createCourse,getAllCourses,getCourseDetails,getFullCourseDetails,editCourse,getInstructorCourses,deleteCourse} = require("../controllers/Course")

const {showAllCategories,createCategory,categoryPageDetails} = require("../controllers/Category")

const {createSection,updateSection,deleteSection} = require("../controllers/Section")

const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/Subsection")

const {createRating,getAverageRating,getAllRating} = require("../controllers/RatingAndReview")

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

const {updateCourseProgress, getProgressPercentage} = require ("../controllers/courseProgress")

//Routes
router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.get("/getAllCourses", getAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
router.delete("/deleteCourse", deleteCourse)
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router