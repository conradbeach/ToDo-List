beforeEach(function () {
  this.seedCollection = function() {
    app.todos.reset();
    app.todos.create({ title: 'Task 1', completed: true, dueDate: new Date('10-20-2016') });
    app.todos.create({ title: 'Task 2', completed: false, dueDate: new Date('5-20-2016') });
  };
});
