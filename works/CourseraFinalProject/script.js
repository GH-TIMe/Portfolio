(function() {
    'use strict';

    let cards = document.querySelector(".game__field"),
        cardInfo = {},
        time = 1, // время в минутах
        cardImgs = shuffle([0x1F431, 0x1F431, 0x1F436, 0x1F436,
                            0x1F992, 0x1F992, 0x1F42D, 0x1F42D,
                            0x1F430, 0x1F430, 0x1F438, 0x1F438]),
        cardBackSide = Array.from(cards.getElementsByClassName("card--back")),
        btnPlayAgain = document.getElementsByClassName("modal__btn")[0];
    // заполнение карточек emoji
    cardBackSide.forEach( (item, index) =>
                         item.textContent = String.fromCodePoint(cardImgs[index]));
    setTime(Math.floor(time), Math.floor(60 * (time % 1)));

    cards.addEventListener("click", event => {
        let item = event.target;
        if (item.tagName === "INPUT") {
            item.setAttribute("disabled", "");
            if (Object.keys(cardInfo).length === 0) {
                timer(time); // запустить таймер
            }
            switch (Object.keys(cardInfo).length) {
                case 0: {
                    getCardInfo(item, cardInfo);
                    break;
                }
                case 1: {
                    getCardInfo(item, cardInfo);
                    compareCards(cardInfo);
                    break;
                }
                case 2: {
                    hiddenCards(cardInfo);
                    cardInfo = {};
                    getCardInfo(item, cardInfo);
                    break;
                }
            }
        }
    });

    btnPlayAgain.addEventListener("click", function() {
        cardInfo = {};
        Array.from(document.querySelectorAll("input[type='checkbox']")).forEach( input => {
            input.removeAttribute("disabled");
            input.checked = false;
        });
        Array.from(document.getElementsByClassName("card--back")).forEach( card => {
            card.classList.remove("cards__matched");
            card.classList.remove("cards__not_matched");
        });
        cardImgs = shuffle(cardImgs);
        // заполнение карточек emoji
        setTimeout( () => cardBackSide.forEach( (item, index) =>
                         item.textContent = String.fromCodePoint(cardImgs[index])), 300 );
        setTime(Math.floor(time), Math.floor(60 * (time % 1)));
        hiddenModalWindow();
    });

    /** @description Возвращает arr перемешанный в случайном порядке.
     *
     * @param {Array} arr, перемешиваемый массив.
     * @return {Array} arr, перемешанный массив
     */
    function shuffle(arr) {
        let j, temp;
        for (let i = arr.length - 1; i > 0; i--) {
            j = Math.floor( Math.random()*(i + 1) );
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    /** @description Заполняет информацию о каждой карточке в отдельный массив
     *
     * @param {Object} card,
     * карта информацию о которой надо добавить в cardInfo.
     * @param {Object} cardInfo, объект содержащий открытые карты.
     */
    function getCardInfo(card, cardInfo) {
        if (card.checked) {
            let cardBack = card
                              .nextElementSibling
                              .getElementsByClassName("card--back")[0];
            let content = cardBack.textContent;
            cardInfo[card.getAttribute("id")] = {
                    input: card,
                    cardBack: cardBack,
                    content: content
            };
        }
    }

    /** @description Сравнивает две карты (совпали / не совпали)
     *
     * @param {Object} cardInfo, объект содержащий открытые карты.
     */
    function compareCards(cardInfo) {
        let cards = Object.keys(cardInfo);
        if (cardInfo[cards[0]].content === cardInfo[cards[1]].content) {
            cards.forEach( card => cardInfo[card].cardBack.classList.add("cards__matched"));
        } else {
            cards.forEach( card => cardInfo[card].cardBack.classList.add("cards__not_matched"));
        }
    }

    /** @description Прячет не совпавшие карты и оставляет совпавшие
     *
     * @param {Object} cardInfo, объект содержащий открытые карты.
     */
    function hiddenCards(cardInfo) {
        let cards = Object.keys(cardInfo);
        if (cardInfo[cards[0]].cardBack.classList.contains("cards__matched")) {
            return;
        }
        for (let card of cards) {
            cardInfo[card].input.checked = false;
            cardInfo[card].input.removeAttribute("disabled");
            cardInfo[card].cardBack.classList.remove("cards__not_matched");
        }
    }

    /** @description Запускает таймер
     *
     * @param {number} time, время работы таймера в минутах.
     */
    function timer(time) {
        let sec = 1000,
            min = sec*60,
            hour = min*60,
            now = 0,
            end = now + time*min;

        let timerRun = setTimeout(function runTimer() {
            now += sec;
            let distance = end - now,
                seconds = Math.floor( (distance % min) / sec ),
                minutes = Math.floor( (distance % hour) / min );
            if (document.getElementsByClassName("cards__matched").length === 12) {
                showModalWindow("Win");
                clearTimeout(timerRun);
                return;
            }
            if (distance < 0) {
                showModalWindow("Lose");
                clearTimeout(timerRun);
                return;
            }
            setTime(minutes, seconds);
            setTimeout(runTimer, sec);
        }, sec);
    }

    function setTime(min, sec) {
        document.getElementById("minutes").textContent = corrTime(min);
        document.getElementById("seconds").textContent = corrTime(sec);
    }

    function corrTime(time) {
        return time < 10 ? "0" + time : time;
    }

    /** @description Показывает модальное окно выгрыша или проигрыша
     *
     * @param {string} text, время работы таймера в минутах.
     */
    function showModalWindow(text) {
        let modalTitle = document.getElementsByClassName("modal__title")[0];
        modalTitle.textContent = "";
        for (let letter of text) {
            let span = document.createElement("span");
            span.innerHTML = letter;
            span.classList.add("letter");
            modalTitle.append(span);
        }
        document.body.style.overflow = "hidden";
        document.getElementsByClassName("modal")[0].removeAttribute("hidden");
        document.getElementsByClassName("modal__content")[0].removeAttribute("hidden");
    }

    /**
     * @description Скрывает модальное окно
     */
    function hiddenModalWindow() {
        let modalTitle = Array.from(document.getElementsByClassName("letter"));
        for (let span of modalTitle) {
            span.remove();
        }
        document.body.style.overflow = "";
        document.getElementsByClassName("modal")[0].setAttribute("hidden", "");
        document.getElementsByClassName("modal__content")[0].setAttribute("hidden", "");
    }
}());
