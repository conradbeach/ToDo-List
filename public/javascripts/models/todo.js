var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    description: '',
    completed: false
  },

  toggleCompleted: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});
