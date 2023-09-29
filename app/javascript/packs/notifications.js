// app/javascript/packs/notifications.js
$(document).on('click', '.mark-as-read', function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('href'),
    method: 'PATCH',
    success: function() {
      // Update the notifications dropdown and badge count
    }
  });
});
