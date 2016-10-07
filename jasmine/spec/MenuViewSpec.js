describe('MenuView view', function() {
  beforeEach(function() {
    app.todos.reset();
    app.todos.create({ completed: true, dueDate: new Date('10-20-2016') });
    app.todos.create({ completed: false, dueDate: new Date('5-20-2016') });

    setFixtures('<nav></nav>');

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
    expect(this.view.$('section.todos li').first().html()).toContain('<span class="circle">1</span>');
    expect(this.view.$('section.completed li').first().html()).toContain('<span class="circle">1</span>');
  });
});
