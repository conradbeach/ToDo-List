describe('Todos collection', function() {
  beforeEach(function() {
    this.seedCollection();
  });

  it('returns the correct number of incomplete todos', function() {
    expect(app.todos.incompleteCount()).toEqual(1);
  });

  it('returns complete todos', function() {
    expect(app.todos.completeTodos().length).toEqual(1);
    expect(app.todos.completeTodos()[0].get('dueDate')).toEqual(new Date('10-20-2016').toJSON());
  });

  it('returns incomplete todos', function() {
    expect(app.todos.incompleteTodos().length).toEqual(1);
    expect(app.todos.incompleteTodos()[0].get('dueDate')).toEqual(new Date('5-20-2016').toJSON());
  });

  it('returns todos properly grouped', function() {
    var groups = app.todos.groups();

    expect(_(groups).keys().sort()).toEqual(['10/2016-true', '5/2016-false']);
  });

  it('returns the correct set of current todos', function() {
    app.todoFilter = '10/2016-true';
    expect(app.todos.currentTodos().length).toEqual(1);
    expect(app.todos.currentTodos()[0].get('dueDate')).toEqual(new Date('10-20-2016').toJSON());

    app.todoFilter = 'all-false';
    expect(app.todos.currentTodos().length).toEqual(1);
    expect(app.todos.currentTodos()[0].get('dueDate')).toEqual(new Date('5-20-2016').toJSON());

    app.todoFilter = 'all-true';
    expect(app.todos.currentTodos().length).toEqual(1);
    expect(app.todos.currentTodos()[0].get('dueDate')).toEqual(new Date('10-20-2016').toJSON());
  });
});
