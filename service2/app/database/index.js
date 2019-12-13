'use strict';

const { Pool } = require('pg');
const dotenv = require('dotenv');
const Course = require('../course/index');

dotenv.config();

const Database = new (function() {
    const single = this;

    this.initDB = () => {
        this.pool = new Pool(JSON.parse(process.env.DATABASE_CONFIGURATION));
    }

    //get all from course table
    // this.getAllCourses = () => {
    //     return new Promise((resolve, reject) => {
    //         this.pool.query('SELECT * FROM course', (error, results) => {
    //             if (error) reject(error);
    //             resolve(results.rows);
    //         });
    //     });
    // }

    //writes new record to course table
    this.storeNewCourse = (course) => {
        const { name, price } = course;
        return new Promise((resolve, reject) => {
            this.pool.query(
                'INSERT INTO course(name, price) VALUES ($1, $2)',
                [name, price],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
        });
    }

    //writes new record to details table
    this.storeNewDetails = (course) => {
        const { students_amount, partner, location, date, course_id } = course;
        return new Promise((resolve, reject) => {
            this.pool.query(
                'INSERT INTO course_details(course_id, students_amount, partner, location, date) VALUES ($1, $2, $3, $4, $5)',
                [course_id, students_amount, partner, location, date],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
        }); 
    }

    //updates record in table course by its id
    // this.updateCourseById = (course, id) => {
    //     const { name, students_amount, partner, location, date, price } = course;
    //     return new Promise((resolve, reject) => {
    //         this.pool.query('UPDATE course SET name=$1, students_amount=$2, partner=$3, location=$4, date=$5, price=$6 WHERE id=$7',
    //         [name, students_amount, partner, location, date, price, id],
    //         (error, results) => {
    //             if (error) reject(error);
    //             resolve(results);
    //         });
    //     });
    // }

    //deletes record in table course by its id
    // this.deleteCourseById = (id) => {
    //     console.log(id);
    //     return new Promise((resolve, reject) => {
    //         this.pool.query('DELETE FROM course WHERE id=$1', [id], (error, results) => {
    //             if (error) reject(error);
    //             resolve(results);
    //         });
    //     });
    // }

    //returns course record by its id
    // this.getCourseById = (id) => {
    //     return new Promise((resolve, reject) => {
    //         this.pool.query('SELECT * FROM course WHERE id=$1', [id], (error, results) => {
    //             if (error) reject(error);
    //             resolve(results.rows);
    //         });
    //     });
    // }

    this.getPriceList = () => {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT * FROM course ORDER BY course_id ASC', (error, results) => {
                if (error) reject(error);
                resolve(results.rows);
            });
        });
    }

    this.getCourseIdByName = (course) => {
        const { name, price } = course;
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT course_id FROM course WHERE name=$1 AND price=$2',
            [name, price],
            (error, results) => {
                if (error) reject(error);
                resolve(results.rows);
            });
        });
    }

    this.getDetailsById = (id) => {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT * FROM course_details WHERE course_id=$1', [id], (error, results) =>{
                if (error) reject(error);
                resolve(results.rows);
            });
        });
    }

    return function() { return single; };
})();

module.exports = Database;