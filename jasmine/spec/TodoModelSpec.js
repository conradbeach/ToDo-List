describe('Todo model', function() {
  var todos = new Todos();

  it('sets correct default values', function() {
    var todo = new Todo();

    expect(todo.get('title')).toEqual('');
    expect(todo.get('description')).toEqual('');
    expect(todo.get('completed')).toBe(false);
  });

  it('values can be set', function() {
    var todo = new Todo({ title: 'Todo', description: 'Important task...', completed: true });

    expect(todo.get('title')).toEqual('Todo');
    expect(todo.get('description')).toEqual('Important task...');
    expect(todo.get('completed')).toBe(true);
  });

  it('completion status can be toggled', function() {
    var todo = todos.create();

    expect(todo.get('completed')).toBe(false);

    todo.toggleCompletion();
    expect(todo.get('completed')).toBe(true);

    todo.toggleCompletion();
    expect(todo.get('completed')).toBe(false);
  });
});
