const Sequelize = require('sequelize')
const db = require('../config/database')

const User = db.define('User', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    isEmail: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.SMALLINT,
    allowNull: false
  }
})

const TeacherStudents = db.define('TeacherStudents', {
  teacherId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
      onDelete: "CASCADE"
    }
  },
  studentId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id',
      onDelete: "CASCADE"
    }
  }
}, {
  indexes: [{
    unique: true,
    fields: ['teacherId', 'studentId']
  }]
})

TeacherStudents.belongsTo(User, {
  as: 'Teacher',
  foreignKey: 'teacherId'
})
TeacherStudents.belongsTo(User, {
  as: 'Student',
  foreignKey: 'studentId'
})

db.sync().then(() => {
  console.log('Database synced')
})

module.exports = {
  User,
  TeacherStudents
}