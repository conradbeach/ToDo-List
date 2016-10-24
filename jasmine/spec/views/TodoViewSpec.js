describe('TodoView', function() {
  beforeEach(function() {
    var todo = app.todos.create({
      title: 'Test Todo',
      description: 'Description',
      dueDate: new Date('10-20-2016'),
      completed: true
    });

    this.view = new TodoView({ model: todo });
  });

  it('completed todos have the "complete" class', function() {
    expect(this.view.$el).toHaveClass('complete');
  });
});
