app = {
  templates: JST,

  editTodo: function(model) {
    this.appView.editTodo(model);
  },

  sortTodos: function() {
    this.todos.sort();
  },

  navigate: function(location) {
    this.router.navigate(location, { trigger: true });
  }
};

_.extend(app, Backbone.Events);

app.on('edit', app.editTodo);
app.on('navigate', app.navigate);

Handlebars.registerHelper('formatDate', function(date) {
  var dateObj = new Date(date);

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

  var year = dateObj.getFullYear();
  var month = months[dateObj.getMonth()];
  var day = dateObj.getDate();

  return month + ' ' + day + ', ' + year;
});
