-- Создание базы данных
DROP DATABASE IF EXISTS TutorCRMDB;
CREATE DATABASE TutorCRMDB;
USE TutorCRMDB;

-- Таблица Users
CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    ImageFilePath VARCHAR(255),
    CreateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица Students
CREATE TABLE Students (
    StudentId INT AUTO_INCREMENT PRIMARY KEY,
    SchoolName VARCHAR(255) NOT NULL,
    Grade VARCHAR(50) NOT NULL,
    UserId INT NOT NULL,
    CONSTRAINT FK_Users_Students FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

ALTER TABLE Users ADD COLUMN StudentId INT;
ALTER TABLE Users ADD CONSTRAINT FK_Users_StudentId FOREIGN KEY (StudentId) REFERENCES Students(StudentId);

-- Таблица Subscriptions
CREATE TABLE Subscriptions (
    SubscriptionLevelId INT AUTO_INCREMENT PRIMARY KEY,
    SubscriptionName VARCHAR(100) NOT NULL,
    SubscriptionDescription VARCHAR(255),
    SubscriptionPrice DECIMAL(10, 2)
);

-- Таблица Teachers
CREATE TABLE Teachers (
    TeacherId INT AUTO_INCREMENT PRIMARY KEY,
    AboutTeacher VARCHAR(255),
    LessonPrice INT,
    LessonType ENUM('group', 'solo') NOT NULL,
    MeetingType ENUM('offline', 'online') NOT NULL,
    SubscriptionLevelId INT,
    UserId INT NOT NULL,
    CONSTRAINT FK_Users_Teachers FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Teachers_Subscriptions FOREIGN KEY (SubscriptionLevelId) REFERENCES Subscriptions(SubscriptionLevelId)
);

ALTER TABLE Users ADD COLUMN TeacherId INT;
ALTER TABLE Users ADD CONSTRAINT FK_Users_TeacherId FOREIGN KEY (TeacherId) REFERENCES Teachers(TeacherId);

-- Таблица UserPhones
CREATE TABLE UserPhones (
    UserPhoneId INT AUTO_INCREMENT PRIMARY KEY,
    PhoneNumber VARCHAR(20) NOT NULL,
    NickName VARCHAR(100),
    SocialNetworkName VARCHAR(100),
    UserId INT NOT NULL,
    CONSTRAINT FK_UserPhones_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Таблица UserReviews
CREATE TABLE UserReviews (
    UserReviewId INT AUTO_INCREMENT PRIMARY KEY,
    ReviewHeader VARCHAR(100) NOT NULL,
    ReviewText TEXT NOT NULL,
    CreateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UserIdFrom INT NOT NULL,
    UserIdFor INT NOT NULL,
    CONSTRAINT FK_UserReviews_UserFrom FOREIGN KEY (UserIdFrom) REFERENCES Users(UserId),
    CONSTRAINT FK_UserReviews_UserFor FOREIGN KEY (UserIdFor) REFERENCES Users(UserId)
);

-- Таблица ReviewComplaints
CREATE TABLE ReviewComplaints (
    ReviewComplaintId INT AUTO_INCREMENT PRIMARY KEY,
    ComplaintDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ComplaintDescription TEXT NOT NULL,
    UserFromId INT NOT NULL,
    ReviewId INT NOT NULL,
    CONSTRAINT FK_ReviewComplaints_Users FOREIGN KEY (UserFromId) REFERENCES Users(UserId),
    CONSTRAINT FK_ReviewComplaints_Reviews FOREIGN KEY (ReviewId) REFERENCES UserReviews(UserReviewId)
);

-- Таблица BlockedUsers
CREATE TABLE BlockedUsers (
    BlockedId INT AUTO_INCREMENT PRIMARY KEY,
    ReasonDescription TEXT NOT NULL,
    BanStartDate DATETIME NOT NULL,
    BanEndDate DATETIME,
    UserId INT NOT NULL,
    CONSTRAINT FK_BlockedUsers_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Таблица UserComplaints
CREATE TABLE UserComplaints (
    UserComplaintId INT AUTO_INCREMENT PRIMARY KEY,
    ComplaintDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ComplaintDescription TEXT NOT NULL,
    UserFromId INT NOT NULL,
    UserForId INT NOT NULL,
    CONSTRAINT FK_UserComplaints_UserFrom FOREIGN KEY (UserFromId) REFERENCES Users(UserId),
    CONSTRAINT FK_UserComplaints_UserFor FOREIGN KEY (UserForId) REFERENCES Users(UserId)
);

-- Таблица Materials
CREATE TABLE Materials (
    MaterialId INT AUTO_INCREMENT PRIMARY KEY,
    MaterialName VARCHAR(255) NOT NULL,
    Type ENUM('file', 'folder') NOT NULL,
    ParentId INT,
    TeacherId INT NOT NULL,
    CONSTRAINT FK_Materials_Parent FOREIGN KEY (ParentId) REFERENCES Materials(MaterialId),
    CONSTRAINT FK_Materials_Teachers FOREIGN KEY (TeacherId) REFERENCES Teachers(TeacherId)
);

-- Таблица MaterialVisibilityStudents
CREATE TABLE MaterialVisibilityStudents (
    MaterialId INT NOT NULL,
    StudentId INT NOT NULL,
    PRIMARY KEY (MaterialId, StudentId),
    CONSTRAINT FK_MaterialVisibility_Materials FOREIGN KEY (MaterialId) REFERENCES Materials(MaterialId),
    CONSTRAINT FK_MaterialVisibility_Users FOREIGN KEY (StudentId) REFERENCES Users(UserId)
);

-- Таблица PurchasedMaterials
CREATE TABLE PurchasedMaterials (
    PurchasedMaterialId INT AUTO_INCREMENT PRIMARY KEY,
    PurchasedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PurchaserId INT NOT NULL,
    SaleMaterialId INT NOT NULL,
    CONSTRAINT FK_PurchasedMaterials_Materials FOREIGN KEY (SaleMaterialId) REFERENCES Materials(MaterialId),
    CONSTRAINT FK_PurchasedMaterials_Teachers FOREIGN KEY (PurchaserId) REFERENCES Teachers(TeacherId)
);

-- Таблица SaleMaterials
CREATE TABLE SaleMaterials (
    SaleMaterialId INT AUTO_INCREMENT PRIMARY KEY,
    MaterialsHeader VARCHAR(255) NOT NULL,
    MaterialsDescription VARCHAR(255) NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PreviewImagePath VARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    VendorldId INT NOT NULL,
    CONSTRAINT FK_SaleMaterials_Vendorlds FOREIGN KEY (VendorldId) REFERENCES Teachers(TeacherId)
);

-- Таблица SaleMaterialFiles
CREATE TABLE SaleMaterialFiles (
    SaleMaterialFileId INT AUTO_INCREMENT PRIMARY KEY,
    FilePath VARCHAR(255) NOT NULL,
    FileName VARCHAR(255) NOT NULL,
    AppearedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    SaleMaterialId INT NOT NULL,
    PurchasedMaterialId INT NOT NULL,
    CONSTRAINT FK_SaleMaterialFiles_SaleMaterials FOREIGN KEY (SaleMaterialId) REFERENCES SaleMaterials(SaleMaterialId),
    CONSTRAINT FK_SaleMaterialFiles_PurchasedMaterials FOREIGN KEY (PurchasedMaterialId) REFERENCES PurchasedMaterials(PurchasedMaterialId)
);

-- Таблица Locations
CREATE TABLE Locations (
    LocationId INT AUTO_INCREMENT PRIMARY KEY,
    City VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    Latitude DECIMAL(9, 6),
    Longitude  DECIMAL(9, 6),
    Address VARCHAR(100)
);

-- Таблица Subjects
CREATE TABLE Subjects (
    SubjectId INT AUTO_INCREMENT PRIMARY KEY,
    SubjectName VARCHAR(100) NOT NULL
);
-- Таблица Courses
CREATE TABLE Courses (
    CourseId INT AUTO_INCREMENT PRIMARY KEY,
    CourseName VARCHAR(255) NOT NULL,
    ImageFilePath VARCHAR(255),
    TeacherId INT NOT NULL,
    SubjectId INT NOT NULL,
    LocationId INT NOT NULL,
    CONSTRAINT FK_Courses_Teachers FOREIGN KEY (TeacherId) REFERENCES Teachers(TeacherId),
    CONSTRAINT FK_Courses_Subjects FOREIGN KEY (SubjectId) REFERENCES Subjects(SubjectId),
    CONSTRAINT FK_Courses_Locations FOREIGN KEY (LocationId) REFERENCES Locations(LocationId)
);
-- Таблица Groups
CREATE TABLE `Groups` (
    GroupId INT AUTO_INCREMENT PRIMARY KEY,
    GroupName VARCHAR(100) NOT NULL,
    GroupPrice DECIMAL(10, 2) NOT NULL,
    ImageFilePath VARCHAR(255),
    CourseId INT NOT NULL,
    CONSTRAINT FK_Groups_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId)
);

-- Таблица StudentsCourseRating
CREATE TABLE StudentsCourseRating (
    Rating DECIMAL(10, 2) NOT NULL,
    StudentId INT NOT NULL,
    CourseId INT NOT NULL,
    PRIMARY KEY (StudentId, CourseId),
    CONSTRAINT FK_StudentCourse_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_StudentCourse_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId)
);

-- Таблица MarkHistory
CREATE TABLE MarkHistory (
    MarkId INT AUTO_INCREMENT PRIMARY KEY,
    Mark INT NOT NULL,
    MarkType ENUM('test', 'homework') NOT NULL,
    MarkDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    StudentId INT NOT NULL,
    CourseId INT NOT NULL,
    CONSTRAINT FK_MarkHistory_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_MarkHistory_Courses FOREIGN KEY (CourseId) REFERENCES Courses(CourseId)
);

-- Таблица GroupStudents
CREATE TABLE GroupStudents (
    GroupId INT NOT NULL,
    StudentId INT NOT NULL,
    PRIMARY KEY (GroupId, StudentId),
    CONSTRAINT FK_GroupStudent_Groups FOREIGN KEY (GroupId) REFERENCES `Groups`(GroupId),
    CONSTRAINT FK_GroupStudent_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId)
);

-- Таблица PlannedLessons
CREATE TABLE PlannedLessons (
    PlannedLessonId INT AUTO_INCREMENT PRIMARY KEY,
    LessonHeader VARCHAR(255) NOT NULL,
    LessonDescription TEXT,
    LessonPrice DECIMAL(10, 2) NOT NULL,
    IsPaid BOOLEAN NOT NULL,
    GroupId INT NOT NULL,
    CONSTRAINT FK_PlannedLessons_Groups FOREIGN KEY (GroupId) REFERENCES `Groups`(GroupId)
);

-- Таблица HomeTasks
CREATE TABLE HomeTasks (
    HomeTaskId INT AUTO_INCREMENT PRIMARY KEY,
    HomeTaskHeader VARCHAR(255) NOT NULL,
    HomeTaskDescription TEXT,
    StartDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DeadlineDate DATETIME NOT NULL,
    MaxMark INT NOT NULL,
    ImageFilePath VARCHAR(255),
    GroupId INT NOT NULL,
    CONSTRAINT FK_HomeTasks_Groups FOREIGN KEY (GroupId) REFERENCES `Groups`(GroupId)
);

-- Таблица DoneHomeTasks
CREATE TABLE DoneHomeTasks (
    DoneHomeTaskId INT AUTO_INCREMENT PRIMARY KEY,
    Mark INT NOT NULL,
    DoneDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    HomeTaskId INT NOT NULL,
    StudentId INT NOT NULL,
    CONSTRAINT FK_DoneHomeTasks_HomeTasks FOREIGN KEY (HomeTaskId) REFERENCES HomeTasks(HomeTaskId),
    CONSTRAINT FK_DoneHomeTasks_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId)
);

