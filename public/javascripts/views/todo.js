var TodoView = Backbone.View.extend({
  tagName: 'li',
  template: app.templates.todo,

  events: {
    'click': 'edit',
    'click span': 'toggleCompletion',
    'click a': 'destroy'
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    if (this.model.get('completed')) {
      this.$el.addClass('complete');
    }
  },

  edit: function() {
    app.trigger('edit', this.model);
  },

  toggleCompletion: function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.toggleCompletion();
  },

  destroy: function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.destroy();
  }
});
