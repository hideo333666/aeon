$(document).on('turbolinks:load', function() {
  if (!window.taskHandlerInitialized) {
    let isSubmitting = false;  // 送信中フラグを追加

    $(document).off('submit', '#new_task, .edit_task').on('submit', '#new_task, .edit_task', function(e) {
      if (isSubmitting) return false;  // 送信中なら送信を阻止

      console.log("Submitting task form via Ajax");
      e.preventDefault();

      // ボタンを無効化
      const submitButton = $(this).find('input[type="submit"]');
      submitButton.prop('disabled', true);

      isSubmitting = true;  // 送信開始

      $.ajax({
        url: $(this).attr('action'),
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        complete: function() {
          isSubmitting = false;  // 送信完了
        },
        success: function(data) {
          if (data.success) {
            $('#taskModal').modal('hide');
            alert(data.message);
            const newTaskLink = $('<a></a>').attr('href', '/tasks/' + data.task.id).text(data.task.title);
            const newTask = $('<li></li>').append(newTaskLink);
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

    window.taskHandlerInitialized = true;
  }
});
