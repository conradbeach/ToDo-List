var TodoView = Backbone.View.extend({
  tagName: 'li',
  template: app.templates.todo,

  events: {
    'click span': 'edit',
    'click a': 'destroy'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);

    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    if (this.model.get('completed')) {
      this.$el.addClass('complete');
    }

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
