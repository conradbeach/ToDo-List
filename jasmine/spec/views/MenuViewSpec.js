describe('MenuView', function() {
  beforeEach(function() {
    this.seedCollection();

    loadFixtures('body.html');

    this.view = new MenuView({ el: 'nav' });
  });

  it('renders both sections', function() {
    expect(this.view.$('section.todos').length).toEqual(1);
    expect(this.view.$('section.completed').length).toEqual(1);
  });

  it('renders the incompleteCount with the .todos header', function() {
    expect(this.view.$('section.todos h1').children('span').html()).toEqual('1');
  });

  it('renders each todo group', function() {
    expect(this.view.$('li').length).toEqual(2);

    expect(this.view.$('section.todos li').length).toEqual(1);
    expect(this.view.$('section.todos li').first().html()).toContain('5/2016');

    expect(this.view.$('section.completed li').length).toEqual(1);
    expect(this.view.$('section.completed li').first().html()).toContain('10/2016');
  });

  it('renders counts for each todo group', function() {
    expect(this.view.$('section.todos li').first()
                                          .html())
                                          .toContain('<span class="circle">1</span>');
                                          
    expect(this.view.$('section.completed li').first()
                                              .html())
                                              .toContain('<span class="circle">1</span>');
  });

  it('styles headers', function () {
    app.todoFilter = 'all-false';
    this.view.render();
    expect(this.view.$('section.todos h1')).toHaveClass('selected');
    expect(this.view.$('section.todos h1').children('span')).toHaveClass('highlighted');

    app.todoFilter = 'all-true';
    this.view.render();
    expect(this.view.$('section.completed h1')).toHaveClass('selected');
  });
});
