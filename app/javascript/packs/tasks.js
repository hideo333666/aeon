// daterangepickerの初期化関数
function initializeDateRangePicker() {
  if ($('input[name="date_range"]').data('daterangepicker') === undefined) {
    $('input[name="date_range"]').daterangepicker({
      locale: {
        format: 'YYYY-MM-DD'
      },
      opens: 'left',
    }, function(start, end, label) {
      $('input[name="task[start_date]"]').val(start.format('YYYY-MM-DD'));
      $('input[name="task[end_date]"]').val(end.format('YYYY-MM-DD'));
    });
  }
}

$(document).on('turbolinks:load', function() {
  // 日付範囲ピッカーの初期化
  initializeDateRangePicker();
  // モーダルの背景とモーダルのpenクラスの削除
  $('#taskModal').on('hidden.bs.modal', function() {
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  });
  // タスクハンドラが初期化されていない場合にのみ、以下の処理
  if (!window.taskHandlerInitialized) {
    let isSubmitting = false;
    // 新しいタスクまたは編集タスクのフォームが送信された時の処理を設定
    $(document).off('submit', '#new_task, .edit_task').on('submit', '#new_task, .edit_task', function(e) {
      if (isSubmitting) return false;

      e.preventDefault();

      const submitButton = $(this).find('input[type="submit"]');
      submitButton.prop('disabled', true);

      isSubmitting = true;

      const priorityValue = $(this).find('select[name="task[priority]"]').val();
      const formData = $(this).serialize() + `&task[priority]=${priorityValue}`;
      // AJAXリクエストを実行
      $.ajax({
        url: $(this).attr('action'),
        method: 'POST',
        data: formData,
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

            const startDate = new Date(data.task.start_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
            const endDate = new Date(data.task.end_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

            const newTaskHtml = `
              <div class="col-md-4 mb-4">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">
                      <a href="/tasks/${data.task.id}" class="task-link">${data.task.title}</a>
                    </h5>
                    <p class="card-text">${startDate} ~ ${endDate}</p>
                    <div class="form-check">
                      <input type="checkbox" name="task_completed_${data.task.id}" value="${data.task.id}" data-url="/tasks/${data.task.id}/toggle" class="task-completed-checkbox" id="task_completed_${data.task.id}">
                      <label class="form-check-label" for="task_completed_${data.task.id}">完了</label>
                    </div>
                  </div>
                </div>
              </div>
            `;

            $('#taskList').append(newTaskHtml);
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
        initializeDateRangePicker();
      });
    });

    $(document).on('change', '.task-completed-checkbox', function() {
      const taskId = $(this).val();
      const isChecked = $(this).prop('checked');
      const url = $(this).data('url');
      const taskElement = $(this).closest('.card');
      
      var currentUserId = $('.user-info').data('user-id');
      
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
            $.ajax({
              url:`/users/${currentUserId}/contribution`,
              method: 'POST',
              data: {
                user_id:currentUserId
              },
              success: function(response) {
                const completedTasks = response;
                
                $('.day-cell').removeClass('color-level-1 color-level-2 color-level-3');
                
                for (let day in completedTasks) {
                  const taskCount = completedTasks[day];
                  const cell = $(`.day-cell[data-day="${day}"]`);
                  if (taskCount < 3) {
                    cell.addClass('color-level-1');
                  } else if (taskCount < 6) {
                    cell.addClass('color-level-2');
                  } else {
                    cell.addClass('color-level-3');
                  }
                }
              }
            });
            
            taskElement.fadeOut(function() {
              taskElement.remove();
            });
          }
        }
      });
    });

    //タスクの詳細モーダルが表示された時の処理
    function handleAjaxResponse(data) {
      if (data.success) {
        alert(data.message);
        $('#taskDetailModal').modal('hide');
        location.reload();
      } else {
        alert('エラーが発生しました:' + data.message);
      }
    }

    function handleAjaxError() {
      alert('通信エラーが発生しました。');
    }

    //モーダル内の要素の取得と編集を行う関数
    function setupModalForEditing(modal) {
      const titleElement = modal.find('h1');
      const descriptionElement = modal.find('p').eq(0);
      const dueDateText = modal.find('p').eq(1).text().replace('期限:', '');
      const dueDateElement = modal.find('input[name="date_range"]');
      const initialStartDate = modal.find('input[name="task[start_date]"]').val();
      const initialEndDate = modal.find('input[name="task[end_date]"]').val();

      titleElement.html(createInputElement(titleElement.text()));
      descriptionElement.find('strong').after(createTextareaElement(descriptionElement.text().replace('説明：', '')));

      dueDateElement.daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
        startDate: initialStartDate,
        endDate: initialEndDate,
        opens: 'left'
      }, function(start, end) {
        dueDateElement.val(start.format('YYYY-MM-DD') + '-' + end.format('YYYY-MM-DD'));
        modal.find('input[name="task[start_date]"]').val(start.format('YYYY-MM-DD'));
        modal.find('input[name="task[end_date]"]').val(end.format('YYYY-MM-DD'));
      });

    }

    function createInputElement(value) {
      return `<input type="text" value="${value}">`;
    }

    function createTextareaElement(value) {
      return `<textarea>${value}</textarea>`;
    }

    $(document).on('shown.bs.modal', '#taskDetailModal', function() {
      initializeDateRangePicker();
      setupModalForEditing($(this));
      $(this).find('.modal-footer').prepend('<button id="saveTaskChanges" class="btn btn-primary">変更を保存</button>');
    });

    $(document).on('click', '#saveTaskChanges', function() {
      const modal = $('#taskDetailModal');
      const taskId = modal.data('task-id');
      const title = modal.find('h1 input').val();
      const description = modal.find('p textarea').val();
      const dateRange = modal.find('p input[type="text"]').data('daterangepicker');
      const startDate = dateRange.startDate.format('YYYY-MM-DD');
      const endDate = dateRange.endDate.format('YYYY-MM-DD');

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
        success: handleAjaxResponse,
        error: handleAjaxError
      });
    });

    $(document).on('submit', '.task-form', function(e) {
      e.preventDefault();
      const form = $(this);

      $.ajax({
        url: form.attr('action'),
        method: form.find('input[name="_method"]').val() || 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: handleAjaxResponse,
        error: handleAjaxError
      });
    });

    window.taskHandlerInitialized = true;
  }
});

