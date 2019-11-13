const Pool = require('pg').Pool;
const DataClassBuilder = require('./dataClassBuilder');

const DataBase = new (function() {
  const single = this;

  this.initDB = () => {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'service2',
      password: 'pass',
      port: 5432
    })
  }

  this.getTable = async(tableName) => {
    return new Promise((resolve, reject) => {
      this.pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
        if (error) reject(error);
        resolve(results.rows);
      });
    });
  }

// GET all classes query
  this.getDBClassesQuery = async(request, response) => {
    const allClasses = await this.getTable('classes');
    console.log('GET request');
    response.status(200).json(allClasses)
  }

// GET single class by id
  this.getDetailsById = (request, response) => {
    const id = parseInt(request.params.id)
    this.pool.query('SELECT * FROM classes WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      console.log('GET request full info by id');
      response.status(200).json(results.rows);
    })
  }

// POST a new class
  this.createDBClassQuery = (request, response) => {
    console.log(request.url, request.body);
    const {class_name, students_amount, location, partner, lesson_date, price} = request.body;
    this.pool.query('INSERT INTO classes (class_name, students_amount, location, partner, lesson_date, price) VALUES ($1, $2, $3, $4, $5, $6)', [class_name, students_amount, location, partner, lesson_date, price], (error, results) => {
      if(error) {
        throw error;
      }
      response.status(200).send(results)
    })
  }

// PUT updated data on classes
  this.updateDBClassQuery = (request, response) => {
    const id = parseInt(request.params.id)
    const {class_name, students_amount, location, partner, lesson_date, price} = request.body
    this.pool.query('UPDATE classes SET class_name=$1, students_amount=$2, location=$3, partner=$4, lesson_date=$5, price=$6 WHERE id=$7', [class_name, students_amount, location, partner, lesson_date, price, id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Class Modified with ID: ${id}`)
    })
  }

// DELETE class
  this.deleteDBClassQuery = (request, response) => {
    const id = parseInt(request.params.id)
    this.pool.query('DELETE FROM classes WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  this.getPriceList = (request, response) => {
    this.pool.query('SELECT * FROM classes ORDER BY id ASC', (error, results) => {
      if (error) throw error;
      responseRows = [];
      results.rows.forEach((row, index) => {
        responseRows.push({ class_name: row.class_name, price: row.price });
      });
      console.log('GET request price-list');
      response.status(200).json(responseRows);
    });
  }

  return function() { return single; };
})();

module.exports = DataBase;
