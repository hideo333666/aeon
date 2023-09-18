$(document).on('turbolinks:load', initializeContributionGrid);

function initializeContributionGrid() {
    renderDaysOfMonth();
    
    if ($('div').hasClass('mypage')) {
        fetchAndRenderContributions();
    }
}
function renderDaysOfMonth() {
    const daysInCurrentMonth = getDaysInCurrentMonth();

    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const cell = createDayCell(day);
        $('#contribution-grid').append(cell);
    }
}

function createDayCell(day) {
    return $('<div></div>')
        .addClass('day-cell')
        .attr('data-day', day)
        .attr('title', `${day}日: タスクはまだ完了していません`);
}

function getDaysInCurrentMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

function fetchAndRenderContributions() {
    const currentUserId = $('.user-info').data('user-id');
    const endpoint = `/public/users/${currentUserId}/contribution`;

    $.ajax({
        url: endpoint,
        method: 'GET',
        data: { user_id: currentUserId },
        success: updateContributionGrid,
        error: handleContributionFetchError
    });
}

function updateContributionGrid(data) {
    for (let date in data) {
        const taskCount = data[date];
        const dayNumber = new Date(date).getDate();
        const cell = $(`.day-cell[data-day="${dayNumber}"]`);

        cell.attr('title', `${date}日: ${taskCount}タスク完了`);
        cell.addClass(determineColorClass(taskCount));
    }
}

function determineColorClass(taskCount) {
    if (taskCount < 3) return 'color-level-1';
    if (taskCount < 6) return 'color-level-2';
    return 'color-level-3';
}

function handleContributionFetchError() {
    console.error('Error fetching completed tasks data');
}

// Tooltip functions (You can remove the console logs if they are not needed)
function showTooltip(element) {
    const title = $(element).attr('title');
    if (!title) return;

    const offset = $(element).offset();
    $('<div class="tooltip"></div>')
        .text(title)
        .css({
            top: offset.top + $(element).outerHeight(),
            left: offset.left,
            display: 'block'
        })
        .appendTo('body');
}

function hideTooltip() {
    $('.tooltip').remove();
}

$(document).on('mouseenter', '.day-cell', showTooltip)
           .on('mouseleave', '.day-cell', hideTooltip);
