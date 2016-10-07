beforeEach(function () {
  this.seedCollection = function() {
    app.todos.reset();
    app.todos.create({ completed: true, dueDate: new Date('10-20-2016') });
    app.todos.create({ completed: false, dueDate: new Date('5-20-2016') });
  };
});