-- Таблица HomeTaskFiles
CREATE TABLE HomeTaskFiles (
    HomeTaskFileId INT AUTO_INCREMENT PRIMARY KEY,
    FilePath VARCHAR(255),
    FileName VARCHAR(255) NOT NULL,
    HomeTaskId INT NOT NULL,
    CONSTRAINT FK_HomeTaskFiles_HomeTasks FOREIGN KEY (HomeTaskId) REFERENCES HomeTasks(HomeTaskId)
);

-- Таблица DoneHomeTaskFiles
CREATE TABLE DoneHomeTaskFiles (
    HomeTaskFileId INT AUTO_INCREMENT PRIMARY KEY,
    FilePath VARCHAR(255),
    FileName VARCHAR(255) NOT NULL,
    DoneHomeTaskId INT NOT NULL,
    CONSTRAINT FK_DoneHomeTaskFiles_HomeTasks FOREIGN KEY (DoneHomeTaskId) REFERENCES DoneHomeTasks(DoneHomeTaskId)
);

-- Таблица Tests
CREATE TABLE Tests (
    TestId INT AUTO_INCREMENT PRIMARY KEY,
    TestName VARCHAR(255) NOT NULL,
    TestDescription VARCHAR(255) NOT NULL,
    TimeLimit TIME NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MaxMark INT NOT NULL,
    ImageFilePath VARCHAR(255),
    GroupId INT NOT NULL,
    CONSTRAINT FK_Tests_Groups FOREIGN KEY (GroupId) REFERENCES `Groups`(GroupId)
);

