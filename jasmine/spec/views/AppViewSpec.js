describe('AppView', function() {
  beforeEach(function() {
    this.seedCollection();

    loadFixtures('body.html');

    this.view = new AppView({ el: 'body' });
    this.view.$('input[name="day"]').val('1');
    this.view.$('input[name="month"]').val('2');
    this.view.$('input[name="year"]').val('2016');
    this.view.$('input[name="title"]').val('Todo Item');
    this.view.$('textarea').val('Description');
  });

  it('renders the current todos count', function() {
    app.todoFilter = 'all-false';
    this.view.updateTodosCount();

    expect(this.view.$('main > p').html()).toEqual('1');
  });

  it('reads the form data', function () {
    expect(this.view.readForm().title).toEqual('Todo Item');
    expect(this.view.readForm().description).toEqual('Description');
    expect(this.view.readForm().dueDate).toEqual(new Date(2016, 1, 1));
  });
});
