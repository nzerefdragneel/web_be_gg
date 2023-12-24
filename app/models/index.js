const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
/*
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  define: {
    freezeTableName: true,
  },
  ssl:true
});*/
const sequelize = new Sequelize('postgres://username:eMb5kLAT4Z3Bz7ykYqmXSzAY8wxRJkZb@dpg-cldh45eg1b2c73f7b63g-a.oregon-postgres.render.com/db_f2lf?ssl=true');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.classes=require("./classes.model.js")(sequelize,Sequelize);
db.enrollment=require("./errollment.model.js")(sequelize,Sequelize);
db.teachers=require("./teachers.model.js")(sequelize,Sequelize);
db.assignment=require("./assignment.model.js")(sequelize,Sequelize);
db.scorings=require("./scorings.model.js")(sequelize,Sequelize);
//foreign key teacher
db.teachers.belongsTo(db.user, { foreignKey: 'teacherId', as: 'teacher' });
db.teachers.belongsTo(db.classes, { foreignKey: 'classId', as: 'class' });
//foreign key assignment
db.assignment.belongsTo(db.classes, { foreignKey: 'classId', as: 'classassignment' });
db.assignment.belongsTo(db.user, { foreignKey: 'teacherId', as: 'teacherassignment' });
//foreign key enrollment
db.enrollment.belongsTo(db.user, { foreignKey: 'studentId', as: 'studentenrollment' });
db.enrollment.belongsTo(db.classes, { foreignKey: 'classId', as: 'classenrollment' });
//foreign key scorings
db.scorings.belongsTo(db.assignment, { foreignKey: 'assignmentId', as: 'assignmentScoring' });
db.scorings.belongsTo(db.enrollment, { foreignKey: 'studentId', as: 'enrollmentScoring' });
db.scorings.belongsTo(db.enrollment, { foreignKey: 'classId', as: 'classEnrollmentScoring' });
// Assuming 'teachers' is your model for teachers
db.scorings.belongsTo(db.teachers, {
  foreignKey: 'teacherId',
  as: 'teacherScoring'
});

db.scorings.belongsTo(db.teachers, {
  foreignKey: 'classId',
  as: 'classScoring'
});


module.exports = db;
