module.exports = (models) => {
  if (models.User && models.Student) {
    models.User.hasOne(models.Student, {
      foreignKey: 'UserId',
      as: 'Student',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.User && models.Teacher) {
    models.User.hasOne(models.Teacher, {
      foreignKey: 'UserId',
      as: 'Teacher',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Student && models.User) {
    models.Student.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Course && models.Teacher) {
    models.Course.belongsTo(models.Teacher, {
      foreignKey: 'TeacherId',
      as: 'Teacher',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    models.Teacher.hasMany(models.Course, {
      foreignKey: 'TeacherId',
      as: 'Courses',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Course && models.Location) {
    models.Course.belongsTo(models.Location, {
      foreignKey: 'LocationId',
      as: 'Location',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Group && models.GroupStudent) {
    models.Group.hasMany(models.GroupStudent, {
      foreignKey: 'GroupId',
      as: 'GroupStudents',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.GroupStudent && models.Group) {
    models.GroupStudent.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Group',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.GroupStudent && models.Student) {
    models.GroupStudent.belongsTo(models.Student, {
      foreignKey: 'StudentId',
      as: 'Student',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.HomeTask && models.Group) {
    models.HomeTask.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Group',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.HomeTask && models.Group) {
    models.Group.hasMany(models.HomeTask, {
      foreignKey: 'GroupId',
      as: 'HomeTasks',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.PlannedLesson && models.Group) {
    models.Group.hasMany(models.PlannedLesson, {
      foreignKey: 'GroupId',
      as: 'PlannedLessons',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.HomeTaskFile && models.HomeTask) {
    models.HomeTaskFile.belongsTo(models.HomeTask, {
      foreignKey: 'HomeTaskId',
      as: 'HomeTask',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.HomeTask.hasMany(models.HomeTaskFile, {
      foreignKey: 'HomeTaskId',
      as: 'HomeTaskFiles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.DoneHomeTask && models.HomeTask) {
    models.DoneHomeTask.belongsTo(models.HomeTask, {
      foreignKey: 'HomeTaskId',
      as: 'HomeTask',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    models.HomeTask.hasMany(models.DoneHomeTask, {
      foreignKey: 'HomeTaskId',
      as: 'DoneHomeTasks',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.DoneHomeTask && models.Student) {
    models.DoneHomeTask.belongsTo(models.Student, {
      foreignKey: 'StudentId',
      as: 'Student',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.DoneHomeTaskFile && models.DoneHomeTask) {
    models.DoneHomeTaskFile.belongsTo(models.DoneHomeTask, {
      foreignKey: 'DoneHomeTaskId',
      as: 'DoneHomeTask',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.DoneHomeTask.hasMany(models.DoneHomeTaskFile, {
      foreignKey: 'DoneHomeTaskId',
      as: 'DoneHomeTaskFiles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.MarkHistory && models.Student) {
    models.MarkHistory.belongsTo(models.Student, {
      foreignKey: 'StudentId',
      as: 'Student',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.MarkHistory && models.Course) {
    models.MarkHistory.belongsTo(models.Course, {
      foreignKey: 'CourseId',
      as: 'Course',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Material && models.Teacher) {
    models.Material.belongsTo(models.Teacher, {
      foreignKey: 'TeacherId',
      as: 'Teacher',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    models.Teacher.hasMany(models.Material, {
      foreignKey: 'TeacherId',
      as: 'Materials',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Material && models.Material) {
    models.Material.belongsTo(models.Material, {
      foreignKey: 'ParentId',
      as: 'Parent',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    models.Material.hasMany(models.Material, {
      foreignKey: 'ParentId',
      as: 'Materials',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Material && models.Student) {
    models.Material.belongsToMany(models.Student, {
      through: 'MaterialVisibilityStudents',
      foreignKey: 'MaterialId',
      otherKey: 'StudentId',
      as: 'VisibleStudents',
    });
  
    models.Student.belongsToMany(models.Material, {
      through: 'MaterialVisibilityStudents',
      foreignKey: 'StudentId',
      otherKey: 'MaterialId',
      as: 'VisibleMaterials',
    });
  }

  if (models.PlannedLesson && models.Group) {
    models.PlannedLesson.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Group',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.SelectedAnswer && models.TestQuestion) {
    models.SelectedAnswer.belongsTo(models.TestQuestion, {
      foreignKey: 'TestQuestionId',
      as: 'TestQuestion',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.SelectedAnswer && models.DoneTest) {
    models.DoneTest.hasMany(models.SelectedAnswer, {
      foreignKey: 'DoneTestId',
      as: 'SelectedAnswers',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    models.SelectedAnswer.belongsTo(models.DoneTest, {
      foreignKey: 'DoneTestId',
      as: 'DoneTest',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }

  if (models.SelectedAnswer && models.TestAnswer) {
    models.SelectedAnswer.belongsTo(models.TestAnswer, {
      foreignKey: 'TestAnswerId',
      as: 'TestAnswer',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Test && models.Group) {
    models.Test.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Groups',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Test && models.DoneTest) {
    models.Test.hasMany(models.DoneTest, {
      foreignKey: 'TestId',
      as: 'DoneTests',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }

  if (models.DoneTest && models.Test) {
    models.DoneTest.belongsTo(models.Test, {
      foreignKey: 'TestId',
      as: 'Test',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }

  if (models.Test && models.Group) {
    models.Group.hasMany(models.Test, {
      foreignKey: 'GroupId',
      as: 'Tests',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.TestAnswer && models.TestQuestion) {
    models.TestQuestion.hasMany(models.TestAnswer, {
      foreignKey: 'TestQuestionId',
      as: 'TestAnswers',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    models.TestAnswer.belongsTo(models.TestQuestion, {
      foreignKey: 'TestQuestionId',
      as: 'TestQuestion',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }

  if (models.TestQuestion && models.Test) {
    models.TestQuestion.belongsTo(models.Test, {
      foreignKey: 'TestId',
      as: 'Test',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.Test.hasMany(models.TestQuestion, {
      foreignKey: 'TestId',
      as: 'TestQuestions',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }

  if (models.UserComplaint && models.User) {
    models.UserComplaint.belongsTo(models.User, {
      foreignKey: 'UserFromId',
      as: 'UserFrom',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.UserComplaint && models.User) {
    models.UserComplaint.belongsTo(models.User, {
      foreignKey: 'UserForId',
      as: 'UserFor',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.UserPhone && models.User) {
    models.User.hasMany(models.UserPhone, {
      foreignKey: 'UserId',
      as: 'UserPhones',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.UserPhone.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.UserReview && models.User) {
    models.UserReview.belongsTo(models.User, {
      foreignKey: 'UserIdFrom',
      as: 'Author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  
    models.UserReview.belongsTo(models.User, {
      foreignKey: 'UserIdFor',
      as: 'Target',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  
    models.User.hasMany(models.UserReview, {
      foreignKey: 'UserIdFrom',
      as: 'AuthoredReviews',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  
    models.User.hasMany(models.UserReview, {
      foreignKey: 'UserIdFor',
      as: 'TargetedReviews',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.StudentCourseRating && models.Student) {
    models.StudentCourseRating.belongsTo(models.Student, {
      foreignKey: 'StudentId',
      as: 'Student',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.StudentCourseRating && models.Course) {
    models.StudentCourseRating.belongsTo(models.Course, {
      foreignKey: 'CourseId',
      as: 'Course',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Course && models.StudentCourseRating) {
    models.Course.hasMany(models.StudentCourseRating, {
      foreignKey: 'CourseId',
      as: 'Ratings',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.BlockedUser && models.User) {
    models.BlockedUser.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.User.hasMany(models.BlockedUser, {
      foreignKey: 'UserId',
      as: 'BlockedUsers',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
  if (models.Teacher && models.User) {
    models.Teacher.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
  if (models.Teacher && models.Subscription) {
    models.Teacher.belongsTo(models.Subscription, {
      foreignKey: 'SubscriptionLevelId',
      as: 'Subscription',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    models.Subscription.hasMany(models.Teacher, {
      foreignKey: 'SubscriptionLevelId',
      as: 'Teachers',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Student && models.Group) {
    models.Student.belongsToMany(models.Group, {
      through: models.GroupStudent,
      foreignKey: 'StudentId',
      otherKey: 'GroupId',
      as: 'Groups',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Group && models.Student) {
    models.Group.belongsToMany(models.Student, {
      through: models.GroupStudent,
      foreignKey: 'GroupId',
      otherKey: 'StudentId',
      as: 'Students',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
 
  if (models.Group && models.Course) {
    models.Group.belongsTo(models.Course, {
      foreignKey: 'CourseId',
      as: 'Course',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.Course.hasMany(models.Group, {
      foreignKey: 'CourseId',
      as: 'Groups',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Subject && models.Course) {
    // Subject has many Courses
    models.Subject.hasMany(models.Course, {
      foreignKey: 'SubjectId', // Внешний ключ в таблице Courses
      as: 'Courses', // Алиас для доступа к курсам
      onDelete: 'CASCADE', // Удаление курсов при удалении предмета
      onUpdate: 'CASCADE', // Обновление курсов при обновлении предмета
    });
    if (models.Student && models.DoneTest) {
      models.Student.hasMany(models.DoneTest, {
        foreignKey: 'StudentId',
        as: 'DoneTests',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    
      models.DoneTest.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
    // Course belongs to Subject
    models.Course.belongsTo(models.Subject, {
      foreignKey: 'SubjectId', // Внешний ключ в таблице Courses
      as: 'Subject', // Алиас для доступа к предмету
      onDelete: 'SET NULL', // При удалении предмета, SubjectId в Course становится NULL
      onUpdate: 'CASCADE', // Обновление SubjectId в Course при обновлении Subject
    });
  }

  if (models.Student && models.Trophies) {
    models.Student.hasOne(models.Trophies, {
      foreignKey: 'StudentId',
      as: 'Trophies',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.Trophies.belongsTo(models.Student, {
      foreignKey: 'StudentId',
      as: 'Student',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.Teacher && models.OctoCoins) {
    models.Teacher.hasOne(models.OctoCoins, {
      foreignKey: 'TeacherId',
      as: 'OctoCoins',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    models.OctoCoins.belongsTo(models.Teacher, {
      foreignKey: 'TeacherId',
      as: 'Teacher',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
};