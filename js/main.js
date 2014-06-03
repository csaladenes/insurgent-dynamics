/* METRO UI TEMPLATE
/* Copyright 2013 Thomas Verelst, http://metro-webdesign.info*/

/*This file does the basic things for the template like loading pages and uses functinos of functions.js*/
$show = {
	prepareTiles: function(){ /* Prepare for showing the tilepage */
		$events.onTilesPrepare();
		$("#subNav").fadeOut(hideSpeed);
		$("#centerWrapper").fadeOut(hideSpeed,function(){
			$show.tiles();
		}); 
	},
	tiles: function(){ /* Show homepage */
		$("#adminEditButton").attr("href","admin/index.html?p=../config/tiles.php"+$hashed.parts[0]); // for admin editor things
		$tileContainer = $("#tileContainer")	
		$allTiles = $tileContainer.children(".tile");
		$tileContainer.show().children().hide();
		$("#contentWrapper, #subNavWrapper").hide();
		$("#centerWrapper").show();
		
		document.title = siteTitle+" | "+siteTitleHome;
		
		if($hashed.parts.length==1 || ($group.current = inArrayNCindex($hashed.parts[1].addSpaces(),$group.titles)) == -1){$group.current = 0;}
		$("html, body").animate({"scrollLeft":getMarginLeft($group.current)},1);
		$page.current = "home";
		
		$tileContainer.addClass("loading")
		$events.beforeTilesShow();
		
		if($group.inactive.opacity==1){ /* Code for effects */
			if($group.showEffect==0){	
				$allTiles.each(function(index) {
					var $this = $(this)
					if($this.hasClass("group0")){
						$this.delay(50*index).show(300);
					}else{
						$this.delay(50*index).fadeIn(300);
					}		
				});
			}else if($group.showEffect==1){
				$allTiles.fadeIn(700);
			}else if($group.showEffect==2){
				$allTiles.show(700);
			}
			$tileContainer.children(".groupTitle").fadeIn(700);
		}else{
			$allTiles.not(".group"+$group.current).fadeTo(700,$group.inactive.opacity);
			$tileContainer.children(".group"+$group.current).removeClass("inactiveTile").fadeTo(700,1);
			$tileContainer.children(".groupTitle").fadeTo(500,$group.inactive.opacity);
			$("#groupTitle"+$group.current).fadeTo(500,1);
			if(!$group.inactive.clickable){
				$tileContainer.unbind("click.inactiveTile");
				$tileContainer.on("click.inactiveTile",".tile",function(){
					var $this = $(this)
					if(!$this.hasClass("group"+$group.current)){
						var thisClass = $this.attr("class")
						$group.goTo(parseInt(thisClass.substr((thisClass.indexOf("group")+5),3)));
						return false;
					}
				});
				$allTiles.not(".group"+$group.current).addClass("inactiveTile");
			}
		}

		setTimeout(function(){
			$tileContainer.removeClass("loading")
			$arrows.place(400); // must ALWAYS happen after ALL tiles are showed! (in this case, tiles after 700ms, arrows after 350+800 ms
		 	$(window).resize(); // check the scrollbars now, same as ^
			$events.afterTilesShow();
		},701);
		
		$mainNav.setActive();
		
		$(window).resize();
	},
	page:function(){ /* show a page with content */
		$("#adminEditButton").attr("href","admin/index.html?p="+$hashed.parts[0]);
		$content = $("#content")
		$("#tileContainer").hide();
		$("#centerWrapper").show();
		if($("#contentWrapper").css("display")=="none"){
			$("#contentWrapper, #subNavWrapper").fadeIn(700);
		}
		$content.html("<img src='themes/"+theme+"/img/primary/loader.gif' height='24' width='24'/>");
		$group.current = -1;
		$page.current = "loading";
		
		var title;
		if($hashed.parts[0].substr(0,4) == "url="){ // if the template already noticed the link was not in pageTitles array when generating the url
			title = $hashed.parts[0].substr(4).split(".")[0].addSpaces();
			url = $hashed.parts[0].substr(4);
		}else{ // url is OK
			var hashReq = $hashed.parts[0].addSpaces();
			var i = inArrayNCkey(hashReq,pageTitles); // find the corresponding array entry with title
			if(i!=-1){ // found!
				title = pageTitles[i];
				url = i;
			}else{ // not found! let's do a wild guess of the url!
				title = hashReq.split(".")[0];
				url = hashReq;
			}
		}
		
		$.ajax("pages/"+url+(typeof $hashed.get[1] != "undefined" ? "?"+$hashed.get[1] : "")).success(function(newContent,textStatus){	
			$content.fadeOut(50,function(){	
				$content.html(newContent);
				$page.current = url;
				$subNav.make();
				transformLinks();
				$events.beforeSubPageShow();
				$content.show(500,function(){
					$events.afterSubPageShow();
					$(window).resize();
				});
				if (typeof _gaq !== "undefined" && _gaq !== null) {_gaq.push(['_trackPageview', "/#!/"+$hashed.parts[0]]); }
			});
		}).error(function(){
			title = "Page not Found";
			$content.html("<h2 class='margin-t-0'><br>We're sorry :(</h2>the page you're looking for is not found.").show(400);
			$subNav.setActive();
		})
		
		document.title = title+" | "+siteTitle;
		$(window).resize();
	}
}

