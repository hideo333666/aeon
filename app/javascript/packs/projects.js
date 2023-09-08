$(document).on('submit', '#new_project_form', function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    method: 'POST',
    data: $(this).serialize(),
    dataType: 'script'
  });
});
