describe('TodoView', function() {
  beforeEach(function() {
    var todo = app.todos.create({
      title: 'Test Todo',
      description: 'Description',
      dueDate: new Date('10-20-2016')
    });

    this.view = new TodoView({ model: todo });
  });

  it('completed todos have the "complete" class', function() {
    this.view.model.toggleCompletion();

    expect(this.view.$el).toHaveClass('complete');
  });
});
