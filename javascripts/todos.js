$(function() {
  var todo = {
    init: function() {
      this.current_filter = {
        month: 0,
        year: 0,
        complete: "false"
      };

      this.loadTodos();
      this.filterTodos();
      this.setHandlers();
    },

    setHandlers: function() {
      // TODO: Add ability to click outside of modal to dismiss it.

      var self = this;

      // TODO: There's a fair bit of code duplication in the next 4 event handlers.
      $("nav section.todos h1").on("click", function () {
        self.updateFilter(0, 0, "false");
        self.filterTodos();
      });

      $("nav section.completed h1").on("click", function() {
        self.updateFilter(0, 0, "true");
        self.filterTodos();
      });

      $("nav section.todos li").on("click", function(event) {
        var date = self.parseNavDate(event.currentTarget);

        self.updateFilter(date.month, date.year, "false");
        self.filterTodos();
      });

      $("nav section.completed li").on("click", function() {
        var date = self.parseNavDate(event.currentTarget);

        self.updateFilter(date.month, date.year, "true");
        self.filterTodos();
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
          var todo = self.current_todos[index];

          todo.title = $("input[name='title']").val();
          todo.month = +$("input[name='month']").val();
          todo.day = +$("input[name='day']").val();
          todo.year = +$("input[name='year']").val();
          todo.desc = $("textarea").val();

          todo_html = self.constructInnerTodoHTML(todo);
          $("main ul li").eq(index).html(todo_html);
        } else {
          var new_todo = {};

          new_todo.title = $("input[name='title']").val();
          new_todo.month = +$("input[name='month']").val();
          new_todo.day = +$("input[name='day']").val();
          new_todo.year = +$("input[name='year']").val();
          new_todo.desc = $("textarea").val();
          new_todo.complete = false;

          self.todos.push(new_todo);
          self.showTodo(new_todo); // TODO: This is going to show a new todo even if it doesn't belong in the category currently being viewed. Switch this out for a filterTodos() call.
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
      this.filterTodos(0, 0, "false");
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

    filterTodos: function() {
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

    // Returns an object with month and year properties. e.g. { month: 1, year: 2016 };
    parseNavDate: function(element) {
      var split_text,
          month,
          year;

      split_text = $(element).text().split(/\//);
      month = +split_text[0];
      year = +split_text[1];

      return { month: month, year: year };
    },

    showTodo: function(todo) {
      todo_html = this.constructTodoHTML(todo);

      $("main ul").append(todo_html);
    },

    updateCounts: function() {
      // TODO: When a todo is added, deleted or marked as complete. Update the counters next the various lists.
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

    // TODO: Add ability to mark an item as uncomplete.
    // TODO: Add ability to click on check mark next to item to toggle completion.
    markComplete: function(index) {
      var $todo_li = $("main ul li").eq(index),
          todo;

      this.current_todos[index].complete = true;

      $todo_li.addClass("complete");
      $todo_li.remove().appendTo($("main ul"));

      // TODO: Update visible todos.

      this.toggleTaskPane();
    },

    deleteTodo: function(index) {
      var deleted_todo = this.current_todos.splice(index, 1)[0];
      this.todos = this.todos.filter(function(element) { return element !== deleted_todo; });

      $("main ul li").eq(index).remove();
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

    getFormTodoIndex: function() {
      return $("aside").attr("data-index");
    }
  };

  todo.init();
});
