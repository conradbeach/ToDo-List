describe('TodoView view', function() {
  beforeEach(function() {
    var todo = app.todos.create({
      title: 'Test Todo',
      description: 'Description',
      dueDate: new Date('10-20-2016')
    });

    this.view = new TodoView({ model: todo });
  });

  it('contains the correct HTML', function() {
    expect(this.view.$el.html()).toContain('<strong>Test Todo</strong>');
    expect(this.view.$el.html()).toContain(': Description');
    expect(this.view.$el.html()).toContain('<time>October 20, 2016</time>');
  });

  it('completed todos have the "complete" class', function() {
    this.view.model.toggleCompletion();

    expect(this.view.$el).toHaveClass('complete');
  });
});
