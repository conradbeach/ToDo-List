var TodoView = Backbone.View.extend({
  template: app.templates.todo,

  events: {
    'click span': 'edit',
    'click a': 'destroy'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  edit: function() {
    app.trigger('edit', this.model);
  },

  destroy: function(event) {
    event.preventDefault();

    this.model.destroy();
    this.remove();
  }
});
