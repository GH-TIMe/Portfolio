(function() {
    const $header = $(".header");
    const headerStart = 0;

    // header scroll
    
    window.addEventListener("scroll", () => {
        const newOffset = window.scrollY;
        if (newOffset > headerStart) {
            $header.addClass("active");
        } else {
            $header.removeClass("active");
        }
    });

    // scroll to anchor

    $(".navigation__link, .mobile-nav__link").on("click", function(event){
        event.preventDefault();
        var $margin = $('.header').outerHeight();
        var $anchor = $(this);
        if ($anchor)
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - $margin
        }, 800);
    });


    const $mobileNav = $(".mobile-nav");
    $(".close, .mobile-nav__link").on("click", () => $mobileNav.removeClass("active"));
    $(".header__burger").on("click", () => $mobileNav.addClass("active"));

    // Modals

    function addNoScroll() {
        if ($(window).width() > 1000) {
            $("body").addClass("no-scroll").css({paddingRight: "17px"});
            $header.css({paddingRight: "17px"});
        } else {
            $("body").addClass("no-scroll")
        }
    }

    function closeModal($currentModal, $modal) {
        $currentModal.removeClass("is-animated").fadeOut(animationTime);
        $modal.fadeOut(animationTime, () => {
            $("body").css({paddingRight: "0"}).removeClass("no-scroll");
            $header.css({paddingRight: "0"});
        });
    }

    const $modalBtn = $(".works__item, .button_contact");
    const $modal = $(".modal");
    let $currentModal;
    const animationTime = 400;

    $modalBtn.on("click", function(event) {
        event.preventDefault();
        $modal.fadeIn();

        addNoScroll();

        $currentModal = $(`.modal__work[data-name="${$(this).data("name")}"]`);
        $currentModal.fadeIn(0).addClass("is-animated");

        $currentModal.on("click", event => event.stopPropagation());
    });

    $modal.on("click", () => {
        closeModal($currentModal, $modal);
    });

    $(".modal__btn .button_download-cv").on("click", (event) => {
        event.preventDefault();
        closeModal($currentModal, $modal);
    });

    $(document).keydown(function(event) { 
        if (event.keyCode == 27) { 
            closeModal($currentModal, $modal);
        }
    });

    $(".modal__work").on("click", (event) => event.stopPropagation());

    // Viewer 
    
    const $viewer = $(".viewer");
    const $gallery = $(".education__certificate");
    let $currentImg;

    $gallery.on("click", function (event) {
        event.preventDefault();
        $viewer.fadeIn();

        addNoScroll();

        $currentImg = $(`.viewer__content[data-name="${$(this).data("name")}"]`);
        $currentImg.fadeIn();
    });

    $(".viewer__close").on("click", (event) => {
        event.stopPropagation();
        closeModal($currentImg, $viewer);
    });

    $viewer.on("click", () => {
        console.log("сработало!")
        closeModal($currentImg, $viewer);
    });

    $(document).keydown(function(event) { 
        if (event.keyCode == 27) { 
            closeModal($currentImg, $viewer);
        }
    });

    $(".viewer__content").on("click", (event) => event.stopPropagation());

    // Category filter

    jQuery.fn.visible = function() {
        return this.css('opacity', '1');
    };
    
    jQuery.fn.invisible = function() {
        return this.css('opacity', '0');
    };

    const $filters = $(".portfolio__category");
    const $boxes = $(".works__item");
    let $filterValue = "*";

    $filters.on("click", function() {
        let $this = $(this);
        if ($filterValue === $this.data("filter")) {
            return;
        }
        $filters.removeClass("active");
        $this.addClass("active");
        $filterValue = $this.data("filter");

        $boxes.removeClass("is-animated").show().invisible()
        if ($filterValue === "*") {
            $boxes.each(function(i) {
                setTimeout(() => {
                    $(this).addClass("is-animated").visible();
                }, (i++)*200);
            });
        } else {
            $boxes.filter(`:not([data-category="${$filterValue}"])`).hide();
            $boxes.filter(`[data-category="${$filterValue}"]`).each(function(i) {
                setTimeout(() => {
                    $(this).addClass("is-animated").visible();
                }, (i++)*300);
            });
        }
    });

    // Form validation 

    const $contactForm = $('.form[data-form="contact"]');
    const $modalForm = $('.form[data-form="modal"]');
    const $contactElements = $('.form__input-field[data-form="contact"], .form__textarea[data-form="contact"]');
    const $modalElements = $('.form__input-field[data-form="modal"], .form__textarea[data-form="modal"]');
    validateForm($contactElements, $contactForm);
    validateForm($modalElements, $modalForm);

    function validateForm($elements, $form) {
        $elements.each(function() {
            $(this).on("input", function() {
                let $this = $(this);
                if ($this.val().trim() === "") {
                    $this.addClass("invalid");
                } else {
                    $this.removeClass("invalid");
                }
            });
        });
    
        $form.submit(function(event) {
            event.preventDefault();
            $elements.each(function() {
                let $this = $(this);
                if ($this.val().trim() === "") {
                    event.preventDefault();
                    $this.addClass("invalid");
                }
            });
        });
    }
}());