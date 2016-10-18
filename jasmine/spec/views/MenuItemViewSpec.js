describe('MenuItemView', function() {
  beforeAll(function() {
    this.view = new MenuItemView({ group: '10/2016-false', count: 2 });
  });

  it('sets correct values during initialization', function() {
    expect(this.view.group).toEqual('10/2016-false');
    expect(this.view.count).toEqual(2);
    expect(this.view.date).toEqual('10/2016');
  });

  it('adds correct classes if group matches app.todoFilter', function() {
    app.todoFilter = '10/2016-false';
    this.view.render();

    expect(this.view.$el).toHaveClass('selected');
    expect(this.view.$el.children('span')).toHaveClass('highlighted');
  });
});
