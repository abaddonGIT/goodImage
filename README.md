goodImage
==========
Вывод картинок как в google - картинках

Параметры плагина:

maxWidth - длинна контейнера для блока с фотками (по умолчанию 600px),

minWidth - минимальная шрина контейнера,

minHeight - средняя высота картинок к которой будет стремиться плагин,

padding - отступы у контейнеров картинок,

source - сюда можно передать объект с информацией о картинках ('адрес, длина, ширина'). Если объект передан, то картинки строится на его основе, а неберутся со страницы,

wrap - селектор оберток картинок (по умолчанию div),

imgClass - класс картинок (по умолчанию simpleImage),

parentClass - класс оберток картинок (по умолчанию imgParent),

animationSpeed - скорость анимации (по умолчанию 700),

display - тип блоков (по умолчанию inline-block),

opacity - прозрачнаять элементов (нужна если нужно плавное появление картинок),

fade - включть плавное появление картинок,

fadeTime - скорость плавного появления картинок (по умолчанию 1500),

hoverEffect - эффект при наведении мыши.
  
  border - рисует рамку вокугкартинки ('css':{'width':3,'style':'solid','color':'#fff'}),
  
  scale - увеличение размера кртинки при наведении  ('css':'1.2'),
  
  scaleAll - увеличение размеров, как картинки, так и контейнера,
  
  shadow - рисует тень ('css':'0 0 10px #000').
  
hoverIn - функция при наведении (в качестве аргумента получает элемент на которой навели),

hoverOut - Ф-я при сведении 

resize - отвечает за перестройку картинок при из менении размера контейнера (1 - изменение контейнера с фотками, 2 - изменение размеров окна браузера, 0 - не отслежывать изменения размера),

