/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('teachers', table => {
      table.integer('id');
      table.string('name_teacher').notNullable();
      table.timestamps(true, true)
    })
    .createTable('students', table => {
      table.integer('id');
      table.string('name_student').notNullable();
      table.timestamps(true, true)
    })
    .createTable('lessons', table => {
      table.integer('id');
      table.date('date').notNullable();
      table.string('title').notNullable();
      table.integer('status').notNullable();
      table.timestamps(true, true)
    })
    .createTable('lessons_teachers', table => {
      table.integer('lesson_id').unsigned()
      table.integer('teacher_id').unsigned()
      table.foreign('lesson_id').references('lessons.id')
      table.foreign('teacher_id').references('teachers.id')
      table.timestamps(true, true)
    })
    .createTable('lessons_students', table => {
      table.integer('lesson_id').unsigned()
      table.foreign('lesson_id').references('lessons.id')
      table.integer('student_id').unsigned()
      table.foreign('student_id').references('students.id')
      table.boolean('visit').notNullable();
      table.timestamps(true, true)
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
