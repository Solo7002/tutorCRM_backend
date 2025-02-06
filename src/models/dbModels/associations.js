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
  }

  if (models.Course && models.Subject) {
    models.Course.belongsTo(models.Subject, {
      foreignKey: 'SubjectId',
      as: 'Subject',
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
      as: 'Students',
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

  if (models.HomeTaskFile && models.HomeTask) {
    models.HomeTaskFile.belongsTo(models.HomeTask, {
      foreignKey: 'HomeTaskId',
      as: 'HomeTask',
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
  }

  if (models.Material && models.Material) {
    models.Material.belongsTo(models.Material, {
      foreignKey: 'ParentId',
      as: 'Parent',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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
    models.SelectedAnswer.belongsTo(models.DoneTest, {
      foreignKey: 'DoneTestId',
      as: 'DoneTest',
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

  if (models.TestAnswer && models.TestQuestion) {
    models.TestAnswer.belongsTo(models.TestQuestion, {
      foreignKey: 'TestQuestionId',
      as: 'TestQuestion',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.TestAnswer && models.SelectedAnswer) {
    models.TestAnswer.belongsTo(models.SelectedAnswer, {
      foreignKey: 'SelectedAnswerId',
      as: 'SelectedAnswer',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  if (models.TestQuestion && models.Test) {
    models.TestQuestion.belongsTo(models.Test, {
      foreignKey: 'TestId',
      as: 'Test',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
  }

  if (models.UserReview && models.User) {
    models.UserReview.belongsTo(models.User, {
      foreignKey: 'UserIdFor',
      as: 'Target',
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
};