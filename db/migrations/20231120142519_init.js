/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('teachers', table => {
      table.increments().unsigned();
      table.string('name_teacher').notNullable();
    })
    .createTable('students', table => {
      table.increments().unsigned();
      table.string('name_student').notNullable();
    })
    .createTable('lessons', table => {
      table.increments().unsigned();
      table.date('date').notNullable();
      table.string('title').notNullable();
      table.integer('status').notNullable();
    })
    .createTable('lessons_teachers', table => {
      table.integer('lesson_id').unsigned()
      table.integer('teacher_id').unsigned()
      table.foreign('lesson_id').references('lessons.id')
      table.foreign('teacher_id').references('teachers.id')
    })
    .createTable('lessons_students', table => {
      table.integer('lesson_id').unsigned()
      table.foreign('lesson_id').references('lessons.id')
      table.integer('student_id').unsigned()
      table.foreign('student_id').references('students.id')
      table.boolean('visit').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('teachers')
    .dropTable('students')
    .dropTable('lessons')
    .dropTable('lessons_teachers')
    .dropTable('lessons_students')
};
