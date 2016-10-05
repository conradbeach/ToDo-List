app = {
  templates: JST,

  editTodo: function(model) {
    app.appView.editTodo(model);
  },

  createGroupName: function(date, completed) {
    return date + '-' + completed;
  },

  navigate: function(group) {
    this.router.navigate(group, { trigger: true });
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

Handlebars.registerHelper('ternary', function(condition, yes, no) {
  return condition ? yes : no;
});
