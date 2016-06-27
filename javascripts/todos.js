$(function() {
  var todo = {
    init: function() {
      this.loadTodos();
      this.setHandlers();
    },

    setHandlers: function() {
      // TODO: Add ability to click outside of modal to dismiss it.

      var self = this;

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
            todo = self.todos[index];

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
          var todo = self.todos[index];

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
          self.addTodo(new_todo);
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
      var self = this;

      this.todos = JSON.parse(localStorage.getItem("todos")) || [];

      this.todos.forEach(function(todo) {
        self.addTodo(todo);
      });
    },

    saveTodos: function() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },

    // TODO: When a todo is added, deleted or marked as complete. Update the counters next the various lists.

    addTodo: function(todo) {
      todo_html = this.constructTodoHTML(todo);

      $("main ul").append(todo_html);
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

    markComplete: function(index) {
      var $todo_li = $("main ul li").eq(index),
          todo;

      this.todos[index].complete = true;
      todo = this.todos.splice(index, 1)[0];
      this.todos.push(todo);

      $todo_li.addClass("complete");
      $todo_li.remove().appendTo($("main ul"));

      this.toggleTaskPane();
    },

    deleteTodo: function(index) {
      this.todos.splice(index, 1);
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
