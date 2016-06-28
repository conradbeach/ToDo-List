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

      // TODO: There's a fair bit of code duplication in the next 4 event handlers.
      $("nav .todos h1").on("click", function (event) {
        self.updateFilter(0, 0, "false");
        self.updateView(false);
      });

      $("nav .completed h1").on("click", function() {
        self.updateFilter(0, 0, "true");
        self.updateView(false);
      });

      $("nav .todos").on("click", "li", function(event) {
        var date = self.parseNavDate(event.target);

        self.updateFilter(date.month, date.year, "false");
        self.updateView(false);

        $("nav li").removeClass();
        $(event.target).addClass("selected");
      });

      $("nav .completed").on("click", "li", function(event) {
        var date = self.parseNavDate(event.target);

        self.updateFilter(date.month, date.year, "true");
        self.updateView(false);

        $("nav li").removeClass();
        $(event.target).addClass("selected");
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
      $todo_li.remove().appendTo($("main ul"));

      this.filterTodos();
      this.updateNav();

      this.toggleTaskPane();
    },

    deleteTodo: function(index) {
      var deleted_todo = this.current_todos.splice(index, 1)[0];
      this.todos = this.todos.filter(function(element) { return element !== deleted_todo; });

      this.updateNav();

      $("main ul li").eq(index).remove();
    },

    updateView: function(updateNav) {
      if (updateNav) { this.updateNav(); }
      this.updateTodos();
      this.updateCounts();
      this.updateHeader();
    },

    updateTodos: function() {
      var self = this;

      this.current_todos = [];

      $("main ul").empty();

      this.todos.forEach(function(todo) {
        if (!self.current_filter.month && !self.current_filter.year && !self.current_filter.complete) {
          self.showTodo(todo);
          self.current_todos.push(todo);
        } else if (!self.current_filter.month && !self.current_filter.year) {
          if (String(todo.complete) === self.current_filter.complete) {
            self.showTodo(todo);
            self.current_todos.push(todo);
          }
        } else if (!self.current_filter.complete) {
          if (todo.month === self.current_filter.month && todo.year === self.current_filter.year) {
            self.showTodo(todo);
            self.current_todos.push(todo);
          }
        } else {
          if (todo.month === self.current_filter.month && todo.year === self.current_filter.year && String(todo.complete) === self.current_filter.complete) {
            self.showTodo(todo);
            self.current_todos.push(todo);
          }
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
        var html = "<li>" + date + "<span class='circle'>" + due_dates.incomplete[date] + "</span></li>";

        $todo_ul.append(html);
      });

      Object.keys(due_dates.complete).forEach(function(date) {
        var html = "<li>" + date + "</li>";

        $complete_ul.append(html);
      });
    },

    updateCounts: function() {
      // TODO: When a todo is added, deleted or marked as complete. Update the counters next the various lists.
      var due_dates = this.getDueDates(),
          incomplete_todos_count = 0;

      Object.keys(due_dates.incomplete).forEach(function(date) {
        incomplete_todos_count += due_dates.incomplete[date];
      });

      $("nav .todos p").text(incomplete_todos_count);

      $("main p").text(this.current_todos.length);
    },

    updateHeader: function() {
      if (!this.current_filter.month && !this.current_filter.year && this.current_filter.complete === "false") {
        $("main h1").text("All Todos");
      } else if (!this.current_filter.month && !this.current_filter.year && this.current_filter.complete === "true") {
        $("main h1").text("Completed");
      } else {
        $("main h1").text(this.current_filter.month + "/" + this.current_filter.year);
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

      split_text = $(element).html().split(/<span/)[0].split(/\//);
      month = +split_text[0];
      year = +split_text[1];

      return { month: month, year: year };
    },

    // TODO: Order due dates.
    // Returns an object with complete and incomplete properties that both contain a list of due dates.
    getDueDates: function() {
      var due_dates = {
        complete: {},
        incomplete: {}
      };

      function keepDate(list, date) {
        if (!date.month || !date.year) { return false; }

        var uniq = true;

        list.forEach(function(list_date) {
          if (_.isEqual(list_date, date)) { uniq = false; }
        });

        return uniq;
      }

      for (var i = 0; i < this.todos.length; i++ ) {
        var todo = this.todos[i];

        if (!todo.month || !todo.year) { continue; }

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
      }

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
