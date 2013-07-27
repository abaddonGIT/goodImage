/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Hetzerok and Abaddon <abaddongit@gmail.com>
 * @version 1.0.0
 * ***************************************************/
/*global window, $, jQuery, document */
(function($) {
    "use strict";
    //Прерывает анимацию
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
    }

    $.fn.goodImage = function(options) {
        var def = {
            'maxWidth': 600, //максимальная ширина блок с картинками
            'minHeight': 100, //средняя высота
            'padding': 5, //расстаяние между картинками
            'source': {},
            'transitionAnimate': 0,
            'animationSpeed': 2500,
            'delay': 200, //Задержка перед началом анимации
            'display': 'inline-block',
            'contHeight': 0,
            'hoverBorder': 3
        };

        $.extend(def, options);

        return this.each(function() {
            $(this).children().unbind('mouseover.good mouseout.good');
            
            $(this).css('position', 'relative');

            //переменные
            var images = def.source, th = this,
                    countST, iter, totalHeight,
                    imagesLn, keys = Object.keys(def.source).length,
                    countImg = keys, blocks, leng,
                    image = 0, string = [],
                    p = 0, wi = [],
                    count, width, h, countInString,
                    allCount, maxWidth, iw, ih, lwidth,
                    w, wt, wr, i, j, b, _w, _h, step, timer;

            if (keys === 0) {
                images = $(this).find('img');
                countImg = images.length;
            }
            //прерываем анимацию
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

                blocks = $(this).children();
                b = 0;
                //сохраняем старое состояние картинок
                for (b; b < countImg; b++) {
                    $(blocks[b]).css({'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top});
                    if (b === countImg - 1) {
                        blocks.css('position', 'absolute');
                    }
                }

                countST = string.length;
                i = 0;
                iter = 0;
                totalHeight = def.padding;//количество строк
                //тут мы добавляем параметы left и top к массиву размеров 
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
                        $(images[i]).parent().delay(def.delay).animate({'top': wi[i]['top'], 'left': wi[i]['left']}, def.animationSpeed);
                        $(images[i]).delay(def.delay).animate({'width': wi[i]['w'], 'height': wi[i]['h']}, def.animationSpeed);
                    }
                } else {
                    images = $(this).children();
                    imagesLn = images.length;
                    i = 0;
                    if (imagesLn !== 0) {
                        for (i; i < imagesLn; i++) {
                            $(images[i]).delay(def.delay).animate({'top': wi[i]['top'], 'left': wi[i]['left']}, def.animationSpeed);
                            $(images[i]).find('img').delay(def.delay).animate({'width': wi[i]['w'], 'height': wi[i]['h']}, def.animationSpeed);
                        }
                    }
                }
            } else {
                if (keys === 0) {
                    for (i; i < leng; i++) {
                        $(images[i]).css({'width': wi[i]['w'], 'height': wi[i]['h']});
                    }
                } else {
                    //выстраиваем зображения
                    for (i; i < leng; i++) {
                        $(this).append('<div style="margin:' + def.padding + 'px; display:' + def.display + ';"><img src="' + images[i]['link'] + '" alt="" style="width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;" /></div>');
                        if (i === leng - 1) {
                            blocks = $(this).children();
                            b = 0;
                            //сохраняем старое состояние картинок
                            for (b; b < countImg; b++) {
                                $(blocks[b]).css({'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top});
                                if (b === countImg - 1) {
                                    $(this).css('height', $(this).height());
                                    blocks.css('position', 'absolute');
                                }
                            }
                        }
                    }
                }
            }
            //событие при наведении мыши
            $(this).children().bind('mouseover.good', function () {
                $(this).css({'border': def.hoverBorder + 'px solid #0070c0', 'margin': def.padding - def.hoverBorder});
            });
            $(this).children().bind('mouseout.good', function () {
                $(this).css({'border': 'none', 'margin': def.padding});
            });
        });
    };
}(jQuery));