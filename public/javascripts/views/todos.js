var TodosView = Backbone.View.extend({
  el: $('main > ul'),
  collection: app.todos,

  initialize: function() {
    this.listenTo(this.collection, 'add', this.renderModel);

    this.render();
  },

  render: function() {
    this.collection.each(function(model) {
      this.renderModel(model);
    }, this);
  },

  renderModel: function(model) {
    var todoView = new TodoView({ model: model });

    this.$el.append(todoView.$el);
  }
});

app.todosView = new TodosView();
