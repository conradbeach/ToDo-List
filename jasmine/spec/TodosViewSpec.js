describe('TodosView view', function() {
  beforeEach(function() {
    this.seedCollection();

    loadFixtures('body.html');

    this.view = new TodosView({ el: 'main ul' });
  });

  it('renders todos based on current filter', function() {
    app.todoFilter = 'all-false';
    this.view.render();
    expect(this.view.$('li').length).toEqual(1);
    expect(this.view.$('li').html()).toContain('Task 2');
    expect(this.view.$('li').html()).toContain('May 20, 2016');

    app.todoFilter = 'all-true';
    this.view.render();
    expect(this.view.$('li').length).toEqual(1);
    expect(this.view.$('li').html()).toContain('Task 1');
    expect(this.view.$('li').html()).toContain('October 20, 2016');

    app.todoFilter = '10/2016-true';
    this.view.render();
    expect(this.view.$('li').length).toEqual(1);
    expect(this.view.$('li').html()).toContain('Task 1');
    expect(this.view.$('li').html()).toContain('October 20, 2016');
  });
});
