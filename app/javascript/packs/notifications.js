function fetchNotifications() {
  $.ajax({
    url: '/notifications',
    method: 'GET',
    success: function(data) {

      updateNotifications(data);
    }
  });
}

function fetchUnreadNotificationCount() {
  $.ajax({
    url: '/notifications/unread_count',
    method: 'GET',
    success: function(data) {
      updateNotificationIcon(data.count);
    }
  })
}

function updateNotificationIcon(count) {
  const notificationIcon = $('#notificationIcon');
  if (count > 0) {
    notificationIcon.addClass('has-notifications');
  } else {
    notificationIcon.removeClass('has-notifications');
  }
}

function markNotificationsAsRead() {
  $.ajax({
    url: '/notifications/mark_as_read',
    method: 'POST',
    success: function() {
      fetchUnreadNotificationCount();
    }
  });
}

$('#notificationDropdown').on('click', function() {
  fetchNotifications();
  markNotificationsAsRead();
});

setInterval(fetchNotifications, 10 * 1000);

function updateNotifications(notifications) {
  const notificationsContainer = $('#notifications-container');
  notificationsContainer.empty();
  notifications.forEach(notification => {
    const notificationElement = $('<div></div>')
      .addClass('notification')
      .text(notification.message);
    console.log(notificationElement);
    notificationsContainer.append(notificationElement);
  });
}

$('#notificationDropdown').on('click', fetchNotifications);