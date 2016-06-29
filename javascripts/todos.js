$(function() {
  var todo = {
    init: function() {
      this.current_filter = {
        month: 0,
        year: 0,
        complete: "false"
      };

      this.loadTodos();
      this.updateView(true);
      this.setHandlers();
    },

    setHandlers: function() {
      // TODO: Add ability to click outside of modal to dismiss it.

      var self = this;

      function navEvent(event, complete) {
        var date = self.parseNavDate(event.target);

        self.updateFilter(date.month, date.year, String(complete));
        self.updateView(false);
      }

      $("nav .todos").on("click", "li", function(event) {
        navEvent(event, false);
      });

      $("nav .completed").on("click", "li", function(event) {
        navEvent(event, true);
      });

      $("main > a").on("click", function(event) {
        event.preventDefault();
        self.toggleTaskPane();
      });

      $("main ul").on("click", "a", function(event) {
        event.preventDefault();

        var index = $("main ul li").index($(event.currentTarget).parent());
        self.deleteTodo(index);
      });

      // TODO: Refactor this.
      $("main ul").on("click", "span", function(event) {
        var index = $("main ul li").index($(event.currentTarget).parent()),
            todo = self.current_todos[index];

        self.toggleTaskPane();
        $("input[name='title']").val(todo.title);
        $("input[name='month']").val(todo.month || "");
        $("input[name='day']").val(todo.day || "");
        $("input[name='year']").val(todo.year || "");
        $("textarea").val(todo.desc);

        $("aside").addClass("edit");
        $("aside").attr("data-index", index);
      });

      $("form [name='save']").on("click", function(event) {
        event.preventDefault();

        var index = self.getFormTodoIndex();

        if (index) {
          self.updateTodo(index);
        } else {
          self.createTodo();
        }

        self.toggleTaskPane();
      });

      $("form [name='complete']").on("click", function(event) {
        event.preventDefault();

        var index = self.getFormTodoIndex();

        if (index) {
          self.markComplete(index);
        }
      });

      $(window).on("unload", function(event) {
        self.saveTodos();
      });
    },

    loadTodos: function() {
      this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    },

    saveTodos: function() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },

    updateFilter: function(month, year, complete) {
      this.current_filter = {
        month: +month,
        year: +year,
        complete: complete
      };
    },

    showTodo: function(todo) {
      todo_html = this.constructTodoHTML(todo);

      $("main ul").append(todo_html);
    },

    createTodo: function() {
      var new_todo = {};

      new_todo.title = $("input[name='title']").val();
      new_todo.month = +$("input[name='month']").val();
      new_todo.day = +$("input[name='day']").val();
      new_todo.year = +$("input[name='year']").val();
      new_todo.desc = $("textarea").val();
      new_todo.complete = false;

      this.todos.push(new_todo);
      this.updateView(true);
    },

    updateTodo: function(index) {
      var todo = this.current_todos[index];

      todo.title = $("input[name='title']").val();
      todo.month = +$("input[name='month']").val();
      todo.day = +$("input[name='day']").val();
      todo.year = +$("input[name='year']").val();
      todo.desc = $("textarea").val();

      todo_html = this.constructInnerTodoHTML(todo);
      $("main ul li").eq(index).html(todo_html);
    },

    // TODO: Add ability to mark an item as uncomplete.
    // TODO: Add ability to click on check mark next to item to toggle completion.
    markComplete: function(index) {
      var $todo_li = $("main ul li").eq(index),
          todo;

      this.current_todos[index].complete = true;

      $todo_li.addClass("complete");

      this.updateView(true);

      this.toggleTaskPane();
    },

    deleteTodo: function(index) {
      var deleted_todo = this.current_todos.splice(index, 1)[0];
      this.todos = this.todos.filter(function(element) { return element !== deleted_todo; });

      this.updateView(true);
    },

    updateView: function(updateNav) {
      if (updateNav) {
        this.updateNav();
        this.orderNav();
      }

      this.updateTodos();
      this.updateCounts();
      this.updateHeader();
      this.updateSelectedNav();
    },

    updateTodos: function() {
      var self = this;

      this.current_todos = [];

      $("main ul").empty();

      this.todos.forEach(function(todo) {
        if (todo.month === self.current_filter.month && todo.year === self.current_filter.year && String(todo.complete) === self.current_filter.complete) {
          self.showTodo(todo);
          self.current_todos.push(todo);
        }
      });
    },

    // TODO: Refactor this so you're not reconstructing the entire nav each time.
    updateNav: function() {
      var due_dates = this.getDueDates(),
          $todo_ul = $("nav section.todos ul"),
          $complete_ul = $("nav section.completed ul");

      $todo_ul.empty();
      $complete_ul.empty();

      Object.keys(due_dates.incomplete).forEach(function(date) {
        var html,
            count = due_dates.incomplete[date];

        if (date === "0/0") {
          date = "No Due Date";
        }

        html = "<li>" + date + "<span class='circle'>" + count + "</span></li>";

        $todo_ul.append(html);
      });

      Object.keys(due_dates.complete).forEach(function(date) {
        var html;

        if (date === "0/0") {
          date = "No Due Date";
        }

        html = "<li>" + date + "</li>";

        $complete_ul.append(html);
      });
    },

    orderNav: function() {
      var self = this;

      function order(selector) {
        elements = $(selector).children("li").toArray();

        elements.sort(function(a, b) {
          var a_date = self.parseNavDate(a),
              b_date = self.parseNavDate(b);

          if (a_date.year > b_date.year) {
            return 1;
          } else if (a_date.year < b_date.year) {
            return -1;
          } else if (a_date.month > b_date.month) {
            return 1;
          } else {
            return -1;
          }
        });

        elements.forEach(function(element) {
          $(element).detach().appendTo($(selector));
        });
      }

      order("nav .todos ul");
      order("nav .completed ul");
    },

    updateCounts: function() {
      var due_dates = this.getDueDates(),
          incomplete_todos_count = 0;

      this.todos.forEach(function(todo) {
        if (!todo.complete) {
          incomplete_todos_count += 1;
        }
      });

      $("nav .todos h1 span").text(incomplete_todos_count);

      $("main p").text(this.current_todos.length);
    },

    updateHeader: function() {
      var $main_header = $("main h1");

      if (this.current_filter.month === 0 && this.current_filter.year === 0) {
        $main_header.text("No Due Date");
      } else {
        $main_header.text(this.current_filter.month + "/" + this.current_filter.year);
      }
    },

    updateSelectedNav: function() {
      var self = this;

      function selectNav(selector) {
        $selected_li = $(selector).filter(function() {
          date = self.parseNavDate(this);

          return date.month === self.current_filter.month && date.year === self.current_filter.year;
        });

        $selected_li.addClass("selected").children("span").addClass("highlighted");
      }

      $("nav li").removeClass("selected").children("span").removeClass("highlighted");

      if (this.current_filter.complete === "false") {
        selectNav("nav .todos li");
      } else {
        selectNav("nav .completed li");
      }
    },

    toggleTaskPane: function() {
      var $task_pane = $("aside");

      if ($task_pane.hasClass("hidden")) {
        $task_pane.removeClass();
      } else {
        $task_pane.addClass("hidden");
        $task_pane.children("form")[0].reset();
        $task_pane.removeAttr("data-index");
      }
    },

    // Returns an object with month and year properties. e.g. { month: 1, year: 2016 };
    parseNavDate: function(element) {
      var split_text,
          month,
          year;

      if ($(element).html().split(/<span/)[0] === "No Due Date") {
        return { month: 0, year: 0 };
      }

      split_text = $(element).html().split(/<span/)[0].split(/\//);
      month = +split_text[0];
      year = +split_text[1];

      return { month: month, year: year };
    },

    // Returns an object with complete and incomplete properties that both contain a list of due dates.
    getDueDates: function() {
      var due_dates = {
        complete: {},
        incomplete: {}
      };

      this.todos.forEach(function(todo) {
        var date = todo.month + "/" + todo.year;

        if (todo.complete) {
          if (due_dates.complete[date]) {
            due_dates.complete[date] += 1;
          } else {
            due_dates.complete[date] = 1;
          }
        } else {
          if (due_dates.incomplete[date]) {
            due_dates.incomplete[date] += 1;
          } else {
            due_dates.incomplete[date] = 1;
          }
        }
      });

      return due_dates;
    },

    constructTodoHTML: function(todo) {
      var todo_html = "<li";

      if (todo.complete) {
        todo_html += " class='complete'";
      }

      todo_html += "><span><strong>" + todo.title + "</strong>";

      if (todo.desc) {
        todo_html += ": " + todo.desc;
      }

      if (todo.day && todo.month && todo.year) {
        todo_html += "<time>" + todo.month + "/" + todo.day + "/" + todo.year + "</time>";
      }

      todo_html += "</span><a href='#'></a></li>";

      return todo_html;
    },

    constructInnerTodoHTML: function(todo) {
      var html = this.constructTodoHTML(todo);

      return html.replace(/<li>/, "").replace(/<\/li>/, "");
    },

    getFormTodoIndex: function() {
      return $("aside").attr("data-index");
    }
  };

  todo.init();
});
