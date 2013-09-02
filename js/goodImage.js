/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Abaddon <abaddongit@gmail.com>
 * @version 1.0.1
 * ***************************************************/
/*global window, $, jQuery, document */
(function($) {
    "use strict";
    var frResize = 0;
    function simpleImage(el, def) {
        this.el = el;
        this.config = def;
        this.images = def.source || $(el).find('img' + '.' + this.config.imgClass); //тут оказывается либо объект с описанием картинок либо объект jQuery с этими картинками
        this.countImg = this.images.length || Object.keys(this.images).length;
        this.defWidth = this.config.maxWidth;
        //опредяем поддержку анимации на css
        if ("transition" in document.createElement('div').style) {
            this.trans = true;
            this.transWrapCSS = 'width ' + def.animationSpeed / 1000 + 's ease,' +
                    'height ' + def.animationSpeed / 1000 + 's ease,' +
                    'top ' + def.animationSpeed / 1000 + 's ease,' +
                    'left ' + def.animationSpeed / 1000 + 's ease';
            this.transImgCSS = 'width ' + def.animationSpeed / 1000 + 's ease,' +
                    'height ' + def.animationSpeed / 1000 + 's ease';

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
    simpleImage.prototype.preparation = function() {
        var m = {}, el = this.el, w, c = this.countImg, images = this.images, def = this.config, imInFor, imInForP;
        //window.removeEventListener('resize',1);

        var i = 0, ims;
        if (images.selector === undefined) {
            ims = $(el).find('img' + '.' + def.imgClass);
            for (i; i < c; i++) {
                imInFor = ims[i];
                $(imInFor).stop(true);
                $(imInFor).parent().stop(true);
            }
        } else {
            //если у нас в images объекты jquery то переписываем его
            for (i; i < c; i++) {
                imInFor = this.images[i];
                imInForP = $(this.images[i]).parents('.' + def.parentClass);

                m[i] = {
                    'height': $(imInFor).height(),
                    'width': $(imInFor).width(),
                    'link': $(imInFor).attr('src')
                };

                $(imInFor).stop(true);
                imInForP.stop(true);
            }
            this.inputType = 1;
            this.jQueryImages = images;
            this.images = m;
        }

        el.style.position = 'relative';
        el.style.fontSize = 0;
        w = this.config.maxWidth + this.config.padding * 2;
        el.style.cssText += 'overflow: hidden; width:' + w + 'px; margin: 0 -5px; fontSize: 0;';
    };
    /*
     * Получаем объект дом javascript из переданного html кода
     * @param {String} html-код
     * @return {Object}
     */
    simpleImage.prototype.setElement = function(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var el = div.childNodes[0];
        div.removeChild(el);
        return el;
    };
    /*
     *Добавляет прослушку событий изменения размера контейнера
     */
    simpleImage.prototype.adEvent = function() {
        var widthBody,
                el = this.el,
                def = this.config,
                fun = this,
                timerID = 0, time = 0, TIME_IDLE = 500, step = 0,
                resizeLurking = function() {
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

                frames[frID].onresize = function() {
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

                };
                break;
            case 2:
                window.addEventListener('resize', function() {
                    if (!timerID) {
                        timerID = window.setInterval(resizeLurking, 55);
                    }
                    time = +new Date;
                }, 1);
                break;
            default:
        }
        ;

        //Событие для перезагрузки картинок
        $(el).bind('relode', function(event, newData) {
            var wn = JSON.parse(newData);
            fun.config.maxWidth = el.offsetHeight;
            fun.images = wn;
            fun.countImg = wn.count;
            fun.jQueryImages = $(el).find('img' + '.' + fun.config.imgClass);
            fun.building(true);
        });
        //Добавляем hover эффекты
        var effect = def.hoverEffect.type, effectCSS = def.hoverEffect.css;
        $(el).children().hover(
                function() {
                    switch (effect) {
                        case 'border':
                            if (effectCSS === undefined) {
                                $(this).css({
                                    'margin': def.padding - 3,
                                    'border': '3px solid #00b4f0'
                                });
                            } else {
                                $(this).css({
                                    'margin': def.padding - effectCSS.width,
                                    'border': effectCSS.width + 'px ' + effectCSS.style + ' ' + effectCSS.color
                                });
                            }
                            break;
                        case 'scale':
                            if (effectCSS === undefined) {
                                $(this).css('overflow', 'hidden').find('img.' + def.imgClass).css({'transition': '1s ease', 'transform': 'scale(1.2)'});
                            } else {
                                $(this).css('overflow', 'hidden').find('img.' + def.imgClass).css({'transition': '1s ease', 'transform': 'scale(' + effectCSS.scale + ')'});
                            }
                            break;
                        case 'scaleAll':
                            if (effectCSS === undefined) {
                                $(this).css({'transform': 'scale(1.2)', 'z-index': 2}).find('img.' + def.imgClass).css({'transition': '1s ease', 'transform': 'scale(1.2)'});
                            } else {
                                $(this).css('transform', 'scale(' + effectCSS.scale + ')').find('img.' + def.imgClass).css({'transition': '1s ease', 'transform': 'scale(' + effectCSS.scale + ')'});
                            }
                            break;
                        case 'shadow':
                            if (effectCSS === undefined) {
                                $(this).css('box-shadow', '0 0 10px #000');
                            } else {
                                $(this).css('box-shadow', effectCSS);
                            }
                            break;
                        default:

                    }
                    def.hoverIn(this);
                },
                function() {
                    switch (effect) {
                        case 'border':
                            $(this).css({
                                'border': 'none',
                                'margin': def.padding
                            });
                            break;
                        case 'scale':
                            $(this).find('img.' + def.imgClass).css({'transform': 'none', 'transition': fun.transImgCSS});
                            break;
                        case 'scaleAll':
                            $(this).css({'transform': 'none', 'z-index': 1}).find('img.' + def.imgClass).css({'transform': 'none', 'transition': fun.transImgCSS});
                            break;
                        case 'shadow':
                            $(this).css('box-shadow', 'none');
                            break;
                        default:

                    }

                    def.hoverOut(this);

                });
    };
    /*
     * Рассчет размеров для картинок
     */
    simpleImage.prototype.calculation = function() {
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
    };

    /*
     * Преобразует массив в json строку
     * @param {Array} arr - входной массив
     * @returns {String}
     */
    simpleImage.prototype.toJSON = function(arr) {
        var parts = [], arL = arr.length, pod = [], i = 0, s = '[';

        for (i; i < arL; i++) {
            s += '{';
            pod = [];
            for (var j in arr[i]) {
                if (typeof arr[i][j] === "number") {
                    pod.push('"' + j + '":' + arr[i][j]);
                } else {
                    pod.push('"' + j + '":' + '"' + arr[i][j] + '"');
                }
            }

            s += pod.join();

            if (i === arL - 1) {
                s += '}';
            } else {
                s += '},';
            }
        }

        s += ']';

        return s;
    };

    /*
     * Выстраивает изображения и осуществляет анимацию при перемещении
     * @param {Boolean} ключ указывает надо ли включать анимацию
     */
    simpleImage.prototype.building = function(animation) {
        var def = this.config, i = 0, c = this.countImg, inForIm, inForP, el = this.el, t, l, imgP = [], img = [], w, wi, images;
        //расчет размеров картинки
        this.calculation();
        //строим картинки
        wi = this.wi;

        if (!animation) {

            if (this.inputType) {
                i = 0;

                for (i; i < c; i++) {
                    inForIm = this.jQueryImages[i];
                    inForP = $(this.jQueryImages[i]).parents('.' + def.parentClass)[0];
                    //стили картинок
                    inForIm.style.cssText = 'width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;';

                    //стили оберток
                    if (inForP !== null) {
                        inForP.style.cssText = 'width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px; margin:' + def.padding + 'px; display: inline-block; opacity' + def.opacity + ';';

                        t = inForP.offsetLeft - def.padding;
                        l = inForP.offsetTop - def.padding;

                        inForP.style.cssText += 'left:' + t + 'px; top:' + l + 'px;';
                    } else {
                        t = inForIm.offsetLeft;
                        l = inForIm.offsetTop;
                        inForIm.style.cssText += 'margin:' + def.padding + 'px; left:' + t + 'px; top:' + l + 'px;';
                    }

                    if (i === c - 1) {
                        setTimeout(function() {
                            frResize = 0;
                        }, 100);
                    }
                    img.push(inForIm);
                    imgP.push(inForP);
                }
                
                el.style.height = $(el).height() + 'px';
                //делаем все блоки с абсолютным позиционированием
                $(imgP).css({'position': 'absolute', 'transition': this.transWrapCSS});
                $(img).css('transition', this.transImgCSS);

                //плавное появление
                if (def.fade) {
                    $(imgP).fadeTo(def.fadeTime, 1);
                }
            } else {
                //Строим изображения по входному объекту
                i = 0;
                var tpl = '';
                for (i; i < c; i++) {
                    images = this.images[i];
                    tpl += '<' + def.wrap + ' style="transition:' + this.transWrapCSS + '; opacity: ' + def.opacity + '; width: ' + wi[i]['w'] + 'px; height: ' + wi[i]['h'] + 'px; margin: ' + def.padding + 'px; display: inline-block;" class="' + def.parentClass + '">' +
                            '<img class="' + def.imgClass + '" src="' + images['link'] + '" alt="" style="transition:' + this.transImgCSS + '; width: ' + wi[i]['w'] + 'px; height: ' + wi[i]['h'] + 'px;"/>' +
                            '</' + def.wrap + '>';
                }

                $(el).append(tpl);
                //высчитываем смещения
                this.jQueryImages = $(el).find('img' + '.' + def.imgClass);
                i = 0;

                for (i; i < c; i++) {
                    inForP = $(this.jQueryImages[i]).parents('.' + def.parentClass)[0];

                    t = inForP.offsetLeft - def.padding;
                    l = inForP.offsetTop - def.padding;
                    inForP.style.cssText += 'left:' + t + 'px; top:' + l + 'px;';
                    imgP.push(inForP);
                }


                el.style.height = $(el).height() + 'px';
                $(imgP).css('position', 'absolute');

                //плавное появление
                if (def.fade) {
                    $(imgP).fadeTo(def.fadeTime, 1);
                }
            }

        } else {

            var countST = this.string.length,
                    i = 0,
                    j,
                    iter = 0,
                    totalHeight = def.padding, inForStL, st = this.string; //общая высота

            //Сохраняем насоящие положение элементов
            for (i; i < countST; i++) {
                inForStL = st[i]['count'];
                for (j = iter; j < iter + inForStL; j++) {
                    if (iter === j) {
                        wi[iter]['left'] = 0;
                    } else {
                        wi[j]['left'] = wi[j - 1]['left'] + wi[j - 1]['w'] + def.padding * 2;
                    }

                    wi[j]['top'] = totalHeight + 10 * i;
                }
                totalHeight += st[i]['h'];
                iter += st[i]['count'];
            }
            //запускаем анимацию
            i = 0;
            for (i; i < c; i++) {
                inForP = $(this.jQueryImages[i]).parents('.' + def.parentClass);
                inForIm = this.jQueryImages[i];

                if (this.trans) {
                    inForP.css({'top': wi[i]['top'] - def.padding, 'left': wi[i]['left'], 'width': wi[i]['w'], 'height': wi[i]['h']});
                    $(inForIm).css({'width': wi[i]['w'], 'height': wi[i]['h']});

                    inForIm.addEventListener('transitionend', function(x) {
                        if (x === c - 1) {
                            setTimeout(function() {
                                frResize = 0;
                            }, 500);
                        }
                    }(i), false);
                } else {
                    $(inForIm).animate({'width': wi[i]['w'], 'height': wi[i]['h']}, def.animationSpeed).parent()
                            .animate({'top': wi[i]['top'] - def.padding, 'left': wi[i]['left'], 'width': wi[i]['w'], 'height': wi[i]['h']}, def.animationSpeed, function(x) {
                        if (x === c - 1) {
                            setTimeout(function() {
                                frResize = 0;
                            }, 100);
                        }
                    }(i));
                }

            }
            el.style.height = totalHeight + 20 + 'px';
        }
    };

    $.fn.goodImage = function(options) {
        var def = {
            'maxWidth': 600, //максимальная длинна, для блока с фотками
            'resize': 1, //событие для расайза (1-контейнет с фотками, 2-окно браузера 0 - не отслеживает размер)
            'minWidth': 350,
            'minHeight': 100, //средняя высота к которой надо стремиться
            'padding': 5, //величина отступов
            'source': null,
            'wrap': 'div', //элемент обертка исползуется если передается объект с информацией по которому строятся картинки
            'imgClass': 'simpleImage', //класс изображений по дефолту
            'parentClass': 'imgParent',
            'animationSpeed': 700,
            'display': 'inline-block',
            'opacity': 0,
            'fade': true,
            'fadeTime': 1500,
            'hoverEffect': {//эффект при наведении мыши
                'type': 'scale'
            },
            'hoverIn': function(el) {
            },
            'hoverOut': function(el) {
            }
        }, si;

        $.extend(def, options);

        return this.each(function() {

            si = new simpleImage(this, def);
        });
    };
}(jQuery));