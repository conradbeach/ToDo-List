var TodosView = Backbone.View.extend({
  el: $('main > ul'),
  collection: app.todos,

  initialize: function() {
    this.listenTo(this.collection, 'update change', this.render);
    this.listenTo(app.router, 'route', this.render);

    this.render();
  },

  render: function() {
    var currentTodos = this.collection.currentTodos();

    this.$el.html('');

    _(currentTodos).each(function(model) {
      this.renderModel(model);
    }, this);
  },

  renderModel: function(model) {
    var todoView = new TodoView({ model: model });

    this.$el.append(todoView.$el);
  }
});

app.todosView = new TodosView();
