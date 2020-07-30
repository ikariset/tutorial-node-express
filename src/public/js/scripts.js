var $modal = $('.modal');
var $title = $('.note-title')
var $form = $('.modal-footer > form')

// Show loader & then get content when modal is shown
$modal.on('show.bs.modal', function (e) {
    //Con esto me traigo los valores en el atributo data-
    var noteId = $(e.relatedTarget).data('transfer');
    // --------------------------------------------------
    $title.html($(e.relatedTarget).data('note'))
    $form.attr('action', $form.attr('action') + noteId)
});