-- Таблица TestQuestions
CREATE TABLE TestQuestions (
    TestQuestionId INT AUTO_INCREMENT PRIMARY KEY,
    TestQuestionHeader VARCHAR(100) NOT NULL,
    TestQuestionDescription TEXT NOT NULL,
    ImagePath VARCHAR(255),
    AudioPath VARCHAR(255),
    TestId INT NOT NULL,
    CONSTRAINT FK_TestQuestions_Tests FOREIGN KEY (TestId) REFERENCES Tests(TestId)
);

-- Таблица DoneTests
CREATE TABLE DoneTests (
    DoneTestId INT AUTO_INCREMENT PRIMARY KEY,
    Mark INT NOT NULL,
    DoneDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    SpentTime TIME NOT NULL,
    StudentId INT NOT NULL,
    TestId INT NOT NULL,
    CONSTRAINT FK_DoneTests_Students FOREIGN KEY (StudentId) REFERENCES Students(StudentId),
    CONSTRAINT FK_DoneTests_Tests FOREIGN KEY (TestId) REFERENCES Tests(TestId)
);

-- Таблица SelectedAnswers
CREATE TABLE SelectedAnswers (
    SelectedAnswerId INT AUTO_INCREMENT PRIMARY KEY,
    TestQuestionId INT NOT NULL,
    DoneTestId INT NOT NULL,
    CONSTRAINT FK_SelectedAnswers_TestQuestions FOREIGN KEY (TestQuestionId) REFERENCES TestQuestions(TestQuestionId),
    CONSTRAINT FK_SelectedAnswers_DoneTests FOREIGN KEY (DoneTestId) REFERENCES DoneTests(DoneTestId)
);

-- Таблица TestAnswers
CREATE TABLE TestAnswers (
    TestAnswerId INT AUTO_INCREMENT PRIMARY KEY,
    AnswerText TEXT NOT NULL,
    ImagePath VARCHAR(255),
    IsRightAnswer BOOLEAN NOT NULL,
    TestQuestionId INT NOT NULL,
    SelectedAnswerId INT NOT NULL,
    CONSTRAINT FK_TestAnswers_TestQuestions FOREIGN KEY (TestQuestionId) REFERENCES TestQuestions(TestQuestionId),
    CONSTRAINT FK_TestAnswers_SelectedAnswers FOREIGN KEY (SelectedAnswerId) REFERENCES SelectedAnswers(SelectedAnswerId)
);

--------------------------------------------------------------------------------------

