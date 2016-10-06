describe('MenuItemView view', function() {
  var view = new MenuItemView({ group: '10/2016-false', count: 2 });

  it('sets correct values during initialization', function() {
    expect(view.group).toEqual('10/2016-false');
    expect(view.count).toEqual(2);
    expect(view.date).toEqual('10/2016');
  });

  it('contains the correct HTML', function() {
    expect(view.$el.html()).toContain('10/2016<span class="circle">2</span>');
  });

  it('adds correct classes if group matches app.todoFilter', function() {
    app.todoFilter = '10/2016-false';
    view.render();

    expect(view.$el).toHaveClass('selected');
    expect(view.$el.children('span')).toHaveClass('highlighted');
  });
});
