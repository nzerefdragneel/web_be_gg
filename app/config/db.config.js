fs = require('fs');
module.exports = {
    HOST: "dpg-cldh45eg1b2c73f7b63g-a.oregon-postgres.render.com",
    USER: "username",
    PASSWORD: "eMb5kLAT4Z3Bz7ykYqmXSzAY8wxRJkZb",
    DB: "db_f2lf",
    dialect: "postgres",
    ssl:true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };