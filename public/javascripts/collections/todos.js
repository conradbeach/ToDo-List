var Todos = Backbone.Collection.extend({
  model: Todo,
  localStorage: new Backbone.LocalStorage('todos-backbone'),

  comparator: 'dueDate',

  initialize: function() {
    this.fetch();
  },

  incompleteCount: function() {
    var counts = this.countBy(function(model) {
      return model.get('completed');
    });

    return counts.false;
  },

  groups: function() {
    return this.groupBy(function(model) {
      var date = new Date(model.get('dueDate'));

      if (date.valueOf()) {
        return app.createGroupName(
          (date.getMonth() + 1) + '/' + date.getFullYear(),
          model.get('completed')
        );
      } else {
        return app.createGroupName('No Due Date', model.get('completed'));
      }
    });
  },

  currentTodos: function() {
    var groups;
    var currentTodos;

    if (app.todoFilter === 'all-false') {
      currentTodos = this.where(function(model) {
        return !model.get('completed');
      });
    } else {
      groups = this.groups();

      currentTodos = groups[app.todoFilter] || [];
    }

    return currentTodos;
  }
});

app.todos = new Todos();

app.listenTo(app.todos, 'change', app.sortTodos);
