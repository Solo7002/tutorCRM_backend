const { UserReview, User, Teacher, Course, Group, Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.create(req.body);
    res.status(201).json(userReview);
  } catch (error) {
    console.error('Error in createUserReview:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const userReviews = await UserReview.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(userReviews);
  } catch (error) {
    console.error('Error in getUserReviews:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReviewById = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });
    res.status(200).json(userReview);
  } catch (error) {
    console.error('Error in getUserReviewById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const reviews = await UserReview.findAll({
      where: { UserIdFor: userId },
      include: [
        {
          model: User,
          as: 'Author',
          attributes: ['UserId', 'Username', 'LastName', 'FirstName', 'Email', 'ImageFilePath'],
        },
      ],
    });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this user" });
    }

    const formattedReviews = [];
    for (const review of reviews) {
      const userFrom = review.Author;
      let courseName = null;

      const isTeacher = await Teacher.findOne({ where: { UserId: userFrom.UserId } });
      if (isTeacher) {
        const course = await Course.findOne({
          where: { TeacherId: isTeacher.TeacherId },
          include: [
            {
              model: Group,
              as: 'Groups',
              include: [
                {
                  model: Student,
                  as: 'Students',
                  where: { UserId: userId },
                },
              ],
            },
          ],
        });
        if (course) courseName = course.CourseName;
      } else {
        const studentFrom = await Student.findOne({ where: { UserId: userFrom.UserId } });
        if (studentFrom) {
          const teacherFor = await Teacher.findOne({ where: { UserId: userId } });
          if (teacherFor) {
            const course = await Course.findOne({
              where: { TeacherId: teacherFor.TeacherId },
              include: [
                {
                  model: Group,
                  as: 'Groups',
                  include: [
                    {
                      model: Student,
                      as: 'Students',
                      where: { StudentId: studentFrom.StudentId },
                    },
                  ],
                },
              ],
            });
            if (course) courseName = course.CourseName;
          }
        }
      }

      const formattedReview = {
        UserReviewId: review.UserReviewId,
        ReviewHeader: review.ReviewHeader,
        ReviewText: review.ReviewText,
        CreateDate: review.CreateDate,
        Stars: review.Stars,
        UserIdFor: review.UserIdFor,
        UserFrom: {
          UserId: userFrom.UserId,
          Username: userFrom.Username,
          LastName: userFrom.LastName,
          FirstName: userFrom.FirstName,
          Email: userFrom.Email,
          ImageFilePath: userFrom.ImageFilePath,
          CourseName: courseName,
        },
      };
      formattedReviews.push(formattedReview);
    }

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error('Error in getReviewsForUser:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.canUserMakeReview = async (req, res) => {
  const { idUserFrom, idUserFor } = req.params;

  try {
    const userFrom = await User.findByPk(idUserFrom, {
      include: [
        { model: Teacher, as: 'Teacher' },
        { model: Student, as: 'Student' }
      ]
    });
    const userFor = await User.findByPk(idUserFor, {
      include: [
        { model: Teacher, as: 'Teacher' },
        { model: Student, as: 'Student' }
      ]
    });

    if (!userFrom || !userFor) {
      return res.status(200).json(false);
    }

    if (userFrom.Teacher && userFor.Student) {
      const group = await Group.findOne({
        include: [
          {
            model: Course,
            as: 'Course',
            where: { TeacherId: userFrom.Teacher.TeacherId },
            required: true
          },
          {
            model: Student,
            as: 'Students',
            where: { StudentId: userFor.Student.StudentId },
            required: true
          }
        ]
      });
      if (group) {
        return res.json(true);
      }
    }

    if (userFrom.Student && userFor.Teacher) {
      const group = await Group.findOne({
        include: [
          {
            model: Course,
            as: 'Course',
            where: { TeacherId: userFor.Teacher.TeacherId },
            required: true
          },
          {
            model: Student,
            as: 'Students',
            where: { StudentId: userFrom.Student.StudentId },
            required: true
          }
        ]
      });
      if (group) {
        return res.json(true);
      }
    }

    return res.json(false);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

exports.searchUserReviews = async (req, res) => {
  try {
    const { reviewHeader, reviewText, startDate, endDate } = req.query;
    const whereConditions = {};

    if (reviewHeader) whereConditions.ReviewHeader = { [Op.like]: `%${reviewHeader}%` };
    if (reviewText) whereConditions.ReviewText = { [Op.like]: `%${reviewText}%` };

    if (startDate && endDate) {
      whereConditions.CreateDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.CreateDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.CreateDate = { [Op.lte]: new Date(endDate) };
    }

    const userReviews = await UserReview.findAll({
      where: whereConditions,
      attributes: ['UserReviewId', 'ReviewHeader', 'ReviewText', 'CreateDate'],
    });

    if (!userReviews.length) {
      return res.status(404).json({ success: false, message: 'No user reviews found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: userReviews });
  } catch (error) {
    console.error('Error in searchUserReviews:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });

    await userReview.update(req.body);
    res.status(200).json(userReview);
  } catch (error) {
    console.error('Error in updateUserReview:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });

    await userReview.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUserReview:', error);
    res.status(400).json({ error: error.message });
  }
};