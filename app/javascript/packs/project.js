let dragged;

$(document).on({
    'dragstart': function(event) {
        dragged = event.target;
        $(event.target).css('opacity', 0.5);
    },
    'dragend': function(event) {
        $(event.target).css('opacity', '');
    },
    'dragover dragenter dragleave drop': function(event) {
        event.preventDefault();
        
        const target = $(event.target);

        if (target.hasClass('project-card')) {
            if (event.type === 'dragenter') {
                target.css('background', 'purple');
            } else if (event.type === 'dragleave' || event.type === 'drop') {
                target.css('background', '');
            }

            if (event.type === 'drop') {
                dragged.remove();
                target.append(dragged);
            }
        }
    }
});

function createInputElement(value) {
    return `<input type="text" value="${value}">`;
}

function createTextareaElement(value) {
    return `<textarea>${value}</textarea>`;
}

$(document).on('shown.bs.modal', '[id^="editProjectModal"]', function() {
    const modal = $(this);

    const nameElement = modal.find('.project-name');
    const descriptionElement = modal.find('.project-description');

    nameElement.html(createInputElement(nameElement.text()));
    descriptionElement.html(createTextareaElement(descriptionElement.text()));

    modal.find('.modal-footer').prepend('<button id="saveProjectChanges" class="btn btn-primary">変更を保存</button>');
}).on('click', '#saveProjectChanges', function() {
    const modal = $(this).closest('.modal');
    const projectId = modal.data('project-id');
    const name = modal.find('.project-name input').val();
    const description = modal.find('.project-description textarea').val();

    $.ajax({
        url: `/projects/${projectId}`,
        method: 'PATCH',
        data: {
            project: {
                name: name,
                description: description
            }
        },
        dataType: 'json',
        success: function() {
            modal.modal('hide');
            location.reload();
        },
        error: function() {
            alert('編集に失敗しました。');
        }
    });
});
