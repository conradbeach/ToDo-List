describe('router', function () {
  beforeAll(function() {
    this.router = new Router();
  });

  it('has a default route', function () {
    expect(this.router.routes['']).toEqual('default');
  });

  it('has a filter route', function () {
    expect(this.router.routes['*filter']).toEqual('setFilter');
  });
});
