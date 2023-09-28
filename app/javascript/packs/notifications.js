function fetchNotifications() {
  $.ajax({
    url: '/notifications',
    method: 'GET',
    success: function(data) {
      updateNotifications(data);
    }
  });
}

setInterval(fetchNotifications, 5 * 60 * 1000);

function updateNotifications(notifications) {
  const notificationsContainer = $('#notifications-container');
  notificationsContainer.empty();
  notifications.forEach(notification => {
    const notificationElement = $('<div></div>')
      .addClass('notification')
      .text(notification.message);
    notificationsContainer.append(notificationElement);
  });
}

$('#notificationDropdown').on('click', fetchNotifications);