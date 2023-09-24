function displayErrors(errors, formElement) {
    const nameErrorElementId = $(formElement).data('type') === 'edit' ? '#edit-name-error' : '#name-error';
    const descriptionErrorElementId = $(formElement).data('type') === 'edit' ? '#edit-description-error' : '#description-error';
    console.log(nameErrorElementId, descriptionErrorElementId);
    
    if (errors.name) {
        const nameErrorsArray = Array.isArray(errors.name) ? errors.name : errors.name.split(", ");
        $(nameErrorElementId).text(nameErrorsArray.join(", ")).show();
        console.log($(nameErrorElementId).text());
    } else {
        $(nameErrorElementId).hide();
    }
    if (errors.description) {
        const descriptionErrorsArray = Array.isArray(errors.description) ? errors.description : errors.description.split(", ");
        $(descriptionErrorElementId).text(descriptionErrorsArray.join(", ")).show();
    } else {
        $(descriptionErrorElementId).hide();
    }
}

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

function createInputElement(value, placeholder) {
    return `<input type="text" value="${value}" placeholder="${placeholder}">`;
}

function createTextareaElement(value, placeholder) {
    return `<textarea placeholder="${placeholder}">${value}</textarea>`;
}

$(document).on('shown.bs.modal', '[id^="editProjectModal"]', function() {
    const modal = $(this);

    const nameElement = modal.find('.project-name input');
    const descriptionElement = modal.find('.project-description textarea');


    modal.find('.modal-footer').prepend('<button id="saveProjectChanges" class="btn btn-primary">変更を保存</button>');
}).on('click', '#saveProjectChanges', function() {
    console.log('Button clicked');
   
    const modal = $(this).closest('.modal');
    const projectId = modal.data('project-id');
    const name = modal.find('.project-name input').val();
    const description = modal.find('.project-description textarea').val();

    $.ajax({
        url: `/projects/${projectId}`,
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
        },
        contentType: 'application/json',
        data: JSON.stringify({
            project: {
                name: name,
                description: description
            }
        }),
        dataType: 'json',
        success: function(response) {
            console.log('Ajax request successful', response);
            modal.modal('hide');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Ajax request failed', jqXHR);
            console.log('Error status:', textStatus);  
            console.log('Error thrown:', errorThrown); 
            console.log('Response Text:', jqXHR.responseText);
            console.log(jqXHR.responseJSON)
            
            if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
                const errors = jqXHR.responseJSON.errors;
                displayErrors(errors, modal);
                console.log(errors);
                return false;
            } else {
                $('#ajax-error').removeClass('d-none').text('プロジェクトの作成に失敗しました。後でもう一度お試しください。');
            }
        }
    });
});



$(document).ready(function() {
    $('#submit-button').off('click').on('click', function(e) {
        e.preventDefault();  // フォームのデフォルトの送信を防ぎます

        const projectName = $('#project-name').val();
        const projectDescription = $('#project-description').val();

        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        // Ajaxリクエストを送信してプロジェクトを作成します
        $.ajax({
            url: '/projects',
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken
            },
            data: {
                project: {
                    name: projectName,
                    description: projectDescription
                }
            },
            dataType: 'json',
            success: function(response) {
                if (response.status === "success") {
                    location.reload();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
                    const errors = jqXHR.responseJSON.errors;
                    displayErrors(errors, '#name-error', '#description-error');  
                } else {
                    $('#ajax-error').removeClass('d-none').text('プロジェクトの作成に失敗しました。後でもう一度お試しください。');
                }
            }
        });
    });
});
