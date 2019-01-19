(function ($) {

    var DEBUG = false;

    var log = function(msg) {
        if (DEBUG) {
            console.log(msg);
        }
    };

    var scrollVar = {};

    var baseConfig = {
        css: {
            fontSize: "90%",
            largeFontSize: "120%",
            fontColor: "#999",  // similar to grey
            activeFontColor: "#87daff",  // similar to cyan
            lineHeight: "1.8",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 999999,
        },
        title: "文章目录",
        windowMinWidth: 100,        // 单位px，窗口宽度小于该值时，不显示目录
        sideBarId: "sidebar-toc-Ik4D",
        sideBarWidth: "16em",
        sideBarPrefix: "sidebar-toc-Ik4D-",
        itemPrefix: "- ",
        headingList: ["h1", "h2", "h3", "h4", "h5", "h6"],
        enableToTopButton: true,
        enableToc: true,
        overlay: false,
        autoDetectHeadings: true,
        contentId: '',      // 如果有定义，则从这里把h*提取出来
        contentClass: '',   // 如果有定义，则从这里把h*提取出来。优先级低于contetnId
        displayNow: false,  // 马上显示目录
        topOffset: 0,       // px
    };


    var addToggleSidebar = function() {
        var toggleDiv = document.createElement("div");
        toggleDiv.setAttribute("id", baseConfig.sideBarId);
        toggleDiv.setAttribute("class", baseConfig.sideBarId);
        $("body").append(toggleDiv);
        $(toggleDiv).css({
            "background": baseConfig.css.backgroundColor+" none repeat scroll 0 0",  // similar to black
            "bottom": "0",
            "box-shadow": "0 2px 4px #000 inset",
            "position": "fixed",
            "right": "0",
            "top": "0",
            "width": "0",
            "z-index": ""+baseConfig.css.zIndex,
            "color": baseConfig.css.fontColor,
            "overflow": "auto",
            "font-size": baseConfig.css.fontSize,
            "text-align": "left",
        });
        generateTableOfContents();
        enableMenuScrollEvent();
    };


    var generateTableOfContents = function(documentRef) {
        var documentRef = documentRef || document;

        contentRef = documentRef.body;
        if (baseConfig.contentClass.length > 0) {
            contentRef = document.getElementsByClassName(baseConfig.contentClass)[0];
        }
        if (baseConfig.contentId.length > 0) {
            contentRef = document.getElementById(baseConfig.contentId);
        }

        log(contentRef);

        var toc = documentRef.getElementById(baseConfig.sideBarId);

        var title = documentRef.createElement("div");
        $(title).css({
            "text-align": "center",
            "border-bottom-color": baseConfig.css.activeFontColor,
            "color": baseConfig.css.activeFontColor,
            "border-width": "0 0 1.5px 0",
            "border-style": "solid",
            "font-size": baseConfig.css.largeFontSize,
            "padding": "8px 0",
        });

        title.textContent=baseConfig.title;
        toc.appendChild(title);

        var headingList = baseConfig.headingList; // 若为空，[].slice.call会报错
        if (headingList.length > 0) {
            var headings = [].slice.call(contentRef.querySelectorAll(headingList.join(", ")));
            headings.forEach(function (heading, index) {
                var anchor = documentRef.createElement("a");
                anchor.setAttribute("name", "" + baseConfig.sideBarPrefix + index);
                anchor.setAttribute("id", "" + baseConfig.sideBarPrefix + index);
                heading.parentNode.insertBefore(anchor, heading);

                var link = documentRef.createElement("a");
                link.setAttribute("href", "#"+ baseConfig.sideBarPrefix + index);
                link.textContent = baseConfig.itemPrefix + heading.textContent;   // html标签会被去掉

                $(link).click(function(e){
                    $(this).parent().parent().find("a").css({"color": baseConfig.css.fontColor});
                    $(this).css({"color": baseConfig.css.activeFontColor});
                    var offsetTop = $($(this).attr("href")).offset().top - baseConfig.topOffset;
                    disableMenuScrollEvent();
                    $('html, body').stop().animate(
                        {   
                            scrollTop: offsetTop 
                        },
                        {
                            duration: 300,
                            complete: enableMenuScrollEvent,
                        }
                    );
                    e.preventDefault();
                });

                var div = documentRef.createElement("div");
                $(div).css({
                   "padding-left": getIndent(heading.tagName.toLowerCase(), headingList, 20),
                   "text-align": "left",
                });

                div.appendChild(link);
                toc.appendChild(div);
                
            });
        }


        $("#"+baseConfig.sideBarId+" div").css({
            "margin": "0 12px",
        });

        var linkSelector = "#"+baseConfig.sideBarId+" a, ";
        linkSelector += "#"+baseConfig.sideBarId+" a:hover, ";
        linkSelector += "#"+baseConfig.sideBarId+" a:visited";
        // console.log(linkSelector);
        $(linkSelector).css({
            "color": baseConfig.css.fontColor, 
            "word-wrap": "break-word",
            "text-decoration": "none",
            "line-height": baseConfig.css.lineHeight,
        });
    };


    var getIndent = function(currentHeading, headingList, baseIndent) {
        var position = 0;
        for (; position < headingList.length; position++) {
            if (currentHeading !== headingList[position]) 
                continue;
            else
                break;
        }
        if (position >= headingList.length) {
            position = 0;
        }

        return "" + (position*baseIndent) + "px";
    };


    var addToggleButton = function() {
        var toggleBtn = document.createElement("div");
        toggleBtn.setAttribute('id', baseConfig.sideBarPrefix+'toggleBtn');
        $(toggleBtn).css({
            "background": "#222 none repeat scroll 0 0",
            "bottom": "55px",
            "cursor": "pointer",
            "height": "15px",
            "line-height": "0",
            "padding": "5px",
            "position": "fixed",
            "right": "50px",
            "width": "15px",
            "z-index": ""+(baseConfig.css.zIndex+1),
            
        });

        for (var i=0; i<3; i++) {
            var line = document.createElement("span");
            $(line).css({
                "background": "#87daff none repeat scroll 0 0",
                "display": "inline-block",
                "height": "2px",
                "margin-top": "2px",
                "position": "relative",
                "vertical-align": "top",
                "width": "100%",
            }).appendTo(toggleBtn);
        }
        
        $("body").append(toggleBtn);

        toggleBtn.onclick = toggleButtonClickListener;
    };


    var toggleButtonClickListener = function() { 
        log("in toggleButtonClickListener: overlay " + baseConfig.overlay);
        if ($(window).width() < baseConfig.windowMinWidth) {
            return;
        }
        var sideBar = $("#"+baseConfig.sideBarId);
        // console.log(sideBar);    

        if (sideBar.hasClass(baseConfig.sideBarPrefix+"active")) {   // 隐藏
            sideBar.removeClass(baseConfig.sideBarPrefix+"active");
            $(sideBar).animate({
                "width": "0",
            });
            if(!baseConfig.overlay) {
                $("body").animate({
                    "margin-right":"0",
                });
            }

        } else {  // 显示
            sideBar.addClass(baseConfig.sideBarPrefix+"active");
            $(sideBar).animate({
                "width": baseConfig.sideBarWidth,
            });
            if(!baseConfig.overlay) {
                $("body").animate({
                    "margin-right":baseConfig.sideBarWidth,
                });
            }

        }
    };


    var addToTopButton = function() {
        var toTopBtn = document.createElement("div");
        toTopBtn.setAttribute('id', baseConfig.sideBarPrefix+'toTopBtn');
        $(toTopBtn).css({
            "background": "#222 none repeat scroll 0 0",
            "bottom": "25px",
            "cursor": "pointer",
            "height": "15px",
            "line-height": "15px",
            "padding": "5px",
            "position": "fixed",
            "right": "50px",
            "width": "15px",
            "z-index": ""+(baseConfig.css.zIndex+1),
            "color": "#fff",
            "font-size": "16px",
            "text-align": "center",
        }).html("<span style=\"margin: 0 auto\">&#9650;</span>");

        toTopBtn.onclick = function() {
            $("html, body").animate({scrollTop: 0}, 600);
        };

        $("body").append(toTopBtn);
    };

    var scrollHandler = function() {
        // log("scroll");
        var fromTop = $(this).scrollTop()+10;

        var cur = scrollVar.scrollItems.map(function(){
            if ($(this).offset().top < fromTop)
                return this;
        });

        // Get the id of the current element
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        if (scrollVar.lastId !== id) {
            scrollVar.lastId = id;
            scrollVar.menuItems.css({"color": baseConfig.css.fontColor});
            scrollVar.menuItems.filter("[href=#"+id+"]").css({"color": baseConfig.css.activeFontColor});
        }
    };

    var disableMenuScrollEvent = function() {
        $(window).off( "scroll", scrollHandler );
    };

    var enableMenuScrollEvent = function() {
        $(window).scroll( scrollHandler );
    };

    var getScope = function() {
        var _scope = 'body';
        if (baseConfig.contentClass.length > 0) {
            _scope = '.' + baseConfig.contentClass;
        }
        if (baseConfig.contentId.length > 0) {
            _scope = '#' + baseConfig.contentId;
        }
        return $(_scope);
    };


    // 把第一个出现次数大于等于threshold的h*放入数组的第一个元素，
    // 之后的就看存不存在，存在就放进去最多放level个
    var getNiceHeadingTags = function(firstThreshold, level) {
        firstThreshold = firstThreshold || 1;
        level = level || 6;
        var allHeadingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        scope = getScope();
        var result = [];
        for (var idx=0; idx < allHeadingTags.length; idx++) {
            heading = allHeadingTags[idx];
            if (result.length == 0){
                if (scope.find(heading).length >= firstThreshold) {
                    result.push(heading);
                }
            } else {
                if ($(heading).length >= 1) {
                    result.push(heading);
                } 
            }

            if (result.length >= level) break;
        }
        return result;
    };

    var compactHeadingTags = function(headingList) {
        scope = getScope();

        var result = [];
        for (var idx=0; idx < headingList.length; idx++) {
            heading = headingList[idx];
            if (scope.find(heading).length > 0) {
                result.push(heading.toLowerCase());
            } 
        }
        return result;
    };

    var isToggleBtnExist = function() {
        if ($('#'+baseConfig.sideBarPrefix+'toggleBtn').length == 0) 
            return false;
        else
            return true;
    };

    var isToTopBtnExist = function () {
        if ($('#'+baseConfig.sideBarPrefix+'toTopBtn').length == 0) 
            return false;
        else
            return true;
    };

    // 插件
    $.extend({
        awesome_toc: function(config) {
            $.extend(true, baseConfig, config);

            baseConfig.contentId = baseConfig.contentId.trim();
            baseConfig.contentClass = baseConfig.contentClass.trim();

            if (baseConfig.autoDetectHeadings) {
                baseConfig.headingList = getNiceHeadingTags();
            }
            
            baseConfig.headingList = compactHeadingTags(baseConfig.headingList);


            if (baseConfig.enableToc && !isToggleBtnExist()) {
                addToggleSidebar();
                addToggleButton();

                scrollVar.lastId = '';
                scrollVar.sideBar = $("#"+baseConfig.sideBarId),
                scrollVar.menuItems = scrollVar.sideBar.find("a"),
                scrollVar.scrollItems = scrollVar.menuItems.map(function(){  
                    var item = $($(this).attr("href"));
                    if (item.length) { return item; }
                });

                log(scrollVar);

            }

            if (baseConfig.enableToTopButton && !isToTopBtnExist()) {
                addToTopButton();
            }

            if (baseConfig.displayNow) {
                toggleButtonClickListener();
            }
        }
    });


})(jQuery);