-- Вставка данных в таблицу Users
INSERT INTO Users (Username, Password, LastName, FirstName, Email, ImageFilePath)
VALUES
('john_doe', 'password123', 'Doe', 'John', 'johndoe@example.com', '/images/john_doe.jpg'),
('jane_smith', 'password456', 'Smith', 'Jane', 'janesmith@example.com', '/images/jane_smith.jpg');

-- Вставка данных в таблицу Students
INSERT INTO Students (SchoolName, Grade, UserId)
VALUES
('Riverdale High School', '10th', 1),
('Sunset Valley School', '11th', 2);

-- Вставка данных в таблицу Subscriptions
INSERT INTO Subscriptions (SubscriptionName, SubscriptionDescription, SubscriptionPrice)
VALUES
('Basic', 'Basic subscription with limited features', 9.99),
('Premium', 'Premium subscription with full access', 19.99);

-- Вставка данных в таблицу Teachers
INSERT INTO Teachers (AboutTeacher, LessonPrice, LessonType, MeetingType, SubscriptionLevelId, UserId)
VALUES
('Experienced math teacher with 10 years of teaching', 30, 'solo', 'online', 2, 1);

-- Вставка данных в таблицу UserPhones
INSERT INTO UserPhones (PhoneNumber, NickName, SocialNetworkName, UserId)
VALUES
('123-456-7890', 'John’s Phone', 'Facebook', 1),
('987-654-3210', 'Jane’s Phone', 'Instagram', 2);

-- Вставка данных в таблицу UserReviews
INSERT INTO UserReviews (ReviewHeader, ReviewText, UserIdFrom, UserIdFor)
VALUES
('Great teacher!', 'John is a wonderful teacher who helped me a lot with math.', 2, 1),
('Amazing lesson!', 'Jane made the learning experience enjoyable and fun.', 1, 2);

-- Вставка данных в таблицу ReviewComplaints
INSERT INTO ReviewComplaints (ComplaintDescription, UserFromId, ReviewId)
VALUES
('The review was inaccurate', 1, 1);

-- Вставка данных в таблицу BlockedUsers
INSERT INTO BlockedUsers (ReasonDescription, BanStartDate, BanEndDate, UserId)
VALUES
('Spamming content', '2025-01-01 00:00:00', '2025-02-01 00:00:00', 1);

-- Вставка данных в таблицу UserComplaints
INSERT INTO UserComplaints (ComplaintDescription, UserFromId, UserForId)
VALUES
('Inappropriate behavior', 1, 2);

-- Вставка данных в таблицу Materials
INSERT INTO Materials (MaterialName, Type, TeacherId)
VALUES
('Math Lecture Notes', 'file', 1);

-- Вставка данных в таблицу MaterialVisibilityStudents
INSERT INTO MaterialVisibilityStudents (MaterialId, StudentId)
VALUES
(1, 1), (1, 2);

-- Вставка данных в таблицу PurchasedMaterials
INSERT INTO PurchasedMaterials (PurchaserId, SaleMaterialId)
VALUES
(1, 1);

-- Вставка данных в таблицу SaleMaterials
INSERT INTO SaleMaterials (MaterialsHeader, MaterialsDescription, Price, VendorldId)
VALUES
('Math Test Papers', 'A collection of challenging math problems', 5.99, 1);

-- Вставка данных в таблицу SaleMaterialFiles
INSERT INTO SaleMaterialFiles (FilePath, FileName, SaleMaterialId)
VALUES
('/files/math_test_paper.pdf', 'math_test_paper.pdf', 1);

-- Вставка данных в таблицу Locations
INSERT INTO Locations (City, Country, Latitude, Longitude, Address)
VALUES
('New York', 'USA', 40.7128, -74.0060, '123 Main St');

-- Вставка данных в таблицу Subjects
INSERT INTO Subjects (SubjectName)
VALUES
('Mathematics'),
('English');

-- Вставка данных в таблицу Courses
INSERT INTO Courses (CourseName, TeacherId, SubjectId, LocationId)
VALUES
('Advanced Math', 1, 1, 1);

-- Вставка данных в таблицу Groups
INSERT INTO Groups (GroupName, GroupPrice, CourseId)
VALUES
('Group 1', 50.00, 1);

