$(document).on('turbolinks:load', function() {
  console.log("Turbolinks loaded");
  $(document).on('submit', '#new_task, .edit_task', function(e) {
    e.preventDefault();
    $.ajax({
      url: $(this).attr('action'),
      method: $(this).attr('method'),
      data: $(this).serialize(),
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          // モーダルを閉じる
          $('#taskModal').modal('hide');
          
          // タスクリストに新しいタスクを追加
          const newTask = `<li><a href="/tasks/${data.task.id}">${data.task.title}</a></li>`;
          $('h2:contains("タスク一覧")').next('ul').append(newTask);

          alert(data.message);
        } else {
          alert(data.errors.join("\n"));
        }
      },
      error: function(err) {
        alert("エラーが発生しました");
      }
    });
  });
});
