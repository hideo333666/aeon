$(document).on('turbolinks:load', function() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const cell = $('<div></div>').addClass('day-cell').attr('data-day', i);
        $('#contribution-grid').append(cell);
    }

    const completedTasks = {
        1: 5,
        2: 2,
        3: 7,
        // ...
    };

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
});
