var TodoView = Backbone.View.extend({
  template: app.templates.todo,

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }

  // TODO: Listen to this.model and remove yourself if the model is removed.
});
