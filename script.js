$(document).ready(function() {
  // Carregar tarefas do banco de dados
  loadTasks();

  // Adicionar tarefa
  $('#taskForm').submit(function(event) {
    event.preventDefault();
    var description = $('#taskInput').val();
    addTask(description);
  });

  // Marcar/desmarcar tarefa como concluída
  $('#taskList').on('click', 'li', function() {
    var taskId = $(this).data('id');
    toggleTaskStatus(taskId);
  });

  // Deletar tarefa
  $('#taskList').on('click', '.delete-button', function(event) {
    event.stopPropagation();
    var listItem = $(this).parent();
    var taskId = listItem.data('id');
    deleteTask(taskId);
    listItem.remove();
  });
});

function loadTasks() {
  $.ajax({
    url: 'api.php',
    type: 'GET',
    dataType: 'json',
    success: function(tasks) {
      var taskList = $('#taskList');
      taskList.empty();
      $.each(tasks, function(index, task) {
        var listItem = $('<li>', {
          'data-id': task.id,
          'class': task.completed ? 'completed-task' : ''
        });
        var description = $('<span>', {
          'class': 'description',
          'text': task.description
        });
        listItem.append(description);
        var deleteButton = $('<button>', {
          'class': 'delete-button',
          'text': 'Excluir'
        });
        listItem.append(deleteButton);
        taskList.append(listItem);
      });
    }
  });
}

function addTask(description) {
  $.ajax({
    url: 'api.php',
    type: 'POST',
    data: {
      description: description
    },
    dataType: 'json',
    success: function(task) {
      if (task && task.id) {
        var listItem = $('<li>', {
          'data-id': task.id
        });
        var taskDescription = $('<span>', {
          'class': 'description',
          'text': task.description
        });
        listItem.append(taskDescription);
        var deleteButton = $('<button>', {
          'class': 'delete-button',
          'text': 'Excluir'
        });
        listItem.append(deleteButton);
        $('#taskList').append(listItem);
        $('#taskInput').val('');
      } else {
        console.log('Erro ao adicionar tarefa.');
      }
    }
  });
}


function toggleTaskStatus(taskId) {
  var listItem = $('[data-id="' + taskId + '"]');
  var isCompleted = listItem.hasClass('completed-task');
  $.ajax({
    url: 'api.php',
    type: 'PUT',
    data: {
      id: taskId,
      completed: isCompleted ? 0 : 1
    },
    success: function() {
      listItem.toggleClass('completed-task');
    }
  });
}

function deleteTask(taskId) {
  $.ajax({
    url: 'api.php',
    type: 'DELETE',
    data: {
      id: taskId
    },
    success: function() {}
  });
}
