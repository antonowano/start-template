jQuery(function($) {

    $('.js-mask-tel-rus').inputmask('+7 (999) 999-99-99');

    // УВЕЛИЧЕНИЕ КАРТИНКИ
    $('.zoom-img').magnificPopup({
        type: 'image',
        removalDelay: 500,
        mainClass: 'mfp-fade'
    });

    // ГАЛЕРЕЯ
    $('.gallery a').magnificPopup({
        type: 'image',
        removalDelay: 500,
        mainClass: 'mfp-fade',
        gallery: {
            enabled: true,
            tCounter: ''
        }
    });

    // ОБРАТНЫЙ ЗВОНОК
    $('.callback-toggle').magnificPopup({
        type: 'inline',
        removalDelay: 500,
        mainClass: 'mfp-fade',
        midClick: true,
        items: {
            src: '.callback-modal-toggle'
        }
    });

    // ОТПРАВКА ФОРМЫ
    $('.form-submit-toggle').submit(function(e) {
        e.preventDefault();
        var $form = $(this);

        $.ajax({
            type: 'POST',
            url: 'index.php?option=com_request',
            data: $form.serialize(),

            beforeSend: function() {
                $.magnificPopup.open({
                    type: 'inline',
                    removalDelay: 500,
                    mainClass: 'mfp-fade',
                    midClick: true,
                    items: {
                        src: '<div class="callback-modal-message">' +
                            '<div class="callback-modal-message__text"><span class="callback-modal-message__process">Идет отправка сообщения...</span></div>' +
                            '</div>'
                    }
                });
            },

            success: function(response) {
                $('.callback-modal-message__text').html('<span class="callback-modal-message__success">Сообщение успешно отправлено!</span>');

                // close modal message
                setTimeout(function() {
                    $form.trigger("reset");
                    $.magnificPopup.close();
                }, 3000);
            },

            error: function(response) {
                $('.callback-modal-message__text').html('<span class="callback-modal-message__error">Ошибка отправки сообщения!</span>');

                // dump error
                console.error(response.message);
            },

            // after success or error
            complete: function() {}
        });
    });
});

/** Инициализация карты */
jQuery(function($) {
    var container = document.getElementById('footerMap');
    var addresses = document.querySelectorAll('.p-address');
    var points = [];
    var active = 0;
    var map;

    if (container == null)
        return;

    addresses.forEach(function(element, i) {
        var point = JSON.parse(element.dataset.point);

        if (element.classList.contains('active'))
            active = i;

        points.push(point);
        element.addEventListener('click', function() {
            map.setCenter(point);
            addresses.forEach(function(element) {
                element.classList.remove('active');
            });
            element.classList.add('active');
        });
    });

    setTimeout(function() {
        $.getScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', function(data, textStatus, jqxhr) {
            ymaps.ready(initMap);
        });
    }, 2000);

    function initMap() {
        container.innerHTML = '';
        map = new ymaps.Map(container, {
            center: points[active],
            zoom: 7
        });
        points.forEach(function(point) {
            var placemark = new ymaps.Placemark(point);
            map.geoObjects.add(placemark);
        });
    }
});