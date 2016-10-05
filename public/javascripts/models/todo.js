var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    description: '',
    completed: false
  },

  toggleCompletion: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});
