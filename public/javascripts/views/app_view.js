var AppView = Backbone.View.extend({
  el: $('body'),
  $todoPane: this.$('aside'),

  events: {
    'click input[name="complete"]': 'completeTask'
    'click #new-todo': 'toggleTodoPane',
    'click aside': 'shouldCloseTodoPane',
    'click input[name="save"]': 'saveTodo',
  },

  toggleTodoPane: function() {
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
    event.preventDefault();

    var todoAttributes = this.readForm();
    var todoId = this.$todoPane.attr('data-todo-id');

    if (todoId) {
      _.extend(todoAttributes, { id: todoId });

      model = app.todos.get(todoId);
      model.set(todoAttributes);
      model.save()
    } else {
      model = app.todos.create(todoAttributes);
    }

    this.toggleTodoPane();

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
    event.preventDefault();
  }
});

app.appView = new AppView();
