var Todos = Backbone.Collection.extend({
  model: Todo,
  localStorage: new Backbone.LocalStorage('todos-backbone'),

  comparator: 'dueDate',

  initialize: function() {
    this.fetch();
  },

  incompleteCount: function() {
    return this.incompleteTodos().length;
  },

  completeTodos: function() {
    return this.where({ completed: true });
  },

  incompleteTodos: function() {
    return this.where({ completed: false });
  },

  groups: function() {
    return this.groupBy(function(model) {
      var date = new Date(model.get('dueDate'));

      if (date.valueOf()) {
        return (date.getMonth() + 1) + '/' + date.getFullYear() + '-' + model.get('completed');
      } else {
        return 'No Due Date-' + model.get('completed');
      }
    });
  },

  currentTodos: function() {
    var groups;
    var currentTodos;

    if (app.todoFilter === 'all-false') {
      currentTodos = this.incompleteTodos();
    } else if (app.todoFilter === 'all-true') {
      currentTodos = this.completeTodos();
    } else {
      groups = this.groups();

      currentTodos = groups[app.todoFilter] || [];
    }

    return currentTodos;
  }
});

app.todos = new Todos();

app.listenTo(app.todos, 'change', app.sortTodos);
