---
title: iOS Safari一些响应式辅助样式和脚本
date: 2015-12-21
tags:
  - css
  - media query
---

### CSS 媒体查询
```css
/* iPhone4/4s */

/* Portrait and Landscape */
@media only screen and (min-device-width: 320px)
and (max-device-width: 480px)
and (-webkit-min-device-pixel-ratio: 2) {
    // style here
}

/* Portrait */
@media only screen
and (min-device-width: 320px)
and (max-device-width: 480px)
and (-webkit-min-device-pixel-ratio: 2)
and (orientation: portrait) {
    // style here
}

/* Landscape */
@media only screen
and (min-device-width: 320px)
and (max-device-width: 480px)
and (-webkit-min-device-pixel-ratio: 2)
and (orientation: landscape) {
    // style here
}

/* iPhone5/5s */

/* Portrait and Landscape */
@media only screen
and (min-device-width: 320px)
and (max-device-width: 568px)
and (-webkit-min-device-pixel-ratio: 2) {
    // style here
}
/* Portrait */
@media only screen
and (min-device-width: 320px)
and (max-device-width: 568px)
and (-webkit-min-device-pixel-ratio: 2)
and (orientation: portrait) {
    // style here
}
/* Landscape */
@media only screen
and (min-device-width: 320px)
and (max-device-width: 568px)
and (-webkit-min-device-pixel-ratio: 2)
and (orientation: landscape) {
    // style here
}
/* iPhone6 */

/* Portrait and Landscape */
@media only screen
and (min-device-width: 375px)
and (max-device-width: 667px)
and (-webkit-min-device-pixel-ratio: 2) {
    // style here
}

/* Portrait  */
@media only screen
and (min-device-width : 375px)
and (max-device-width : 667px)
and (orientation : landscape)
and (-webkit-min-device-pixel-ratio : 2){
    // style here
}

/* Landscape */
@media only screen
and (min-device-width : 375px)
and (max-device-width : 667px)
and (orientation : portrait)
and (-webkit-min-device-pixel-ratio : 2) {
    // style here
}

/* iPhone 6+  */

/* Portrait and Landscape */
@media only screen
and (min-device-width: 414px)
and (max-device-width: 736px)
and (-webkit-min-device-pixel-ratio: 3) {
    // style here
}

/* Portrait */
@media only screen
and (min-device-width: 414px)
and (max-device-width: 736px)
and (-webkit-min-device-pixel-ratio: 3)
and (orientation: portrait) {
    // style here
}

/* Landscape */
@media only screen
and (min-device-width: 414px)
and (max-device-width: 736px)
and (-webkit-min-device-pixel-ratio: 3)
and (orientation: landscape) {
    // style here
}
/* iPad mini  */

/* Portrait and Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (-webkit-min-device-pixel-ratio: 1) {
    // style here
}

/* Portrait */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: portrait)
and (-webkit-min-device-pixel-ratio: 1) {
    // style here
}

/* Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: landscape)
and (-webkit-min-device-pixel-ratio: 1) {
    // style here
}

/*  iPad 1 and 2  */
/* Portrait and Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (-webkit-min-device-pixel-ratio: 1) {
    // style here
}

/* Portrait */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: portrait)
and (-webkit-min-device-pixel-ratio: 1) {
    // style here
}

/* Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: landscape)
and (-webkit-min-device-pixel-ratio: 1) {
    // style here
}

/*  iPad 3 ,iPad4 , iPad Air , iPad min2  */
/* Portrait and Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (-webkit-min-device-pixel-ratio: 2) {
    // style here
}

/* Portrait */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: portrait)
and (-webkit-min-device-pixel-ratio: 2) {
    // style here
}

/* Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: landscape)
and (-webkit-min-device-pixel-ratio: 2) {
    // style here
}


/* iPad All  */
/* Portrait and Landscape*/
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px) {
    // style here
}

/* Portrait */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: portrait) {
    // style here
}

/* Landscape */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
and (orientation: landscape) {
    // style here
}	
```
    
    
### 设备类型系统版本检测
```js
var u = navigator.userAgent ;

// iOS设备类型检测
var isiPhone = !!u.match(/iPhone/i) ;
var isiPad = !!u.match(/iPad/i) ;
var isiPod = !!u.match(/iPod/i) ;
var version = u.match(/OS\s([\d_]+)/) ;
version = version && version[1] && version[1].replace(/_/g , ".") ;

// iOS系统版本检测
var isiOS = isiPhone || isiPad || isiPod ;
var isiOS7 = isiOS && version[0] === "7" ;
var isiOS8 = isiOS && version[0] === "8" ;
var isiOS9 = isiOS && version[0] === "9" ;
```
### 监听设备旋转事件    
```js
window.addEventListener('orientationchange',function(e){
    var info = {
        portrait:false,
        home:''
    };
    switch (window.orientation){
        case 0:
            info.portrait = true ;
            info.home = 'down' ;
            break;
        case -90:
            info.portrait = false ;
            info.home = 'left' ;
            break;
        case 90:
            info.portrait = false ;
            info.home = 'right' ;
            break;
        case 180:
            info.portrait = true ;
            info.home = 'up' ;
            break;
    }

});
```
    
    
### 参考

+ [iPhone 6 and 6 Plus Media Queries][1]    
+ [iPhone 6 Plus resolution confusion: Xcode or Apple's website? for development][2]
+ [The Ultimate Guide To iPhone Resolutions][3]
+ [Designing for iOS 9][4]
+ [Using media queries][5]
+ [iPhone 5 CSS media query][6]
+ [CSS Media Queries for iPads & iPhones][7]
+ [Media Queries for Standard Devices][8]
+ [Safari Supported CSS Rules][9]

[1]: http://stackoverflow.com/questions/25759046/iphone-6-and-6-plus-media-queries
[2]: http://stackoverflow.com/questions/25755443/iphone-6-plus-resolution-confusion-xcode-or-apples-website-for-development?rq=1
[3]: http://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
[4]: https://designcode.io/iosdesign-guidelines
[5]: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#-moz-device-pixel-ratio
[6]: http://stackoverflow.com/questions/12539697/iphone-5-css-media-query
[7]: http://stephen.io/mediaqueries/
[8]: https://css-tricks.com/snippets/css/media-queries-for-standard-devices/
[9]: https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariCSSRef/Articles/OtherStandardCSS3Features.html#//apple_ref/doc/uid/TP40007601-SW3