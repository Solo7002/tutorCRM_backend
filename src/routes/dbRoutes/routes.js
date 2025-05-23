const express = require('express');
const { cacheMiddleware } = require('../../middlewares/cacheMiddleware');
const router = express.Router();
const authenticateToken=require('../../middlewares/authMiddleware');
const userRoutes = require('./userRoutes');
const studentRoutes = require('./studentRoutes');
const teacherRoutes = require('./teacherRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const materialRoutes = require('./materialRoutes');
const materialVisibilityStudentRoutes = require('./materialVisibilityStudentRoutes');
const userPhoneRoutes = require('./userPhoneRoutes');
const userReviewRoutes = require('./userReviewRoutes');
const reviewComplaintRoutes = require('./reviewComplaintRoutes');
const blockedUserRoutes = require('./blockedUserRoutes');
const userComplaintRoutes = require('./userComplaintRoutes');
const purchasedMaterialRoutes = require('./purchasedMaterialRoutes');
const saleMaterialFileRoutes = require('./saleMaterialFileRoutes');
const saleMaterialRoutes = require('./saleMaterialRoutes');
const studentCourseRatingRoutes = require('./studentCourseRatingRoutes');
const courseRoutes = require('./courseRoutes');
const locationRoutes = require('./locationRoutes');
const subjectRoutes = require('./subjectRoutes');
const markHistoryRoutes = require('./markHistoryRoutes');
const groupRoutes = require('./groupRoutes');
const groupStudentRoutes = require('./groupStudentRoutes');
const plannedLessonRoutes = require('./plannedLessonRoutes');
const hometaskRoutes = require('./hometaskRoutes');
const hometaskFileRoutes = require('./hometaskFileRoutes');
const doneHometaskRoutes = require('./doneHometaskRoutes');
const doneHometaskFileRoutes = require('./doneHometaskFileRoutes');
const testRoutes = require('./testRoutes');
const testQuestionRoutes = require('./testQuestionRoutes');
const testAnswerRoutes = require('./testAnswerRoutes');
const doneTestRoutes = require('./doneTestRoutes');
const selectedAnswerRoutes = require('./selectedAnswerRoutes');

router.use('/api/users',                        /*authenticateToken,*/                              userRoutes);
router.use('/api/students',                     /*authenticateToken,*/                              studentRoutes);
router.use('/api/teachers',                     /*authenticateToken,*/                              teacherRoutes);
router.use('/api/subscriptions',                /*authenticateToken,*/  cacheMiddleware(3600),      subscriptionRoutes);
router.use('/api/materials',                    /*authenticateToken,*/                              materialRoutes);
router.use('/api/materialVisibilityStudents',   /*authenticateToken,*/                              materialVisibilityStudentRoutes);
router.use('/api/userPhones',                   /*authenticateToken,*/                              userPhoneRoutes);
router.use('/api/userReviews',                  /*authenticateToken,*/                              userReviewRoutes);
router.use('/api/reviewComplaints',             /*authenticateToken,*/                              reviewComplaintRoutes);
router.use('/api/blockedUsers',                 /*authenticateToken,*/                              blockedUserRoutes);
router.use('/api/userComplaints',               /*authenticateToken,*/                              userComplaintRoutes);
router.use('/api/purchasedMaterials',           /*authenticateToken,*/                              purchasedMaterialRoutes);
router.use('/api/saleMaterialFiles',            /*authenticateToken,*/                              saleMaterialFileRoutes);
router.use('/api/saleMaterials',                /*authenticateToken,*/                              saleMaterialRoutes);
router.use('/api/studentCourseRatings',         /*authenticateToken,*/                              studentCourseRatingRoutes);
router.use('/api/courses',                      /*authenticateToken,*/                              courseRoutes);
router.use('/api/locations',                    /*authenticateToken,*/  cacheMiddleware(3600),      locationRoutes);
router.use('/api/subjects',                     /*authenticateToken,*/  cacheMiddleware(3600),      subjectRoutes);
router.use('/api/markHistory',                  /*authenticateToken,*/                              markHistoryRoutes);
router.use('/api/groups',                       /*authenticateToken,*/                              groupRoutes);
router.use('/api/groupsStudents',               /*authenticateToken,*/                              groupStudentRoutes);
router.use('/api/plannedLessons',               /*authenticateToken,*/                              plannedLessonRoutes);
router.use('/api/hometasks',                    /*authenticateToken,*/                              hometaskRoutes);
router.use('/api/hometaskFiles',                /*authenticateToken,*/                              hometaskFileRoutes);
router.use('/api/doneHometasks',                /*authenticateToken,*/                              doneHometaskRoutes);
router.use('/api/doneHometaskFiles',            /*authenticateToken,*/                              doneHometaskFileRoutes);
router.use('/api/tests',                        /*authenticateToken,*/                              testRoutes);
router.use('/api/testQuestions',                /*authenticateToken,*/                              testQuestionRoutes);
router.use('/api/testAnswers',                  /*authenticateToken,*/                              testAnswerRoutes);
router.use('/api/doneTests',                    /*authenticateToken,*/                              doneTestRoutes);
router.use('/api/selectedAnswers',              /*authenticateToken,*/                              selectedAnswerRoutes);

module.exports = router;