$(window).hashchange(function(){
	$hashed.get = decodeURI(window.location.hash).replace("#!/","").replace("%21/index.html","").replace("#!","").replace("#","").split("?");
	$hashed.parts = $hashed.get[0].split("&"); 
	$events.hashChangeBegin();
	if($hashed.doRefresh){
		if($hashed.parts[0] == ""){ // homepage with tiles
			if($group.current == -1){ // no tiles shown
				if($page.current == ""){
					$show.tiles();
				}else{
					$show.prepareTiles();
				}
			}else{ // it must have been a tilegroup switch
				if($hashed.parts.length>1){
				}else if($group.current == 0){//we refresh the page
					$show.prepareTiles();
				}else{
					$group.goTo(0);
				}		
			}
		}else{ // page with content
			if($page.current == "home"){ // homepage with tiles
				$("#centerWrapper").fadeOut(hideSpeed,function(){
					$show.page();
				});
			}else if($page.current != ""){ // other content page
				$("#content").fadeOut(hideSpeed,function(){
					$show.page();
				});
			}else{ // nothing loaded yet
				$show.page();
			}
		}
	}

	$events.hashChangeEnd();
});


$(window).resize(function(){
	$events.windowResizeBegin();

	$tileContainer =  $("#tileContainer")

	/*Responsive tile layout */
	var windowWidth = $(window).width()/scaleSpacing
	if(windowWidth < 3.2){
		if(!$("body").hasClass("column")){
			$("body").removeClass("full").removeClass("small").addClass("column");
			$page.layout = "column";
			$("nav").prepend("<div id='navTitle'>Menu</div>").appendTo("body").children("a").css("display","none")
			if(autoRearrangeTiles){
				var t = 0;
				for(i=0;i<$group.count;i++){
					var spaceUsed = [];
					$tileContainer.children("#groupTitle"+i).css("margin-left",0).css("margin-top",t);
					$tileContainer.children(".group"+i).each(function(){
						var j = spaceUsed.length
						if($(this).width()>(scale)){ // tile with width 2 or wider
							if(autoResizeTiles && $(this).width()>scaleSpacing+scale){
								$(this).width(scaleSpacing+scale)
							}
							$(this).css("margin-left",0).css("margin-top",(45+j*scaleSpacing+t));
							for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
								spaceUsed[j+l]="11";
							}
						}else{ // tile with width 1
							var f = true;
							for(var k in spaceUsed){
								k = parseInt(k);
								var pos = spaceUsed[k].indexOf("0")
								if(pos>-1){
									
									var e = true;
									for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
										if(typeof spaceUsed[k+l] !== "undefined" && spaceUsed[k+l].charAt(pos) != "0"){
											e = false;
											break;
										}
									}
									
									if(e){// the tile will fit!
										$(this).css("margin-left",pos*scaleSpacing).css("margin-top",(45+k*scaleSpacing+t));
										for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
											if(typeof spaceUsed[parseInt(k)+l] === "undefined"){
												var c = "00";
											}else{
												var c = spaceUsed[k+l];	
											}
											spaceUsed[k+l] = c.substr(0, pos) + "1"+ c.substr(pos +1);
											
										}
										f = false;
										break;
									}
								}
							}
							if(f){ // the tile doesn't fit anywhere, let's create a new row
								$(this).css("margin-left",0).css("margin-top",(45+j*scaleSpacing+t));
								for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
									spaceUsed[j+l]="10";
									//j++;
								}
							}
						}
					});
					t += (spaceUsed.length+0.5)*scaleSpacing
				}
			}
			setTimeout(function(){
				recalcScrolling();
				fixScrolling();
			},500);
			$arrows.place(400);	
			$events.toColumn();	
		}
		if($page.current == "home"){
			$tileContainer.show();
		}	
		setTileOpacity();	
	}else if(autoRearrangeTiles && windowWidth < rearrangeTreshhold+1.2){		
		if(!$("body").hasClass("small") || ($("body").hasClass("small") && Math.ceil(windowWidth) != $page.smallWidth)){
			$("body").removeClass("column").removeClass("full").addClass("small");
			$page.layout = "small";
			$page.smallWidth = (Math.ceil(windowWidth)>rearrangeTreshhold ? rearrangeTreshhold+1 : Math.ceil(windowWidth) );
			$("nav").appendTo("#headerCenter").children("a").css("display","inline-block")
			$("#navTitle").remove()
			var w =$page.smallWidth-1;
			if($group.direction=="horizontal"){
				for(var i in $group.spacing){
					$group.spacing[i] = w+1;
				}
				for(i=0;i<$group.count;i++){
					$("#groupTitle"+i).css("margin-left",i*scaleSpacing*(w+1)).css("margin-top",0);
					var spaceUsed = []
					var j = 0; // the row we'll be working on
					var t = getMarginLeft(i);
					$tileContainer.children(".group"+i).each(function(){
						$(this).css("width",parseInt($(this).data("pos").split("-")[2]));
						
						var j = spaceUsed.length;
						var thisw = Math.round(($(this).width()-scale)/scaleSpacing+1); //tile width in tiles
						if(thisw>w){ // if tile is as width as the max width or wider	
							if(autoResizeTiles){
								$(this).width(scaleSpacing*(w-1)+scale);
							}
							$(this).css("margin-left",t).css("margin-top",45+j*scaleSpacing);
							var s = strRepeat(w,"1")
							for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
								spaceUsed[j+l] = s;
							}	
						}else{ // fit it somewhere!
							var f = true;
							for(var k in spaceUsed){
								k = parseInt(k);
								var s = strRepeat(thisw,"0");
								var pos = spaceUsed[k].indexOf(s);
								if(pos>-1){
									var e = true
									for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
										if(typeof spaceUsed[k+l] !== "undefined" && spaceUsed[k+l].substr(pos,thisw) != s){
											e = false;
											break;
										}
									}
									if(e){ // yeps, tile will fit!
										$(this).css("margin-left",t+pos*scaleSpacing).css("margin-top",45+k*scaleSpacing);
										var s = strRepeat(thisw,"1");
										for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
											if(typeof spaceUsed[k+l] === "undefined"){
												var c = strRepeat(w,"0");
											}else{
												var c = spaceUsed[k+l];	
											}
											spaceUsed[k+l] = c.substr(0, pos) + s + c.substr(pos + thisw);
										}
										f=false;
										break;
									}
								}
							}
							if(f){	
								$(this).css("margin-left",t).css("margin-top",(45+j*scaleSpacing));
								var s = strRepeat(thisw,"1")+strRepeat(w-thisw,"0");
								for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
									spaceUsed[j+l]=s;
								}
							}
						}
					});
				}
			}else if($group.direction=="vertical"){
				var j = 0; // the max row we've worked on
				for(i=0;i<$group.count;i++){
					var spaceUsed = []
					$("#groupTitle"+i).css("margin-left",0).css("margin-top",j*scaleSpacing);

					$tileContainer.children(".group"+i).each(function(){
						var thisw = Math.round(($(this).width()-scale)/scaleSpacing+1); //tile width in tiles
						$(this).css("width",parseInt($(this).data("pos").split("-")[2]));
						if(thisw>w){ // if tile is as width as the max width or wider	
							if(autoResizeTiles){
								$(this).width(scaleSpacing*(w-1)+scale);
							}
							$(this).css("margin-left",0).css("margin-top",45+(spaceUsed.lenght+j)*scaleSpacing);
							var s = strRepeat(w,"1")
							for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
								spaceUsed[spaceUsed.lenght] = s;
							}	
						}else{ // fit it somewhere!
							var f = true;
							for(var k in spaceUsed){
								k = parseInt(k);
								var s = strRepeat(thisw,"0");
								var pos = spaceUsed[k].indexOf(s);
								if(pos>-1){
									var e = true
									for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
										if(typeof spaceUsed[k+l] !== "undefined" && spaceUsed[k+l].substr(pos,thisw) != s){
											e = false;
											break;
										}
									}
									if(e){ // yeps, tile will fit!
										$(this).css("margin-left",pos*scaleSpacing).css("margin-top",45+(j+k)*scaleSpacing);
										var s = strRepeat(thisw,"1");
										for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
											if(typeof spaceUsed[k+l] === "undefined"){
												var c = strRepeat(w,"0");
											}else{
												var c = spaceUsed[k+l];	
											}
											spaceUsed[k+l] = c.substr(0, pos) + s + c.substr(pos + thisw);
										}
										f=false;
										break;
									}
								}
							}
							if(f){	
								$(this).css("margin-left",0).css("margin-top",(45+(spaceUsed.length+j)*scaleSpacing));
								var s = strRepeat(thisw,"1")+strRepeat(w-thisw,"0");
								for(l=0;l<=($(this).height()-scale)/scaleSpacing;l++){
									spaceUsed[spaceUsed.length+l]=s;
								}
							}								
						}	
					});
					j += spaceUsed.length+0.5;
				}
			}
			setTimeout(function(){
				recalcScrolling();
				fixScrolling();
			},500);
			setTileOpacity();
			$arrows.place(400);
			$events.toSmall();
		}
	}else{
		if(!$("body").hasClass("full")){
			$("body").removeClass("column").removeClass("small").addClass("full");
			$page.layout = "full";
			$("nav").appendTo("#headerCenter").children("a").css("display","inline-block")
			$("#navTitle").remove()
			$group.spacing = $group.spacingFull.slice();
			if($page.current == "home"){
				$("#tileContainer").children(".tile").each(function(){
					var pos = $(this).data("pos").split("-");
					$(this).css("margin-top",parseInt(pos[0])).css("margin-left",parseInt(pos[1])).css("width",parseInt(pos[2]));
				});
				if($group.direction=="horizontal"){
					for(i=0;i<$group.count;i++){
						$("#groupTitle"+i).css("margin-left",getMarginLeft(i)).css("margin-top",0);
					}
				}else{
					for(i=0;i<$group.count;i++){
						$("#groupTitle"+i).css("margin-left",0).css("margin-top",getMarginLeft(i));
					}
				}
			}else{
				$tileContainer.html(tileContainer);
			}
			setTimeout(function(){
				recalcScrolling();
				fixScrolling();
			},500);
			setTileOpacity();
			$arrows.place(400);	
			$events.toFull();
		}
		if($page.current == "home"){
			$tileContainer.show();
		}
	}	
	
	/*Check mousewheel */
	if(!mouseScroll || $group.direction == "vertical" || $page.current != 'home' || $page.layout == "column" || (disableGroupScrollingWhenVerticalScroll && $(document).height()>$(window).height())){	/*Scrolling on pages and home */
		$(document).unbind("mousewheel");	
	}else{
		$(document).bind("mousewheel", function(event, delta) { /* Mouse scroll to move tilepages */		
			if(!scrolling){
				 if(delta>0){
					 $group.goLeft();
				 }else{
					 $group.goRight();
				 }
			}
			event.preventDefault();
		});
	}
	
	/* Change menu if page is too small */
	if($("#headerWrapper").height()>$("#headerTitles").height()*1.3){		
		$("nav").find("img").hide();
	}else{
		$("nav").find("img").show();
	}
	
	/* Adapt wrapper to header height */
	$("#wrapper").css("padding-top",$("#headerWrapper").height())

	/* BG SCROLLING */
	rightSpace = $("#bgImage").width()-$(window).width();
	bgScroll = rightSpace/$group.count;
	if(bgScroll>bgMaxScroll){bgScroll=bgMaxScroll;};
	scrollBg();
	
	/*Fix scrolling */
	
	$events.windowResizeEnd();
});

