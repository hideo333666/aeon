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
        dataType: 'script',
        success: function() {
            modal.modal('hide');
            location.reload();
        },
        error: function() {
            alert('編集に失敗しました。');
        }
    });
});

$(document).ready(function() {
    $('#submit-button').on('click', function(e) {
        e.preventDefault();  // フォームのデフォルトの送信を防ぎます

        const projectName = $('#project-name').val();
        const projectDescription = $('#project-description').val();

        // Ajaxリクエストを送信してプロジェクトを作成します
        $.ajax({
            url: '/projects',
            method: 'POST',
            data: {
                project: {
                    name: projectName,
                    description: projectDescription
                }
            },
            dataType: 'json',
            success: function(response) {
                if (response.status === "success") {
                    location.reload();  // ページをリロードして成功メッセージを表示します
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                console.log("HTTP Status: " + jqXHR.status);  // HTTPステータスコードをコンソールにログします
                console.log("Error Thrown: " + errorThrown); 
                
                if (jqXHR.status === 422) {
                    const errors = jqXHR.responseJSON.errors;
                    // エラーメッセージを表示します
                    if (errors.name) {
                        $('#name-error').text(errors.name.join(", "));
                    }
                    if (errors.description) {
                        $('#description-error').text(errors.description.join(", "));
                    }
                    // 一般的なエラーメッセージを表示します
                    $('#ajax-error').removeClass('d-none').text('プロジェクトの作成に失敗しました。エラーを修正して再試行してください。');
                } else {
                    console.error('Ajax request failed:', textStatus, errorThrown);
                    // 一般的なエラーメッセージを表示します
                    $('#ajax-error').removeClass('d-none').text('プロジェクトの作成に失敗しました。後でもう一度お試しください。');
                }
            }
        });
    });
});
