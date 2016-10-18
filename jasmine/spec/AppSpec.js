describe('app', function () {
  it('creates a group name', function () {
    expect(app.createGroupName('10/16', 'true')).toEqual('10/16-true');
    expect(app.createGroupName('1/17', 'false')).toEqual('1/17-false');
  });
});
