app = {
  templates: JST
};

Handlebars.registerHelper('formatDate', function(date) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

  var year = date.getFullYear();
  var month = months[date.getMonth()];
  var day = date.getDate();

  return month + ' ' + day + ', ' + year;
});

Handlebars.registerHelper('ternary', function(condition, yes, no) {
  return condition ? yes : no;
});
