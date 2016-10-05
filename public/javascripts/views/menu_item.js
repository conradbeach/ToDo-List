var MenuItemView = Backbone.View.extend({
  tagName: 'li',
  template: app.templates.menu_item,

  initialize: function(options) {
    this.group = options.group;
    this.count = options.count;
    this.date = this.group.split('-')[0];

    this.render();
  },

  render: function() {
    this.$el.html(this.template({ dueDate: this.date, count: this.count }));
  }
});
