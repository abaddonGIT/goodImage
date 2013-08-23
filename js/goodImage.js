/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Abaddon <abaddongit@gmail.com>
 * @version 1.0.1
 * ***************************************************/
/*global window, $, jQuery, document */
(function ($) {
    "use strict";
    var frResize = 0, inizialize = 0;
    function simpleImage(el, def) {
        this.el = el;
        this.config = def;
        this.images = def.source || $(el).find('img' + '.' + this.config.imgClass); //тут оказывается либо объект с описанием картинок либо объект jQuery с этими картинками
        this.countImg = this.images.length || Object.keys(this.images).length;
        this.defWidth = this.config.maxWidth;
        //опредяем поддержку анимации на css
        if ("transition" in document.createElement('div').style) {
            this.trans = true;

        } else {
            this.trans = false;
        }

        //расчет положения картинок
        this.building();
        //отслеживание изменения рамера контейнера
        this.adEvent();
    }
    /*
    *Подготавливает перед пуском (удалет прослушку событий и рвет анимации)
    */
    simpleImage.prototype.preparation = function () {
        var m = {};
        this.el.style.position = 'relative';
        this.el.style.overflow = 'hidden';
        this.el.style.width = this.config.maxWidth + this.config.padding * 2 + 'px';
        //сносим события ресайзов
        //window.removeEventListener('resize',1);

        var i = 0, ims;
        if (this.images.selector === undefined) {
            ims = $(this.el).find('img' + '.' + this.config.imgClass);
            for (i; i < this.countImg; i++) {
                $(ims[i]).stop(true);
                $(ims[i]).parent().stop(true);
            }
        } else {
            //если у нас в images объекты jquery то переписываем его
            for (i; i < this.countImg; i++) {

                m[i] = {
                    'height': $(this.images[i]).height(),
                    'width': $(this.images[i]).width(),
                    'link': $(this.images[i]).attr('src')
                };

                $(this.images[i]).stop(true);
                $(this.images[i]).parent().stop(true);
            }
            this.inputType = 1;
            this.jQueryImages = this.images;
            this.images = m;
        }
    }
    /*
    * Получаем объект дом javascript из переданного html кода
    * @param {String} html-код
    * @return {Object}
    */
    simpleImage.prototype.setElement = function (html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var el = div.childNodes[0];
        div.removeChild(el);
        return el;
    }
    /*
    *Добавляет прослушку событий изменения размера контейнера
    */
    simpleImage.prototype.adEvent = function () {
        var widthBody,
            el = this.el,
            def = this.config,
            fun = this,
            timerID = 0, time = 0, TIME_IDLE = 500, step = 0,
            resizeLurking = function () {
                if (+new Date - time >= TIME_IDLE) {
                    widthBody = $('html').width();

                    if (widthBody < fun.config.minWidth) {
                        fun.config.maxWidth = fun.config.minWidth;
                    } else {
                        fun.config.maxWidth = widthBody;
                    }
                    fun.building(true);

                    if (timerID) {//удаляем таймер
                        window.clearInterval(timerID);
                        timerID = null;
                    }
                }
            };

        //Выбираем к чему прилепить событие
        switch (def.resize) {
            case 1:
                //добавляем в блок фрайм и цепляем событие ресайза к нему
                var frID = 'fr' + Math.floor(Math.random() * 99999),
                        frame = this.setElement('<iframe id="' + frID + '" name="' + frID + '" style="width: 100%; height: 100%; position:absolute;z-index:-1;top:0;left:0;border: none;"></iframe>');
                el.appendChild(frame);

                frames[frID].onresize = function () {
                    //console.log('asd');
                    if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
                        step++;
                    }

                    if (step !== 0) {
                        widthBody = $(el).width();

                        if (widthBody < fun.config.minWidth) {
                            fun.config.maxWidth = fun.config.minWidth;
                        } else {
                            fun.config.maxWidth = widthBody;
                        }

                        if (frResize === 0) {
                            frResize = 1;
                            fun.building(true);
                        }
                    }
                    step++;

                }
                break;
            case 2:
                window.addEventListener('resize', function () {
                    if (!timerID) {
                        timerID = window.setInterval(resizeLurking, 55);
                    }
                    time = +new Date;
                }, 1);
                break;
            default:
        }

        //Событие для перезагрузки картинок
        $(el).bind('relode', function (event, newData) {
            var wn = JSON.parse(newData);
            fun.config.maxWidth = el.offsetHeight;
            fun.images = wn;
            fun.countImg = wn.count;
            fun.jqueryImages = $(el).find('img' + '.' + fun.config.imgClass);
            fun.building(true);
        });
    }
    /*
    * Рассчет размеров для картинок
    */
    simpleImage.prototype.calculation = function () {
        var images = this.images, //Содержит инфу о картинках
            countImg = this.countImg, //Общее кол-во картинок
            def = this.config, //конфиг
            th = this,
            iter,
            totalHeight,
            imagesLn,
            blocks,
            leng,
            image = 0,
            string = [],
            p = 0,
            wi = [],
            count,
            width,
            h,
            countInString,
            allCount,
            maxWidth,
            lwidth,
            w, wt, wr, i, j, b, step, timer;

        //сброс анимации элементов при инициализации

        this.preparation();
        //console.log(this.images);

        while (image < countImg) {//цикл по всем картинкам
            count = image;
            width = 0;
            h = 0;
            countInString = 0;
            allCount = 0;
            maxWidth = def.maxWidth;

            while (width < maxWidth) {
                lwidth = width;

                if (images[count] !== undefined) {
                    width = width + Math.round((images[count]['width'] / images[count]['height']) * def.minHeight);
                    count++;
                    maxWidth = maxWidth - def.padding * 2;
                } else {
                    if ((maxWidth - width) <= def.minHeight) {
                        h = 0;
                    } else {
                        h = def.minHeight;
                    }
                    break;
                }
            }

            if ((width - maxWidth) < ((maxWidth + def.padding * 2) - lwidth)) {//смотрим сколько картинок должно быть в страке
                countInString = count - image;
                allCount = count;
                w = width;
            } else {
                countInString = count - image - 1;
                allCount = count - 1;
                w = lwidth;
            }

            //Высчитываем размеры миниатюр
            if (h === 0) {

                h = Math.floor((def.minHeight / w) * (def.maxWidth - (2 * def.padding * (countInString - 1))));
                i = allCount - 1;
                wt = 0;

                for (i; i > (allCount - countInString - 1); i--) {
                    wi[i] = [];
                    wi[i]['w'] = Math.floor(images[i]['width'] * h / images[i]['height']);
                    if (wi[i]['w'] > def.maxWidth) {
                        wi[i]['w'] = def.maxWidth;
                    }
                    wi[i]['h'] = h;

                    wt = wt + wi[i]['w'];
                }

                wr = 0;
                //Подоняем картинки вровень
                wr = def.maxWidth - (wt + ((countInString - 1) * def.padding * 2));
                if (wr !== 0) {
                    step = 0;
                    step = Math.ceil(wr / countInString);
                    j = allCount - 1;

                    for (i = wr; i >= step; i = i - step) {
                        wi[j]['w'] = wi[j]['w'] + step;
                        j--;
                    }
                    if (i > 0) {
                        wi[j]['w'] = wi[j]['w'] + i;
                    }
                }
                wt = 0;
            } else {
                i = allCount - 1;
                for (i; i > (allCount - countInString - 1); i--) {
                    wi[i] = [];
                    wi[i]['w'] = Math.floor(images[i]['width'] * h / images[i]['height']);
                    wi[i]['h'] = h;
                }
            }
            string[p] = [];
            string[p]['count'] = countInString;
            string[p]['h'] = h;
            image = image + countInString;
            p++;
        }
        this.string = string; //содержит параметры строк (их высоту и кол-во картинок в них)
        this.wi = wi;
    }
    /*
    * Выстраивает изображения и осуществляет анимацию при перемещении
    * @param {Boolean} ключ указывает надо ли включать анимацию
    */
    simpleImage.prototype.building = function (animation) {
        var def = this.config, i = 0;
        //расчет размеров картинки
        this.calculation();
        //var wi = this.wi;

        //строим картинки
        this.el.style.fontSize = 0;
        this.el.style.margin = '0 -5px';

        if (!animation) {

            if (this.inputType) {
                i = 0;

                for (i; i < this.countImg; i++) {
                    //стили картинок
                    $(this.jQueryImages[i]).css({'width': this.wi[i]['w'] + 'px', 'height': this.wi[i]['h'] + 'px'});

                    //стили оберток
                    if (this.jQueryImages[i].parentNode != null) {
                        $(this.jQueryImages[i]).parent().css({
                            'width': this.wi[i]['w'] + 'px',
                            'height': this.wi[i]['h'] + 'px',
                            'margin': def.padding + 'px',
                            'display': 'inline-block'
                        });
                        this.jQueryImages[i].parentNode.style.left = this.jQueryImages[i].parentNode.offsetLeft - def.padding + 'px';
                        this.jQueryImages[i].parentNode.style.top = this.jQueryImages[i].parentNode.offsetTop - def.padding + 'px';
                    } else {
                        $(this.jQueryImages[i]).css({
                            'margin': def.padding + 'px'
                        });
                        this.jQueryImages[i].style.left = this.jQueryImages[i].offsetLeft + 'px';
                        this.jQueryImages[i].style.top = this.jQueryImages[i].offsetTop + 'px';
                    }

                    if (i === this.countImg - 1) {
                        setTimeout(function () {
                            frResize = 0;
                        }, 100);
                    }
                }
                this.el.style.height = $(this.el).height() + 'px';
                //делаем все блоки с абсолютным позиционированием
                $(this.jQueryImages).parent().css({'position': 'absolute', 'transition': 'all ' + def.animationSpeed/1000 + 's ease-in-out'});
                $(this.jQueryImages).css({'transition': 'all ' + def.animationSpeed/1000 + 's ease-in-out'});
            } else {
                //Строим изображения по входному объекту
                i = 0;

                for (i; i < this.countImg; i++) {
                    var tpl = '<' + def.wrap + ' style="transition: all ' + def.animationSpeed/1000 + 's ease-in-out; width: ' + this.wi[i]['w'] + 'px; height: ' + this.wi[i]['h'] + 'px; margin: ' + def.padding + 'px; display: inline-block;">' +
                                '<img class="' + this.config.imgClass + '" src="' + this.images[i]['link'] + '" alt="" style="transition: all ' + def.animationSpeed/1000 + 's ease-in-out; width: ' + this.wi[i]['w'] + 'px; height: ' + this.wi[i]['h'] + 'px;"/>' +
                              '</' + def.wrap + '>'
                    $(this.el).append(tpl);
                }
                //высчитываем смещения
                this.jQueryImages = $(this.el).find('img' + '.' + this.config.imgClass);
                i = 0;
                for (i; i < this.countImg; i++) {
                    this.jQueryImages[i].parentNode.style.top = this.jQueryImages[i].parentNode.offsetTop - def.padding + 'px';
                    this.jQueryImages[i].parentNode.style.left = this.jQueryImages[i].parentNode.offsetLeft - def.padding + 'px';

                }
                this.el.style.height = $(this.el).height() + 'px';
                $(this.jQueryImages).parent().css('position', 'absolute');
            }

        } else {

            var countST = this.string.length,
                i = 0,
                j,
                iter = 0,
                totalHeight = def.padding; //общая высота

            //Сохраняем насоящие положение элементов
            for (i; i < countST; i++) {
                for (j = iter; j < iter + this.string[i]['count']; j++) {
                    if (iter === j) {
                        this.wi[iter]['left'] = 0;
                    } else {
                        this.wi[j]['left'] = this.wi[j - 1]['left'] + this.wi[j - 1]['w'] + def.padding * 2;
                    }

                    this.wi[j]['top'] = totalHeight + 10 * i;
                }
                totalHeight += this.string[i]['h'];
                iter += this.string[i]['count'];
            }
            //запускаем анимацию
            i = 0;
            var count = this.countImg;
            for (i; i < count; i++) {

                if (this.trans) {
                   $(this.jQueryImages[i]).parent().css({'top': this.wi[i]['top'] - def.padding, 'left': this.wi[i]['left'], 'width': this.wi[i]['w'], 'height': this.wi[i]['h']});
                   $(this.jQueryImages[i]).css({'width': this.wi[i]['w'],'height': this.wi[i]['h']});

                    this.jQueryImages[i].addEventListener('transitionend', function (x) {
                        if (x === count - 1) {
                          setTimeout(function () {
                              console.log('the end');
                              frResize = 0;
                          }, 500);
                        }
                    }(i), false);
                } else {
                    $(this.jQueryImages[i]).animate({ 'width': this.wi[i]['w'], 'height': this.wi[i]['h'] }, def.animationSpeed).parent()
                    .animate({ 'top': this.wi[i]['top'] - def.padding, 'left': this.wi[i]['left'], 'width': this.wi[i]['w'], 'height': this.wi[i]['h'] }, def.animationSpeed, function (x) {
                        if (x === count - 1) {
                            setTimeout(function () {
                                frResize = 0;
                            }, 100);
                        }
                    } (i));
                }

            }
            this.el.style.height = totalHeight + 20 + 'px';
        }
    }

    $.fn.goodImage = function (options) {
        var def = {
            'maxWidth': 600, //максимальная длинна, для блока с фотками
            'resize': 1, //событие для расайза (1-контейнет с фотками, 2-окно браузера 0 - не отслеживает размер)
            'minWidth': 350,
            'minHeight': 100, //средняя высота к которой надо стремиться
            'padding': 5, //величина отступов
            'source': null,
            'wrap': 'div', //элемент обертка исползуется если передается объект с информацией по которому строятся картинки
            'imgClass': 'simpleImage', //класс изображений по дефолту
            'animationSpeed': 700,
            'display': 'inline-block'
        }, si;

        $.extend(def, options);

        return this.each(function () {

            si = new simpleImage(this, def);
        });
    };
} (jQuery));