/* To prevent scroll bugs */
$(window).scroll(function(){
	if(scrollHeader && $group.direction == "horizontal"){
		$("header").css("top",-$(document).scrollTop());
	}
	
	if(!scrolling && $page.current == "home"){
		var scrollLeft = $(window).scrollLeft()/scaleSpacing;
	
		var diffSpacing = [];
		var t = 0; // temp var 
		diffSpacing[0] = scrollLeft;
		for(i=1;i<$group.spacing.length;i++){
			t += $group.spacing[i-1];
			diffSpacing[i] = Math.abs(t-scrollLeft);
		}
		var t = 999;
		var n = 0;
		for(var i in diffSpacing){
			if(diffSpacing[i]<t){
				t=diffSpacing[i];
				n = i;
			}
		}
		if($group.current != n){
			$group.current = parseInt(n);
			if(typeof setHash != "undefined"){
				clearTimeout(setHash);
			}
			setHash = setTimeout(function(){
				window.location.hash = "&"+$group.titles[parseInt($group.current)].toLowerCase().stripSpaces();
				$arrows.place(400);
			},300);
			
			scrollBg();
			$mainNav.setActive();
			setTileOpacity();
		}
		$events.onScroll();		
	}	
});

setTileOpacity = function(){
	if($group.inactive.opacity==1 || $page.layout == "column"){ // makes the inactive tilegroups transparent
			$tileContainer.children().not(".navArrows").fadeTo(0,1);
		}else{
			$tileContainer.children(".tile,.groupTitle").not(".group"+$group.current).stop().fadeTo(500,$group.inactive.opacity);
			$tileContainer.children(".group"+$group.current+", #groupTitle"+$group.current).removeClass("inactiveTile").stop().fadeTo(500,1);
			if(!$group.inactive.clickable){ // if this function is activatd, clicking on an inactive tilegroup will go to that tilegroup
				$tileContainer.unbind("click.inactiveTile");
				$tileContainer.on("click.inactiveTile",".tile",function(){
					var $this = $(this)
					if(!$this.hasClass("group"+$group.current)){
						var thisClass = $this.attr("class")
						$group.goTo(parseInt(thisClass.substr((thisClass.indexOf("group")+5),3)));
						return false;
					}
				});
				$tileContainer.children(".tile").not(".group"+$group.current).addClass("inactiveTile");
			}
		}
}