-- Вставка данных в таблицу StudentsCourseRating
INSERT INTO StudentsCourseRating (Rating, StudentId, CourseId)
VALUES
(4.5, 1, 1),
(4.7, 2, 1);

-- Вставка данных в таблицу MarkHistory
INSERT INTO MarkHistory (Mark, MarkType, StudentId, CourseId)
VALUES
(90, 'test', 1, 1),
(85, 'homework', 2, 1);

-- Вставка данных в таблицу GroupStudents
INSERT INTO GroupStudents (GroupId, StudentId)
VALUES
(1, 1),
(1, 2);

-- Вставка данных в таблицу PlannedLessons
INSERT INTO PlannedLessons (LessonHeader, LessonPrice, IsPaid, GroupId)
VALUES
('Math Lecture 1', 20.00, 1, 1);

-- Вставка данных в таблицу HomeTasks
INSERT INTO HomeTasks (HomeTaskHeader, HomeTaskDescription, DeadlineDate, MaxMark, GroupId)
VALUES
('Math Homework', 'Solve problems from chapter 2', '2025-01-25 23:59:59', 100, 1);

-- Вставка данных в таблицу DoneHomeTasks
INSERT INTO DoneHomeTasks (Mark, HomeTaskId, StudentId)
VALUES
(95, 1, 1),
(85, 1, 2);

-- Вставка данных в таблицу HomeTaskFiles
INSERT INTO HomeTaskFiles (FilePath, FileName, HomeTaskId)
VALUES
('/files/math_homework.pdf', 'math_homework.pdf', 1);

-- Вставка данных в таблицу DoneHomeTaskFiles
INSERT INTO DoneHomeTaskFiles (FilePath, FileName, DoneHomeTaskId)
VALUES
('/files/done_math_homework.pdf', 'done_math_homework.pdf', 1);

-- Вставка данных в таблицу Tests
INSERT INTO Tests (TestName, TestDescription, TimeLimit, MaxMark, GroupId)
VALUES
('Math Test 1', 'Test covering all topics from chapter 1', '01:00:00', 100, 1);

-- Вставка данных в таблицу TestQuestions
INSERT INTO TestQuestions (TestQuestionHeader, TestQuestionDescription, TestId)
VALUES
('Question 1', 'What is 2+2?', 1),
('Question 2', 'What is 3+3?', 1);

-- Вставка данных в таблицу DoneTests
INSERT INTO DoneTests (Mark, SpentTime, StudentId, TestId)
VALUES
(80, '00:30:00', 1, 1),
(90, '00:45:00', 2, 1);

-- Вставка данных в таблицу SelectedAnswers
INSERT INTO SelectedAnswers (TestQuestionId, DoneTestId)
VALUES
(1, 1),
(2, 2);

-- Вставка данных в таблицу TestAnswers
INSERT INTO TestAnswers (AnswerText, IsRightAnswer, TestQuestionId, SelectedAnswerId)
VALUES
('4', 1, 1, 1),
('6', 1, 2, 2);


-- Вставка данных в таблицу SaleMaterials
INSERT INTO SaleMaterials (MaterialsHeader, MaterialsDescription, CreatedDate, PreviewImagePath, Price, VendorldId)
VALUES
    ('Physics - Basic Theory', 'Comprehensive physics course for high school students.', '2025-01-01', '/images/physics.jpg', 1500.00, 1),
    ('Mathematics - Introduction', 'Fundamentals of mathematics for beginners.', '2025-01-02', '/images/math.jpg', 800.00, 1);

-- Вставка данных в таблицу SaleMaterialFiles
INSERT INTO SaleMaterialFiles (FilePath, FileName, AppearedDate, SaleMaterialId, PurchasedMaterialId)
VALUES
    ('/materials/physics', 'Physics_BasicTheory.pdf', '2025-01-01', 1, 1),
    ('/materials/math', 'Math_Introduction.pdf', '2025-01-02', 1, 1),
    ('/materials/chemistry', 'Chemistry_Complete.pdf', '2025-01-05',1, 1);
