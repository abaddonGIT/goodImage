/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Hetzerok and Abaddon <abaddongit@gmail.com>
 * @version 1.0.0
 * ***************************************************/
/*global window, $, jQuery, document */
(function($) {
    "use strict";

    $.fn.goodImage = function(options) {
        var def = {
            'maxWidth': 600, //максимальная ширина блок с картинками
            'minHeight': 100, //средняя высота
            'padding': 5, //расстаяние между картинками
            'source': {},
            'transitionAnimate': 0,
            'display': 'block',
            'contHeight': 0
        };

        $.extend(def, options);

        return this.each(function() {

            if (def.contHeight !== 0) {
                $(this).css('height', def.contHeight);
            }
            else {
                $(this).css('height', 'auto');
            }

            var images = def.source, //объект содержит все картинки внутри выбранного блока
                    keys = Object.keys(def.source).length,
                    countImg = keys, //кол-во картинок внутри выбранного блока
                    image = 0, string = [], p = 0,
                    wi = [];

            if (keys === 0) {
                images = $(this).find('img');
                countImg = images.length;
            }



            while (image < countImg) {
                var count = image, width = 0, h = 0, countInString = 0, allCount = 0, maxWidth = def.maxWidth;

                while (width < maxWidth) {
                    var iw,
                            ih,
                            lwidth = width;

                    if (images[count] !== undefined) {
                        if (keys === 0) {
                            iw = $(images[count]).width();
                            ih = $(images[count]).height();
                            //console.log(images[count]);
                        }
                        else {
                            iw = images[count]['width'];
                            ih = images[count]['height'];
                        }
                        width = width + Math.round((iw / ih) * def.minHeight);
                        count++;
                        maxWidth = maxWidth - def.padding * 2;
                    }
                    else {
                        //console.log(maxWidth + '||' + width + '||' + (count - image));
                        if ((maxWidth - width) <= def.minHeight) {
                            h = 0;
                        }
                        else {
                            h = def.minHeight;
                        }
                        break;
                    }
                }

                if ((width - maxWidth) < ((maxWidth + def.padding * 2) - lwidth)) {
                    countInString = count - image;
                    allCount = count;
                    var w = width;
                }
                else {
                    countInString = count - image - 1;
                    allCount = count - 1;
                    var w = lwidth;
                }

                if (h === 0) {

                    h = Math.floor((def.minHeight / w) * (def.maxWidth - (2 * def.padding * (countInString - 1))));
//console.log(h);
                    var i = allCount - 1, wt = 0;

                    for (i; i > (allCount - countInString - 1); i--) {
                        if (keys === 0) {
                            var _w = $(images[i]).width(), _h = $(images[i]).height();
                        }
                        else {
                            var _w = images[i]['width'], _h = images[i]['height'];
                        }
                        //var _w = $(images[i]).width(), _h = $(images[i]).height();

                        wi[i] = [];
                        wi[i]['w'] = Math.round(_w * h / _h);
                        if (wi[i]['w'] > def.maxWidth) {
                            wi[i]['w'] = def.maxWidth;
                        }
                        wi[i]['h'] = h;

                        wt = wt + wi[i]['w'];
                    }



                    var wr = 0;
                    wr = def.maxWidth - (wt + ((countInString - 1) * def.padding * 2));
                    //console.log(wt);
                    //console.log(wt);
                    if (wr !== 0) {
                        var step = 0;
                        step = Math.ceil(wr / countInString);
                        var j = allCount - 1;

                        for (var i = wr; i >= step; i = i - step) {

                            wi[j]['w'] = wi[j]['w'] + step;
                            //console.log('after ' + wi[j]['w']);
                            j--;
                        }
                        if (i > 0) {
                            wi[j]['w'] = wi[j]['w'] + i;
                        }
                    }
                    wt = 0;
                }
                else {

                    //h = Math.floor((def.minHeight / w) * (def.maxWidth - (2 * def.padding * (countInString - 1))));
//                    console.log(h);
                    var i = allCount - 1;
                    for (i; i > (allCount - countInString - 1); i--) {
                        if (keys === 0) {
                            var _w = $(images[i]['w']).width(), _h = $(images[i]['h']).height();
                        }
                        else {
                            var _w = images[i]['width'], _h = images[i]['height'];
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
                //console.log(h);
                p++;
            }


            var leng = wi.length, i = 0;

            //console.log(string);

            if (def.transitionAnimate === 1) {
                //$(this).children('div').css('position', 'absolute');
                
                var blocks = $(this).children(), b = 0;
                //сохраняем старое состояние картинок
                for (; b < countImg;b++) {
                    $(blocks[b]).css({'left': $(blocks[b]).position().left, 'top': $(blocks[b]).position().top});
                }
                b = 0;
                for (; b < countImg;b++) {
                    //console.log($(blocks[b]).position().left);
                    $(blocks[b]).css('position','absolute');
                }
                
                var countST = string.length, i = 0, iter = 0, totalHeight = 5;//количество строк
                //тут мы добавляем параметы left и top к массиву размеров 
                for (; i < countST; i++) {
                    //console.log(string[i][count]);
                    for (var j = iter; j < iter + string[i]['count']; j++) {
                        //console.log(iter);
                        if (iter === j) {
                            wi[iter]['left'] = 0;
                        }
                        else {
                            wi[j]['left'] = wi[j - 1]['left'] + wi[j - 1]['w'] + def.padding * 2;
                        }
                        
                        wi[j]['top'] = totalHeight + 10*i;
                    }
                    totalHeight += string[i]['h'];
                    iter += string[i]['count'];
                }
                
                for (var i = 0; i < leng; i++) {
//                    $(images[i]).parent().css({'top': wi[i]['top'], 'left': wi[i]['left']});
//                    $(images[i]).parent().css({'left':'0','top':0,'position':'relative'});
//                    $(images[i]).css({'width': wi[i]['w'], 'height': wi[i]['h']});
                    $(images[i]).parent().delay(500).animate({'top': wi[i]['top'], 'left': wi[i]['left']}, 3000, function (){
                        $(this).css({'left':'0','top':0,'position':'relative'});
                    });
                    $(images[i]).delay(500).animate({'width': wi[i]['w'], 'height': wi[i]['h']}, 3000);
                }
            }
            else {
                if (keys === 0) {
                    for (; i < leng; i++) {
                        //if (def.transitionAnimate === 1) {
                        //$(images[i]).animate({'width': wi[i]['w'], 'height': wi[i]['h']}, 2000);
                        //}
                        //else {
                        $(images[i]).css({'width': wi[i]['w'], 'height': wi[i]['h']});
                        //}
                    }
                }
                else {
                    for (; i < leng; i++) {
                        $(this).append('<div style="margin:' + def.padding + 'px; float: left; display:' + def.display + '"><img src="' + images[i]['link'] + '" alt="" style="width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;" /></div>');
                    }
                }
            }

        });
    };
})(jQuery)