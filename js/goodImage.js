/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Hetzerok and Abaddon <abaddongit@gmail.com>
 * @version 1.0.0
 * ***************************************************/
/*global window, $, jQuery, document */
(function($) {
    "use strict";
    //прекращение анимации
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
            'maxWidth': 600, //максимальная длинна, для блока с фотками
            'minHeight': 100, //средняя высота к которой надо стремиться
            'padding': 5, //величина отступов
            'source': {},
            'transitionAnimate': 0,
            'animationSpeed': 1500,
            'delay': 100, //задержка перед началом анимации
            'display': 'inline-block',
            'contHeight': 0,
            'hoverBorder': 3,
            'cacheType': 1,
            'cacheVar': {}
        };

        $.extend(def, options);

        return this.each(function() {
            $(this).children().unbind('mouseover.good mouseout.good');

            $(this).css('position', 'relative');

            //Переменные
            var images = def.source, th = this,
                    countST, iter, totalHeight,
                    imagesLn, keys = Object.keys(def.source).length,
                    countImg = keys, blocks, leng,
                    image = 0, string = [],
                    p = 0, wi = [],
                    count, width, h, countInString,
                    allCount, maxWidth, iw, ih, lwidth,
                    w, wt, wr, i, j, b, _w, _h, step, timer, cache;

            cache = {
                set: function(k, v) {
                    switch (def.cacheType) {
                        case 1:
                            if (def.cacheVar !== undefined) {
                                def.cacheVar[k] = v;
                            }
                            break;
                        case 2:
                            var v = JSON.stringify(v.toObject());
                            localStorage[k] = v;
                            break;
                    }
                },
                get: function(k) {
                    switch (def.cacheType) {
                        case 1:
                            if (def.cacheVar !== undefined) {
                                return def.cacheVar[k];
                            }
                            else {
                                return false;
                            }
                            break;
                        case 2:
                            return JSON.parse(localStorage[k]).toArray();
                            break;
                    }
                }
            };

            if (keys === 0) {
                images = $(this).find('img');
                countImg = images.length;
            }
            //Стопарим анимацию
            breakAnimation(this, images, countImg);
            //проверяем нет ли значений для текужего состояния в кэше
            if (!cache.get(def.maxWidth + '_' + countImg)) {
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
                console.log('кэширкем');
                //кэшируем полученные значения
                cache.set(def.maxWidth + '_' + countImg, wi);
                cache.set(def.maxWidth + '_string_' + countImg, string);
            } else {
                console.log('из кэша');
                wi = cache.get(def.maxWidth + '_' + countImg);
                string = cache.get(def.maxWidth + '_string_' + countImg);
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

                if (!cache.get(def.maxWidth + '_' + countImg) || cache.get(def.maxWidth + '_' + countImg)[0]['left'] === undefined) {
                    countST = string.length;
                    i = 0;
                    iter = 0;
                    totalHeight = def.padding;//общая высота
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
                    //Дополняем кэш
                    console.log('дополняем кэш');
                    cache.set(def.maxWidth + '_' + countImg, wi);
                } else {
                    console.log('берем результа из кэша');
                    wi = cache.get(def.maxWidth + '_' + countImg);
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
                    //строим картинки
                    for (i; i < leng; i++) {
                        $(this).append('<div style="margin:' + def.padding + 'px; display:' + def.display + ';"><img src="' + images[i]['link'] + '" alt="" style="width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;" /></div>');
                    }
                    blocks = $(this).children();
                    b = 0;
                    //закрепляем их на местах
                    for (b; b < countImg; b++) {
                        $(blocks[b]).css({'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top});
                    }

                    $(this).css('height', $(this).height());
                    blocks.css('position', 'absolute');
                }
            }
            //События при наведени
            $(this).children().bind('mouseover.good', function() {
                $(this).css({'border': def.hoverBorder + 'px solid #0070c0', 'margin': def.padding - def.hoverBorder});
            });
            $(this).children().bind('mouseout.good', function() {
                $(this).css({'border': 'none', 'margin': def.padding});
            });
        });
    };
}(jQuery));