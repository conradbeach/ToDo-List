var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    'click #new-todo': 'toggleTaskPane',
    'click aside': 'shouldCloseTaskPane',
    'click input[name="save"]': 'saveTask',
    'click input[name="complete"]': 'completeTask'
  },

  toggleTaskPane: function() {
    var $taskPane = this.$('aside');

    if ($taskPane.hasClass('hidden')) {
      $taskPane.removeClass();
    } else {
      $taskPane.addClass('hidden');
      $taskPane.children('form')[0].reset();
      $taskPane.removeAttr('data-index'); // TODO: Do I need this?
    }
  },

  shouldCloseTaskPane: function(event) {
    if (event.target === this.$('aside')[0]) {
      this.toggleTaskPane();
    }
  },

  saveTask: function(event) {
    event.preventDefault();

    var todoAttributes = this.readForm();

    app.todos.create(todoAttributes);

    this.toggleTaskPane();
  },

  readForm: function() {
    var todoAttributes = {};

    var day = this.$('input[name="day"]').val().trim();
    var month = this.$('input[name="month"]').val().trim();
    var year = this.$('input[name="year"]').val().trim();

    todoAttributes.title = this.$('input[name="title"]').val().trim();
    todoAttributes.description = $('textarea').val().trim();
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

  completeTask: function(event) {
    event.preventDefault();
  }
});

app.appView = new AppView();
