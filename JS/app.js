$(function() {

    /* Modal
    ===================*/

    const modalCall = $("[data-modal]");
    const modalClose = $("[data-close]");

    modalCall.on("click", function(event) {
        event.preventDefault();

        let $this = $(this);
        let modalId = $this.data('modal');

        $(modalId).addClass('show');
        $("body").addClass('no-scroll');

        setTimeout(function() {
            $(modalId).find(".modal__dialog").css({
            transform: "rotateX(0)"
            });
        }, 200);
    });

    modalClose.on("click", function(event) {
        event.preventDefault();

        let $this = $(this);
        let modalParent = $this.parents('.modal');

        modalParent.find(".modal__dialog").css({
            transform: "rotateX(90deg)"
        });

        setTimeout(function() {
            modalParent.removeClass('show');
            $("body").removeClass('no-scroll');
        }, 200);

    });

    $(".modal").on("click", function(event) {
        let $this = $(this);

        $this.find(".modal__dialog").css({
            transform: "rotateX(90deg)"
        });

         setTimeout(function() {
            $this.removeClass("show");
            $("body").removeClass('no-scroll');
        }, 200);
    });

    $(".modal__dialog").on('click', event => event.stopPropagation());

});
