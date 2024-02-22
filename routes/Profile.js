const express = require("express")
const {router, isInstructor} = express.Router()
const { auth } = require("../middlewares/auth")
const {deleteAccount,updateProfile,getAllUserDetails,updateDisplayPicture,getEnrolledCourses,instructorDashboard} = require("../controllers/Profile")

router.delete("/deleteProfile", deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router