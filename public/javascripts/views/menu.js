var MenuView = Backbone.View.extend({
  el: $('nav'),
  template: app.templates.menu,

  events: {
    'click section.todos h1': 'allTodos',
    'click section.completed h1': 'allCompletedTodos'
  },

  initialize: function() {
    this.listenTo(app.todos, 'update change', this.render);
    this.listenTo(app.router, 'route', this.render);

    this.render();
  },

  render: function() {
    var todoGroups = app.todos.groups();

    this.$el.html(this.template({ incompleteCount: app.todos.incompleteCount() }));

    this.styleHeaders();

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
  },

  styleHeaders: function() {
    var headerClass;

    if (app.todoFilter === 'all-false') {
      headerClass = 'todos';
    } else if (app.todoFilter === 'all-true') {
      headerClass = 'completed';
    }

    this.$('section.' + headerClass + ' h1').addClass('selected')
                                            .children('span')
                                            .addClass('highlighted');
  },

  allTodos: function() {
    app.trigger('navigate', 'all-false');
  },

  allCompletedTodos: function() {
    app.trigger('navigate', 'all-true');
  }
});

app.menuView = new MenuView();
