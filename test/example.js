require('dotenv').config()
const assert = require('assert')

const db = require('../config/database')
const {
    isAdmin,
    isTeacher
} = require('../middlewares')

describe('Unit Test', () => {
    // describe('Access Role', () => {
    //     it('Should be an admin', () => {
    //         let req = {
    //             userId: 1
    //         }
    //     })
    //     it('Should be a teacher', () => {
    //         let req = {
    //             userId: 2
    //         }
    //     })
    // })
    describe('Database', () => {
        it('connection', () => {
            db.authenticate()
                .then(() => assert.equal(1, 1))
                .catch(error => assert.equal(0, 1))
        })
    })
})