import Sortable from 'sortablejs';

document.addEventListener("turbolinks:load", () => {
    const el = document.getElementById('project-cards');
    if (el) {
        const sortable = new Sortable(el, {
            animation: 150,
            handle: ".project-card",
            onUpdate: function (evt) {
                // アイテムの並び順が変更されたときの処理
                console.log(evt);
            },
        });
    }
});