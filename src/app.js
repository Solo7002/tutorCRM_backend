const express = require('express');
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const materialRoutes = require('./routes/materialRoutes');
const materialVisibilityStudentRoutes = require('./routes/materialVisibilityStudentRoutes');
const userPhoneRoutes = require('./routes/userPhoneRoutes');
const userReviewRoutes = require('./routes/userReviewRoutes');
const reviewComplaintRoutes = require('./routes/reviewComplaintRoutes');
const blockedUserRoutes = require('./routes/blockedUserRoutes');
const userComplaintRoutes = require('./routes/userComplaintRoutes');
const purchasedMaterialRoutes = require('./routes/purchasedMaterialRoutes');
const saleMaterialFileRoutes = require('./routes/saleMaterialFileRoutes');
const saleMaterialRoutes = require('./routes/saleMaterialRoutes');
const studentCourseRatingRoutes = require('./routes/studentCourseRatingRoutes');
const courseRoutes = require('./routes/courseRoutes');
const locationRoutes = require('./routes/locationRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const markHistoryRoutes = require('./routes/markHistoryRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupStudentRoutes = require('./routes/groupStudentRoutes');
const plannedLessonRoutes = require('./routes/plannedLessonRoutes');
const hometaskRoutes = require('./routes/hometaskRoutes');
const hometaskFileRoutes = require('./routes/hometaskFileRoutes');
const doneHometaskRoutes = require('./routes/doneHometaskRoutes');
const doneHometaskFileRoutes = require('./routes/doneHometaskFileRoutes');
const testRoutes = require('./routes/testRoutes');
const testQuestionRoutes = require('./routes/testQuestionRoutes');
const testAnswerRoutes = require('./routes/testAnswerRoutes');
const doneTestRoutes = require('./routes/doneTestRoutes');
const selectedAnswerRoutes = require('./routes/selectedAnswerRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/materialVisibilityStudents', materialVisibilityStudentRoutes);
app.use('/api/userPhones', userPhoneRoutes);
app.use('/api/userReviews', userReviewRoutes);
app.use('/api/reviewComplaints', reviewComplaintRoutes);
app.use('/api/blockedUsers', blockedUserRoutes);
app.use('/api/userComplaints', userComplaintRoutes);
app.use('/api/purchasedMaterials', purchasedMaterialRoutes);
app.use('/api/saleMaterialFiles', saleMaterialFileRoutes);
app.use('/api/saleMaterials', saleMaterialRoutes);
app.use('/api/studentCourseRatings', studentCourseRatingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/markHistory', markHistoryRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/groupsStudents', groupStudentRoutes);
app.use('/api/plannedLessons', plannedLessonRoutes);
app.use('/api/hometasks', hometaskRoutes);
app.use('/api/hometaskFiles', hometaskFileRoutes);
app.use('/api/doneHometasks', doneHometaskRoutes);
app.use('/api/doneHometaskFiles', doneHometaskFileRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/testQuestions', testQuestionRoutes);
app.use('/api/testAnswers', testAnswerRoutes);
app.use('/api/doneTests', doneTestRoutes);
app.use('/api/selectedAnswers', selectedAnswerRoutes);


app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;