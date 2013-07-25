/******************************************************
 * Copyright 2013 by Abaddon <abaddongit@gmail.com>
 * @author Abaddon <abaddongit@gmail.com>
 * @version 1.0.0
 * ***************************************************/
/*global window, $, jQuery, document */
(function ($) {
    "use strict";
    
    $.fn.goodImage = function (options) {
        var def = {
            'width': 600,
            'maxWidth': 600,
            'minWidth': 100,
            'padding': 5
        };
        
        $.extend(def, options);
        
        return this.each(function () {
            var img = $(this).find('img'), ln = img.length, $image = 0;
            def.maxWidth = def.maxWidth - def.padding*2;
            
            while ($image <= ln) {
                var width = 0, height = 0, j = $image;
                
                while (width < def.maxWidth) {
                    var lwidth = width, 
                        iw = $(img[j]).width(),
                        ih = $(img[j]).height();
                    width = width + Math.floor(iw/ih)*def.height;
                    console.log(iw);   
                    j++; 
                }
                $image++;
            }
        });
    }
})(jQuery)