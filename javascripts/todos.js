$(function() {
  var todo = {
    init: function() {
      this.loadTodos();
      this.setHandlers();
    },

    setHandlers: function() {
      var self = this;

      $("main > a").on("click", function(event) {
        event.preventDefault();

        self.toggleTaskPane();
      });

      $("main ul").on("click", "a", function(event) {
        event.preventDefault();

        var index = $("main ul li").index($(event.target).parent());
        self.deleteTodo(index);
      });

      $("form").on("submit", function(event) {
        event.preventDefault();

        var new_todo = {};

        new_todo.title = $("input[name='title']").val();
        new_todo.month = $("input[name='month']").val();
        new_todo.day = $("input[name='day']").val();
        new_todo.year = $("input[name='year']").val();
        new_todo.desc = $("textarea").val();

        self.todos.push(new_todo);
        self.addTodo(new_todo);

        self.toggleTaskPane();
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

    addTodo: function(todo) {
      todo_html = this.constructTodoHTML(todo);

      $("main ul").append(todo_html);
    },

    constructTodoHTML: function(todo) {
      var todo_html = "<li><strong>" + todo.title + "</strong>";

      if (todo.desc) {
        todo_html += ": " + todo.desc;
      }

      if (todo.day && todo.month && todo.year) {
        todo_html += "<time>" + todo.month + "/" + todo.day + "/" + todo.year + "</time>";
      }

      todo_html += "<a href='#'></a></li>";

      return todo_html;
    },

    deleteTodo: function(index) {
      console.log(index);
      this.todos.splice(index, 1);
      $("main ul li").eq(index).remove();
    },

    toggleTaskPane: function() {
      var $task_pane = $("aside");

      if ($task_pane.hasClass("hidden")) {
        $task_pane.removeClass();
      } else {
        $task_pane.addClass("hidden");
        $("aside form")[0].reset();
      }
    }
  };

  todo.init();
});
