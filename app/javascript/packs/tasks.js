$(document).on('turbolinks:load', function() {
  if (!window.taskHandlerInitialized) {
    let isSubmitting = false;
    
    $('input[name="date_range"]').daterangepicker({
      locale: {
        format: 'YYYY-MM-DD'
      },
      opens: 'left'
    }, function(start, end, label) {
      $('input[name="task[start_date]"]').val(start.format('YYYY-MM-DD'));
      $('input[name="task[end_date]"]').val(end.format('YYYY-MM-DD'));
    });
    

    $(document).off('submit', '#new_task, .edit_task').on('submit', '#new_task, .edit_task', function(e) {
      if (isSubmitting) return false;

      console.log("Submitting task form via Ajax");
      e.preventDefault();

      const submitButton = $(this).find('input[type="submit"]');
      submitButton.prop('disabled', true);

      isSubmitting = true;

      $.ajax({
        url: $(this).attr('action'),
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        complete: function() {
          isSubmitting = false;
        },
        success: function(data) {
          if (data.success) {
            $('#taskModal').modal('hide');
            alert(data.message);
            
            const newTaskLink = $('<a></a>').attr('href', '/tasks/' + data.task.id).text(data.task.title);
            const checkbox = $('<input>')
              .attr('type', 'checkbox')
              .attr('name', 'task_completed_' + data.task.id)
              .attr('value', data.task.id)
              .attr('data-url', '/tasks/' + data.task.id + '/toggle')
              .addClass('task-completed-checkbox');
            const newTask = $('<li></li>')
              .addClass('list-group-item d-flex justify-content-between align-items-center')
              .append(newTaskLink)
              .append(checkbox);
            $('#taskList').append(newTask);

          } else {
            alert('エラーが発生しました:' + data.message);
          }
          submitButton.prop('disabled', false);
        },
        error: function() {
          alert('エラーが発生しました。');
          submitButton.prop('disabled', false);
        }
      });
    });

    // タスク完了のチェックボックスのトグル
    $(document).on('change', '.task-completed-checkbox', function() {
      const taskId = $(this).val();
      const isChecked = $(this).prop('checked');
      const url = $(this).data('url');
      const taskElement = $(this).closest('li');

      $.ajax({
        url: url,
        method: 'PATCH',
        dataType: 'json',
        data: {
          task: {
            is_checked: isChecked
          }
        },
        success: function(data) {
          if (data.success && isChecked) {
            taskElement.fadeOut(function() {
              taskElement.remove();
            });
          }
        }
      });
    });

    window.taskHandlerInitialized = true;
  }
});
