var MenuView = Backbone.View.extend({
  el: $('nav'),
  template: app.templates.menu,

  initialize: function() {
    this.listenTo(app.todos, 'update sync', this.render);
    this.listenTo(app.router, 'route', this.render);

    this.render();
  },

  render: function() {
    var todoGroups = app.todos.groups();

    this.$el.html(this.template({ incompleteCount: app.todos.incompleteCount() }));

    Object.keys(todoGroups).forEach(function(group) {
      var completed = (group.split('-')[1] === 'true');

      var view = new MenuItemView({
        group: group,
        count: todoGroups[group].length
      });

      this.addView(view, completed);
    }, this);
  },

  addView: function(view, completed) {
    var appendToSelector = completed ? 'section.completed ul' : 'section.todos ul';

    this.$(appendToSelector).append(view.$el);
  }
});

app.menuView = new MenuView();
