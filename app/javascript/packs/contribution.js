$(document).on('turbolinks:load', initializeContributionGrid);

function initializeContributionGrid() {
    renderDaysOfMonth();
    
    if ($('div').hasClass('mypage')) {
        fetchAndRenderContributions();
    }
}
function renderDaysOfMonth() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay();  // 0 (Sunday) to 6 (Saturday)
    
    const daysInPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    const daysToShowFromPreviousMonth = dayOfWeek === 0 ? 6 : dayOfWeek - 1;  // If Sunday, show 6 days from previous month, else show (dayOfWeek - 1) days

    for (let day = daysInPreviousMonth - daysToShowFromPreviousMonth + 1; day <= daysInPreviousMonth; day++) {
        const cell = createDayCell(day, 'previous-month');
        $('#contribution-grid').append(cell);
    }

    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const cell = createDayCell(day, 'current-month');
        $('#contribution-grid').append(cell);
    }
}

function createDayCell(day, monthClass) {
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
    const endpoint = `/users/${currentUserId}/contribution`;

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

// ツールチップ関数(ホバー時に情報を表示させる)
function showTooltip(event) {
    const element = event.currentTarget;
    const title = $(element).attr('title');
    if (!title) return;

    const offset = $(element).offset();
    var tooltipElement = $('<div class="tooltip"></div>')
        .text(title)
        .css({
            top: offset.top + $(element).outerHeight(),
            left: offset.left,
            opacity: 0,
            background: '#696969',
            color: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            padding: '5px'
        })
        .appendTo('body')
        .animate({ opacity: 1 }, 200);
}

function hideTooltip() {
    $('.tooltip').animate({ opacity: 0 }, 200, function() {  
        $(this).remove(); 
    });
}

$(document).on('mouseenter', '.day-cell', showTooltip)
           .on('mouseleave', '.day-cell', hideTooltip);
