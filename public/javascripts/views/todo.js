var TodoView = Backbone.View.extend({
  template: app.templates.todo,

  events: {
    'click a': 'destroy'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  destroy: function(event) {
    event.preventDefault();

    this.model.destroy();
    this.remove();
  }
});