window.onload = function(){
	$tileContainer  = $("#tileContainer");
	
	$events.siteLoad();
		
	/* for fixing dimension issues */
	for(i=0;i<$group.count;i++){
		var mostRightGr = -999;
		$tileContainer.children(".group"+i).each(function(){
			
			/*For good scrolling */
			var thisRight = parseInt($(this).css("margin-left"))+$(this).width(); // GLOBAL
			if(thisRight>mostRight){
				mostRight=thisRight;
			}
			var thisDown= parseInt($(this).css("margin-top"))+$(this).height();
			if(thisDown>mostDown){
				mostDown=thisDown;
			}
			thisRightGr = parseInt($(this).css('margin-left'))+$(this).width()  // FOR THIS GROUP 
			if(thisRightGr > mostRightGr){
				mostRightGr = thisRightGr
			}
			$arrows.rightArray[i]=mostRightGr;
			
			/* For nice urls with nice transitions */
			if(typeof $(this).attr("href") != "undefined"){
				$(this).attr("href",$(this).attr("href").replace("?p=","#!/"));
			}		
		})				
	}	
	tileContainer = $("#tileContainer").html();
	
	/*For good scrolling */
	fixScrolling();
	
	/* make links for mainnav for navigation */
	$mainNav.init();
	
	/*Start page rendering */
	setTimeout(function(){
		$(window).hashchange();
	},20);
	$(window).resize();
};