var AppView = Backbone.View.extend({
  el: $('body'),
  $todoPane: this.$('aside'),

  events: {
    'click #new-todo': 'toggleTodoPane',
    'click aside': 'shouldCloseTodoPane',
    'click input[name="save"]': 'saveTodo',
    'click input[name="complete"]': 'toggleCompletion'
  },

  initialize: function() {
    this.listenTo(app.todos, 'update change', this.updateTodosCount);
    this.listenTo(app.router, 'route', this.updateTodosCount);

    this.updateTodosCount();
  },

  updateTodosCount: function() {
    var count = app.todos.currentTodos().length;

    this.$('main > p').html(count);
  },

  toggleTodoPane: function(event) {
    if (event) { event.preventDefault(); }

    if (this.$todoPane.hasClass('hidden')) {
      this.$todoPane.removeClass();
    } else {
      this.$todoPane.addClass('hidden');
      this.$todoPane.children('form')[0].reset();
      this.$todoPane.removeAttr('data-todo-id');
    }
  },

  shouldCloseTodoPane: function(event) {
    if (event.target === this.$('aside')[0]) {
      this.toggleTodoPane();
    }
  },

  saveTodo: function(event) {
    if (event) { event.preventDefault(); }

    var todoAttributes = this.readForm();
    var todoId = this.$todoPane.attr('data-todo-id');

    if (todoId) {
      _.extend(todoAttributes, { id: todoId });

      model = app.todos.get(todoId);
      model.set(todoAttributes);
      model.save();
    } else {
      model = app.todos.create(todoAttributes);
    }

    this.toggleTodoPane();

    return model;
  },

  readForm: function() {
    var todoAttributes = {};

    var day = this.$('input[name="day"]').val().trim();
    var month = this.$('input[name="month"]').val().trim();
    var year = this.$('input[name="year"]').val().trim();

    todoAttributes.title = this.$('input[name="title"]').val().trim();
    todoAttributes.description = this.$('textarea').val().trim();
    todoAttributes.dueDate = this.createDate(day, month, year);

    return todoAttributes;
  },

  createDate: function(day, month, year) {
    var today = new Date();

    if (!day && !month && !year) { return undefined; }

    cleanDay = Number(day) || today.getDate();
    cleanMonth = Number(month) || today.getMonth() + 1;
    cleanYear = Number(year) || today.getFullYear();

    return new Date(cleanYear, cleanMonth - 1, cleanDay);
  },

  editTodo: function(model) {
    var modelData = model.toJSON();
    var date = new Date(modelData.dueDate);

    this.$('input[name="title"]').val(modelData.title);
    this.$('input[name="day"]').val(date.getDate() || '');
    this.$('input[name="month"]').val(date.getMonth() + 1 || '');
    this.$('input[name="year"]').val(date.getFullYear() || '');
    this.$('textarea').val(modelData.description);

    this.$todoPane.attr('data-todo-id', modelData.id);

    this.toggleTodoPane();
  },

  toggleCompletion: function(event) {
    event.preventDefault();

    var model = this.saveTodo();

    model.toggleCompletion();
  }
});

app.appView = new AppView();
