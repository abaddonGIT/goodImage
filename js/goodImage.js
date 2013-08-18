/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Abaddon <abaddongit@gmail.com>
 * @version 1.0.0
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
        //расчет положения картинок
        this.building();
        //отслеживание изменения рамера контейнера
        this.adEvent();
    }

    simpleImage.prototype.preparation = function () {
        var m = {};
        this.el.style.position = 'relative';
        this.el.style.overflow = 'hidden';
        this.el.style.width = this.config.maxWidth + this.config.padding * 2 + 'px';

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

    simpleImage.prototype.setElement = function (html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var el = div.childNodes[0];
        div.removeChild(el);
        return el;
    }
    //Добавляет прослушку событий изменения размера контейнера
    simpleImage.prototype.adEvent = function () {
        var widthBody,
            el = this.el,
            def = this.config,
            fun = this,
            timerID = 0, time = 0, TIME_IDLE = 500, step = 0,
            resizeLurking = function () {
                if (+new Date - time >= TIME_IDLE) {
                    widthBody = $('html').width();
                    console.log(widthBody + '||' + fun.config.minWidth);
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
                    console.log('asd');
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
    }

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

    simpleImage.prototype.building = function (animation) {
        var def = this.config, i = 0;
        //расчет размеров картинки
        this.calculation();

        //строим картинки
        this.el.style.fontSize = 0;
        this.el.style.margin = '0 -5px';

        if (!animation) {

            if (this.inputType) {
                i = 0;

                for (i; i < this.countImg; i++) {
                    //стили картинок
                    this.jQueryImages[i].style.width = this.wi[i]['w'] + 'px';
                    this.jQueryImages[i].style.height = this.wi[i]['h'] + 'px';
                    //стили оберток
                    if (this.jQueryImages[i].parentNode != null) {
                        this.jQueryImages[i].parentNode.style.width = this.wi[i]['w'] + 'px';
                        this.jQueryImages[i].parentNode.style.height = this.wi[i]['h'] + 'px';
                        this.jQueryImages[i].parentNode.style.margin = def.padding + 'px';
                        this.jQueryImages[i].parentNode.style.display = 'inline-block';
                        this.jQueryImages[i].parentNode.style.left = this.jQueryImages[i].parentNode.offsetLeft - def.padding + 'px';
                        this.jQueryImages[i].parentNode.style.top = this.jQueryImages[i].parentNode.offsetTop - def.padding + 'px';
                    } else {
                        this.jQueryImages[i].style.margin = def.padding;
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
                $(this.jQueryImages).parent().css('position', 'absolute');
            } else {
                //Строим изображения по входному объекту
                i = 0;
                for (i; i < this.countImg; i++) {
                    var tpl = '<' + def.wrap + ' style="width: ' + this.wi[i]['w'] + 'px; height: ' + this.wi[i]['h'] + 'px; margin: ' + def.padding + 'px; display: inline-block;">' +
                                '<img class="' + this.config.imgClass + '" src="' + this.images[i]['link'] + '" alt="" style="width: ' + this.wi[i]['w'] + 'px; height: ' + this.wi[i]['h'] + 'px;"/>' +
                              '</' + def.wrap + '>'
                    $(this.el).append(tpl);
                }
                //высчитываем смещения
                this.jqueryImages = $(this.el).find('img' + '.' + this.config.imgClass);
                i = 0;
                for (i; i < this.countImg; i++) {
                    this.jqueryImages[i].parentNode.style.top = this.jqueryImages[i].parentNode.offsetTop - def.padding + 'px';
                    this.jqueryImages[i].parentNode.style.left = this.jqueryImages[i].parentNode.offsetLeft - def.padding + 'px';

                }
                this.el.style.height = $(this.el).height() + 'px';
                $(this.jqueryImages).parent().css('position', 'absolute');
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
            if (this.inputType) {
                i = 0;
                var count = this.countImg;
                for (i; i < count; i++) {
                    $(this.jQueryImages[i]).animate({ 'width': this.wi[i]['w'], 'height': this.wi[i]['h'] }, def.animationSpeed).parent()
                    .animate({ 'top': this.wi[i]['top'] - def.padding, 'left': this.wi[i]['left'], 'width': this.wi[i]['w'], 'height': this.wi[i]['h'] }, def.animationSpeed, function (x) {
                        if (x === count - 1) {
                            setTimeout(function () {
                                frResize = 0;
                            }, 100);
                        }
                    } (i));
                }
                this.el.style.height = totalHeight + 20 + 'px';
            } else {
                //console.log(this.jqueryImages);
                i = 0;
                var count = this.countImg;
                for (i; i < count; i++) {
                    $(this.jqueryImages[i]).animate({ 'width': this.wi[i]['w'], 'height': this.wi[i]['h'] }, def.animationSpeed).parent()
                    .animate({ 'top': this.wi[i]['top'] - def.padding, 'left': this.wi[i]['left'], 'width': this.wi[i]['w'], 'height': this.wi[i]['h'] }, def.animationSpeed, function (x) {
                        if (x === count - 1) {
                            setTimeout(function () {
                                frResize = 0;
                            }, 100);
                        }
                    } (i));
                }
                this.el.style.height = totalHeight + 20 + 'px';
            }

        }
        /*
        if (def.transitionAnimate === 1) {

        //                blocks = $(this).children();
        //                b = 0;
        //                //сохраняем старое расположение картинок на странице
        //                for (b; b < countImg; b++) {
        //                    $(blocks[b]).css({'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top});
        //                    if (b === countImg - 1) {
        //                        blocks.css('position', 'absolute');
        //                    }
        //                }


        countST = string.length;
        i = 0;
        iter = 0;
        totalHeight = def.padding; //общая высота
        //Сохраняем насоящие положение элементов 
        for (i; i < countST; i++) {
        for (j = iter; j < iter + string[i]['count']; j++) {
        if (iter === j) {
        wi[iter]['left'] = 0;
        } else {
        wi[j]['left'] = wi[j - 1]['left'] + wi[j - 1]['w'] + def.padding * 2;
        }

        wi[j]['top'] = totalHeight + 10 * i;
        }
        totalHeight += string[i]['h'];
        iter += string[i]['count'];
        }


        if (keys === 0) {
        for (i = 0; i < leng; i++) {
        $(images[i]).parent().delay(def.delay).animate({ 'top': wi[i]['top'], 'left': wi[i]['left'] }, def.animationSpeed);
        $(images[i]).delay(def.delay).animate({ 'width': wi[i]['w'], 'height': wi[i]['h'] }, def.animationSpeed);
        }
        } else {
        images = $(this).children();
        imagesLn = images.length;
        i = 0;
        if (imagesLn !== 0) {
        for (i; i < imagesLn; i++) {
        $(images[i]).delay(def.delay).animate({ 'top': wi[i]['top'], 'left': wi[i]['left'] }, def.animationSpeed);
        $(images[i]).find('img').delay(def.delay).animate({ 'width': wi[i]['w'], 'height': wi[i]['h'] }, def.animationSpeed);
        }
        }
        }
        } else {
        if (keys === 0) {
        for (i; i < leng; i++) {
        $(images[i]).css({ 'width': wi[i]['w'], 'height': wi[i]['h'] });
        }
        } else {
        //строим картинки
        for (i; i < leng; i++) {
        $(this).append('<div style="margin:' + def.padding + 'px; display:' + def.display + ';"><img src="' + images[i]['link'] + '" alt="" style="width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;" /></div>');
        }
        blocks = $(this).children();
        b = 0;
        //закрепляем их на местах
        for (b; b < countImg; b++) {
        $(blocks[b]).css({ 'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top });
        }

        $(this).css('height', $(this).height());
        blocks.css('position', 'absolute');
        }
        }*/
    }

    //прекращение анимации
    /*
    function breakAnimation(el, images, count) {
    var i = 0, ims;
    if (images.selector === undefined) {
    ims = $(el).find('img');
    for (i; i < count; i++) {
    $(ims[i]).stop(true);
    $(ims[i]).parent().stop(true);
    }
    } else {
    for (i; i < count; i++) {
    $(images[i]).stop(true);
    $(images[i]).parent().stop(true);
    }
    }
    }*/

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
            'transitionAnimate': 0,
            'animationSpeed': 700,
            'delay': 200, //задержка перед началом анимации
            'display': 'inline-block',
            'contHeight': 0,
            'hoverBorder': 3
        }, si;

        $.extend(def, options);

        return this.each(function () {

            si = new simpleImage(this, def);

            //$(this).css('position', 'relative');

            //Переменные
            /*
            var images = def.source, th = this,
            countST, iter, totalHeight,
            imagesLn, keys = Object.keys(def.source).length,
            countImg = keys, blocks, leng,
            image = 0, string = [],
            p = 0, wi = [],
            count, width, h, countInString,
            allCount, maxWidth, iw, ih, lwidth,
            w, wt, wr, i, j, b, _w, _h, step, timer, cache;

            if (keys === 0) {
            images = $(this).find('img');
            countImg = images.length;
            }
            //Стопарим анимацию
            breakAnimation(this, images, countImg);

            while (image < countImg) {
            count = image;
            width = 0;
            h = 0;
            countInString = 0;
            allCount = 0;
            maxWidth = def.maxWidth;

            while (width < maxWidth) {
            lwidth = width;

            if (images[count] !== undefined) {
            if (keys === 0) {
            iw = $(images[count]).width();
            ih = $(images[count]).height();
            } else {
            iw = images[count]['width'];
            ih = images[count]['height'];
            }
            width = width + Math.round((iw / ih) * def.minHeight);
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

            if ((width - maxWidth) < ((maxWidth + def.padding * 2) - lwidth)) {
            countInString = count - image;
            allCount = count;
            w = width;
            } else {
            countInString = count - image - 1;
            allCount = count - 1;
            w = lwidth;
            }

            if (h === 0) {

            h = Math.floor((def.minHeight / w) * (def.maxWidth - (2 * def.padding * (countInString - 1))));
            i = allCount - 1;
            wt = 0;

            for (i; i > (allCount - countInString - 1); i--) {
            if (keys === 0) {
            _w = $(images[i]).width();
            _h = $(images[i]).height();
            } else {
            _w = images[i]['width'];
            _h = images[i]['height'];
            }
            wi[i] = [];
            wi[i]['w'] = Math.round(_w * h / _h);
            if (wi[i]['w'] > def.maxWidth) {
            wi[i]['w'] = def.maxWidth;
            }
            wi[i]['h'] = h;

            wt = wt + wi[i]['w'];
            }

            wr = 0;
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
            if (keys === 0) {
            _w = $(images[i]['w']).width();
            _h = $(images[i]['h']).height();
            } else {
            _w = images[i]['width'];
            _h = images[i]['height'];
            }
            wi[i] = [];
            wi[i]['w'] = Math.round(_w * h / _h);
            wi[i]['h'] = h;
            }
            }
            string[p] = [];
            string[p]['count'] = countInString;
            string[p]['h'] = h;
            image = image + countInString;
            p++;
            }


            leng = wi.length;
            i = 0;

            if (def.transitionAnimate === 1) {

            //                blocks = $(this).children();
            //                b = 0;
            //                //сохраняем старое расположение картинок на странице
            //                for (b; b < countImg; b++) {
            //                    $(blocks[b]).css({'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top});
            //                    if (b === countImg - 1) {
            //                        blocks.css('position', 'absolute');
            //                    }
            //                }


            countST = string.length;
            i = 0;
            iter = 0;
            totalHeight = def.padding; //общая высота
            //Сохраняем насоящие положение элементов 
            for (i; i < countST; i++) {
            for (j = iter; j < iter + string[i]['count']; j++) {
            if (iter === j) {
            wi[iter]['left'] = 0;
            } else {
            wi[j]['left'] = wi[j - 1]['left'] + wi[j - 1]['w'] + def.padding * 2;
            }

            wi[j]['top'] = totalHeight + 10 * i;
            }
            totalHeight += string[i]['h'];
            iter += string[i]['count'];
            }


            if (keys === 0) {
            for (i = 0; i < leng; i++) {
            $(images[i]).parent().delay(def.delay).animate({ 'top': wi[i]['top'], 'left': wi[i]['left'] }, def.animationSpeed);
            $(images[i]).delay(def.delay).animate({ 'width': wi[i]['w'], 'height': wi[i]['h'] }, def.animationSpeed);
            }
            } else {
            images = $(this).children();
            imagesLn = images.length;
            i = 0;
            if (imagesLn !== 0) {
            for (i; i < imagesLn; i++) {
            $(images[i]).delay(def.delay).animate({ 'top': wi[i]['top'], 'left': wi[i]['left'] }, def.animationSpeed);
            $(images[i]).find('img').delay(def.delay).animate({ 'width': wi[i]['w'], 'height': wi[i]['h'] }, def.animationSpeed);
            }
            }
            }
            } else {
            if (keys === 0) {
            for (i; i < leng; i++) {
            $(images[i]).css({ 'width': wi[i]['w'], 'height': wi[i]['h'] });
            }
            } else {
            //строим картинки
            for (i; i < leng; i++) {
            $(this).append('<div style="margin:' + def.padding + 'px; display:' + def.display + ';"><img src="' + images[i]['link'] + '" alt="" style="width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;" /></div>');
            }
            blocks = $(this).children();
            b = 0;
            //закрепляем их на местах
            for (b; b < countImg; b++) {
            $(blocks[b]).css({ 'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top });
            }

            $(this).css('height', $(this).height());
            blocks.css('position', 'absolute');
            }
            }
            */
        });
    };
} (jQuery));