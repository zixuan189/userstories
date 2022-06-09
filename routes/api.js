const express = require('express')
const router = express.Router()

const {
    verifyToken,
    checkIsUserExist,
    checkIsEmailValid,
    isAdmin,
    isTeacher,
    registerUser,
    loginUser,
    registerAsStudent,
    registerAsTeacher
} = require('../middlewares')
const {
    User,
    TeacherStudents
} = require('../models')

router.post('/signup', [checkIsEmailValid], registerUser)

router.post('/signin', [checkIsUserExist], loginUser)

router.post('/students', [verifyToken, isAdmin, checkIsEmailValid], registerAsStudent)

router.post('/teachers', [verifyToken, isAdmin, checkIsEmailValid], registerAsTeacher)

router.post('/register', [verifyToken, isAdmin], async (req, res) => {
    let {
        teacher,
        students
    } = req.body

    let row = await User.findAll({
        where: {
            email: teacher
        }
    })

    if (row.length == 0)
        return res.status(404).json({
            message: `Teacher does not exist`
        })

    let teacherId = row[0].id
    for (let student of students) {
        let row = await User.findAll({
            where: {
                email: student
            }
        })

        if (row.length == 0)
            return res.status(404).json({
                message: `Student (${student}) does not exist`
            })

        let studentId = row[0].id
        row = await TeacherStudents.findAll({
            where: {
                teacherId: teacherId,
                studentId: studentId
            }
        })

        if (row.length > 0)
            return res.status(404).json({
                message: `${student} already assigned to ${teacher}`
            })

        TeacherStudents.create({
            teacherId: teacherId,
            studentId: studentId
        }).catch(error => {
            return res.status(400).json({
                message: error.errors[0].message
            })
        })
    }

    res.sendStatus(204)
})

router.get('/commonstudents', [verifyToken, isAdmin], async (req, res) => {
    let {
        teacher
    } = req.query

    let row = await TeacherStudents.findAll({
        attributes: [],
        where: {
            '$Teacher.email$': teacher
        },
        include: [{
                model: User,
                attributes: ['email'],
                as: 'Teacher'
            },
            {
                model: User,
                attributes: ['id', 'email'],
                as: 'Student'
            }
        ],
    })

    if (row.length == 0)
        return res.status(404).json({
            message: `No record`
        })

    let result = {}
    result = [...new Set(row.map(item => item.Student.email))]
    if (Array.isArray(teacher)) {
        row.forEach(i => {
            result[i.Student.email] = (result[i.Student.email] || 0) + 1
        })

        result = Object.keys(result).filter(key => result[key] == teacher.length)
    }

    res.status(200).json({
        students: result
    })
})

router.post('/suspend', [verifyToken, isTeacher], async (req, res) => {
    let {
        student
    } = req.body

    let row = await User.findAll({
        where: {
            email: student
        }
    })

    if (row.length == 0)
        return res.status(404).json({
            message: `Student does not exist`
        })

    User.update({
        role: 3
    }).then(() => {
        res.sendStatus(204)
    }).catch(error => {
        res.status(400).json({
            message: error.errors[0].message
        })
    })
})

module.exports = router