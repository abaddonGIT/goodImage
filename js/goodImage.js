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
            'maxWidth': 460, //максимальная ширина блок с картинками
            'minHeight': 100, //средняя высота
            'padding': 5, //расстаяние между картинками
            'source': {},
            'display': 'block'
        };

        $.extend(def, options);

        return this.each(function() {


            var images = def.source, //объект содержит все картинки внутри выбранного блока
                    countImg = Object.keys(def.source).length, //кол-во картинок внутри выбранного блока
                    image = 0,
                    wi = [];

            if (countImg === 0) {
                countImg = images.length;
                images = $(this).find('img');
            }



            while (image < countImg) {
                var count = image, width = 0, h = 0, countInString = 0, allCount = 0, maxWidth = def.maxWidth;
                
                while (width < maxWidth) {
                    var iw,
                            ih,
                            lwidth = width;

                    if (images[count] !== undefined) {
                        if (countImg === 0) {
                            iw = $(images[count]).width();
                            ih = $(images[count]).height();
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
                        if (countImg === 0) {
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
                        if (countImg === 0) {
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

                image = image + countInString;
            }

            var leng = wi.length, i = 0;
            if (countImg === 0) {
                for (; i < leng; i++) {
                    $(images[i]).css({'width': wi[i]['w'], 'height': wi[i]['h']});
                }
            }
            else {
                for (; i < leng; i++) {
                    $(this).append('<div style="margin:' + def.padding + 'px; float: left; display:' + def.display + '"><img src="' + images[i]['link'] + '" alt="" style="width:' + wi[i]['w'] + 'px; height:' + wi[i]['h'] + 'px;" /></div>');
                }
            }
            
        });
    };
})(jQuery)