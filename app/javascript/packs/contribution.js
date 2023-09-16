$(document).on('turbolinks:load', function() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const cell = $('<div></div>').addClass('day-cell').attr('data-day', i);
        $('#contribution-grid').append(cell);
    }

    var currentUserId = $('.user-info').data('user-id');
    $.ajax({
        url: `/public/users/${currentUserId}/contribution`,
        method: 'GET',
        data: {
            user_id: currentUserId
        },
        success: function(data) {
            console.log(data);
            const completedTasks = data;

            for(let day in completedTasks) {
                const taskCount = completedTasks[day];
                console.log(day, taskCount);
                console.log(`Day: ${day}, Task Count: ${taskCount}`);
                
                const date = new Date(day);
                const dayNumber = date.getDate();
                
                const cell = $(`.day-cell[data-day="${dayNumber}"]`);
                console.log("Selected cell for day:", day, cell.length ? "Exists" : "Does not exist");

                cell.attr('title', `${day}日: ${taskCount}タスク完了`);

                if (taskCount < 3) {
                    cell.addClass('color-level-1');
                    console.log('Adding class to', day); 
                } else if (taskCount < 6) {
                    cell.addClass('color-level-2');
                    console.log('Adding class to', day); 
                } else {
                    cell.addClass('color-level-3');
                    console.log('Adding class to', day); 
                }
            }
        },
        error: function() {
            console.error('Error fetching completed tasks data');
        }
    });
});
