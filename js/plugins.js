/* METRO UI TEMPLATE
/* Copyright 2013 Thomas Verelst, http://metro-webdesign.info*/
/* MOUSEWHEEL Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 */(function(a,b){function e(d){var f=d||window.event,g=[].slice.call(arguments,1),h=0,i=0,j=0;return d=a.event.fix(f),d.type="mousewheel",f.wheelDelta&&(h=f.wheelDelta/120),f.detail&&(f.type==c[2]?(this.removeEventListener(c[0],e,!1),h=-f.detail/42):h=-f.detail/3),j=h,f.axis!==b&&f.axis===f.HORIZONTAL_AXIS&&(j=0,i=-1*h),f.wheelDeltaY!==b&&(j=f.wheelDeltaY/120),f.wheelDeltaX!==b&&(i=-1*f.wheelDeltaX/120),g.unshift(d,h,i,j),(a.event.dispatch||a.event.handle).apply(this,g)}var c=["DOMMouseScroll","mousewheel","MozMousePixelScroll"];if(a.event.fixHooks)for(var d=c.length;d;)a.event.fixHooks[c[--d]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=c.length;a;)this.addEventListener(c[--a],e,!1);else this.onmousewheel=e},teardown:function(){if(this.removeEventListener)for(var a=c.length;a;)this.removeEventListener(c[--a],e,!1);else this.onmousewheel=null}}})(jQuery);
 /* jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/ */


/*Browser detection, var $.browser.name checks the broser name, var $.browser.version checks version */

(function($){$.browserTest=function(a,z){var u='unknown',x='X',m=function(r,h){for(var i=0;i<h.length;i=i+1){r=r.replace(h[i][0],h[i][1]);}return r;},c=function(i,a,b,c){var r={name:m((a.exec(i)||[u,u])[1],b)};r[r.name]=true;r.version=(c.exec(i)||[x,x,x,x])[3];if(r.name.match(/safari/)&&r.version>400){r.version='2.0';}if(r.name==='presto'){r.version=($.browser.version>9.27)?'futhark':'linear_b';}r.versionNumber=parseFloat(r.version,10)||0;r.versionX=(r.version!==x)?(r.version+'').substr(0,1):x;r.className=r.name+r.versionX;return r;};a=(a.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?m(a,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,''],['Chrome Safari','Chrome'],['KHTML','Konqueror'],['Minefield','Firefox'],['Navigator','Netscape']]):a).toLowerCase();$.browser=$.extend((!z)?$.browser:{},c(a,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));$.layout=c(a,/(gecko|konqueror|msie|opera|webkit)/,[['konqueror','khtml'],['msie','trident'],['opera','presto']],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);$.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||[u])[0].replace('sunos','solaris')};if(!z){$('html').addClass([$.os.name,$.browser.name,$.layout.name].join(' '));}};$.browserTest(navigator.userAgent);})(jQuery);

(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}(navigator.appName === 'Microsoft Internet Explorer')&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

timers = []; // all timers for plugins, use unique id please!
$tile = {}
$group = {inactive:[]};
$arrows = {};
$page = {}
$hashed = {};
$subNav = {};
$mainNav = {};

/*The plugin system */
$.extend({ /* Check for duplicate plugins */
	plugin:function(events,newfunction){
		for(i in events){
			if(newfunction.hasOwnProperty(i)){
				newfunction[i+"2"] = newfunction[i];
    			delete newfunction[i];
				if(events == $init){
					console.log("Metro UI template warning: duplicate $init function found.");
				}
			}
		}
		$.extend(true,events,newfunction);
	}
});

