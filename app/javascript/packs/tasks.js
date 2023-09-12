$(document).on('turbolinks:load', function() {
  
   $('#taskModal').on('hidden.bs.modal', function() {
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
    });
    
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
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            alert(data.message);

            const newTaskLink = $('<a></a>').attr('href', '/tasks/' + data.task.id).text(data.task.title).addClass('task-link');
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

    $(document).on('click', '.task-link', function(e) {
      e.preventDefault();
      const taskUrl = $(this).attr('href');

      $.get(taskUrl, function(data) {
        $('#taskDetailModal .modal-body').html(data);
        $('#taskDetailModal').modal('show');
      });
    });

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

    // タスクの詳細モーダルが表示されたときの処理
    $(document).on('shown.bs.modal', '#taskDetailModal', function() {
      const modal = $(this);
      const titleElement = modal.find('h1');
      const descriptionElement = modal.find('p').eq(0);
      const dueDateText = modal.find('p').eq(1).text().replace('期限:','');
      const dueDateElement = modal.find('p').eq(1).find('strong').after(`<input type="text" value="${dueDateText}">`).next();
      const priorityElement = modal.find('p').eq(2);

      // 各項目を編集可能な状態にする
      titleElement.html(`<input type="text" value="${titleElement.text()}">`);
      descriptionElement.find('strong').after(`<textarea>${descriptionElement.text().replace('説明：', '')}</textarea>`);
      dueDateElement.daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
        singleDatePicker: true,
        opens: 'left'
      }, function(selectedDate) {
         dueDateElement.val(selectedDate.format('YYYY-MM-DD'));
      });
      
      priorityElement.find('strong').after(`<input type="text" value="${priorityElement.text().replace('優先度：', '')}">`);

      // 保存ボタンを追加
      modal.find('.modal-footer').prepend('<button id="saveTaskChanges" class="btn btn-primary">変更を保存</button>');
    });

    // 保存ボタンがクリックされたときの処理
  $(document).on('click', '#saveTaskChanges', function() {
    const modal = $('#taskDetailModal');
    const taskId = modal.data('task-id'); // タスクのIDをモーダルのdata属性から取得
    const title = modal.find('h1 input').val();
    const description = modal.find('p textarea').val();
    const dateRange = modal.find('p input[type="text"]').data('daterangepicker'); // daterangepickerのインスタンスを取得
    const startDate = dateRange.startDate.format('YYYY-MM-DD');
    const endDate = dateRange.endDate.format('YYYY-MM-DD');
    const priority = modal.find('p input[type="text"]').val();
    
    $.ajax({
      url: `/tasks/${taskId}`,
      method: 'PATCH',
      data: {
        task: {
          title: title,
          description: description,
          start_date: startDate,
          end_date: endDate,
          priority: priority
        }
      },
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          alert(data.message);  // サーバーからのメッセージを表示
          modal.modal('hide');
          location.reload();
        } else {
          alert('エラーが発生しました:' + data.message);
        }
      },
      error: function() {
        alert('通信エラーが発生しました。');
      }
    });
  });
  
  $(document).on('submit', '.task-form', function(e) {
    e.preventDefault();

    const form = $(this);
    const url = form.attr('action');
    const method = form.find('input[name="_method"]').val() || 'POST';

    $.ajax({
      url: url,
      method: method,
      data: form.serialize(),
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          alert(data.message);
          $('#taskDetailModal').modal('hide');
          location.reload();
        } else {
          alert('エラーが発生しました:' + data.message);
        }
      },
      error: function() {
        alert('通信エラーが発生しました。');
      }
    });
  });


    window.taskHandlerInitialized = true;
  }
});
