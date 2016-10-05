var Router = Backbone.Router.extend({
  routes: {
    '': 'default',
    '*filter': 'setFilter'
  },

  default: function() {
    this.setFilter('all-false');
  },

  setFilter: function(param) {
    if (param) {
      param = param.trim();
    }

    app.todoFilter = param || '';
  }
});

app.router = new Router();
Backbone.history.start();