$events = {
run : function(w){for(i in w){w[i]();}},
siteLoad:function(){$events.run($siteLoad);},
fixScrolling:function(){$events.run($fixScrolling);},
mainNavInit:function(){$events.run($mainNavInit);},
mainNavActive:function(){$events.run($mainNavActive);},
mainNavSet:function(){$events.run($mainNavSet);},
subNavMake:function(){$events.run($subNavMake);},
subNavActive:function(){$events.run($subNavActive);},
subNavSet:function(){$events.run($subNavSet);},
hashChangeBegin:function(){$events.run($hashChangeBegin);},
hashChangeEnd:function(){$events.run($hashChangeEnd);},
beforeTilesShow:function(){$events.run($beforeTilesShow);},
afterTilesShow:function(){$events.run($afterTilesShow);},
onTilesPrepare:function(){$events.run($onTilesPrepare);},
tileGroupChangeBegin:function(){$events.run($tileGroupChangeBegin);},
tileGroupChangeEnd:function(){$events.run($tileGroupChangeEnd);},
beforeSubPageShow:function(){$events.run($beforeSubPageShow);},
afterSubPageShow:function(){$events.run($afterSubPageShow);},
recalcScrolling:function(){$events.run($recalcScrolling);},
fixScrolling:function(){$events.run($fixScrolling);},
onScroll:function(){$events.run($onScroll);},
bgScroll:function(){$events.run($bgScroll);},
arrowsPlaced:function(){$events.run($arrowsPlaced);},
windowResizeBegin:function(){$events.run($windowResizeBegin);},
windowResizeEnd:function(){$events.run($windowResizeEnd);},
makeLink:function(){$events.run($makeLink);},
makeLinkHref:function(){$events.run($makeLinkHref);},
transformLinks:function(){$events.run($transformLinks);}, // ?
panelOpen:function(){$events.run($panelOpene)},
toColumn:function(){$events.run($toColumn)},
toSmall:function(){$events.run($toSmall)},
toFull:function(){$events.run($toFull)}
}

/*EVENT TRIGGERS */
$init = {};
$siteLoad = {};
$windowResizeBegin = {};
$windowResizeEnd = {};
$beforeTilesShow = {};
$afterTilesShow = {};
$onTilesPrepare = {};
$tileGroupChangeBegin = {};
$tileGroupChangeEnd = {};
$beforeSubPageShow = {};
$afterSubPageShow = {};
$arrowsPlaced = {};
$bgScroll = {};
$onScroll = {};
$fixScrolling = {};
$recalcScrolling = {};
$subNavMake = {};
$subNavActive = {};
$mainNavInit = {};
$mainNavActive = {};
$mainNavSet = {};
$makeLink = {};
$makeLinkHref = {};
$transformLinks = {}; //?
$hashChangeBegin = {};
$hashChangeEnd = {};
$panelOpen = {};
$toColumn = {};
$toSmall = {};
$toFull = {};

/* scroll tile */
scrollTile = function(id,texts,s,n){	
	if($page.current == "home" && !scrolling){
		var $id = $("#tileScroll"+id).children(".divScroll")
		$id.stop().animate({opacity: 0,'margin-top': '+=15'},250,function(){
			$id.css("margin-top",-15).css("opacity",0)
			.html(texts[n])
			.animate({opacity: 1,'margin-top': '+=15'},250,function(){
				$id.css("margin-top",0).css("opacity",1);
			})
		});	
		n = (n+2>texts.length) ? 0 : n+1;
	}
	setTimeout(function(){scrollTile(id,texts,s,n)},s,n);
}

$(document).on("mouseenter",".tileImg",function(){
	if($(this).hasClass("top")){
		$(this).find(".imgDesc").stop().show(400);
	}else if($(this).hasClass("bottom")){
		$(this).find(".imgDesc").stop().slideDown(400);
	}
});
$(document).on("mouseleave",".tileImg",function(){	
	if($(this).hasClass("top")){
		$(this).find(".imgDesc").stop().hide(400);
	}else if($(this).hasClass("bottom")){
		$(this).find(".imgDesc").stop().slideUp(400);
	}
});
/* jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 * TERMS OF USE - jQuery Easing
 * Open source under the BSD License. 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. */
// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}
});