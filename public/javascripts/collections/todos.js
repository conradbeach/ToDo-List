var Todos = Backbone.Collection.extend({
  model: Todo,
  localStorage: new Backbone.LocalStorage('todos-backbone'),

  initialize: function() {
    this.fetch();
  }
});

app.todos = new Todos();
