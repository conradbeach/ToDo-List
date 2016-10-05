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
        return (date.getMonth() + 1) + '/' + date.getFullYear() + '-' + model.get('completed');
      } else {
        return 'No Due Date-' + model.get('completed');
      }
    });
  }
});

app.todos = new Todos();
