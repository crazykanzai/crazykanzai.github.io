$(function () {
    /**
     * 添加文章卡片hover效果.
     */
    let articleCardHover = function () {
        let animateClass = 'animated pulse';
        $('article .article').hover(function () {
            $(this).addClass(animateClass);
        }, function () {
            $(this).removeClass(animateClass);
        });
    };
    articleCardHover();

    /*菜单切换*/
    $('.sidenav').sidenav();

    /* 修复文章卡片 div 的宽度. */
    let fixPostCardWidth = function (srcId, targetId) {
        let srcDiv = $('#' + srcId);
        if (srcDiv.length === 0) {
            return;
        }

        let w = srcDiv.width();
        if (w >= 450) {
            w = w + 21;
        } else if (w >= 350 && w < 450) {
            w = w + 18;
        } else if (w >= 300 && w < 350) {
            w = w + 16;
        } else {
            w = w + 14;
        }
        $('#' + targetId).width(w);
    };

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        $('.content').css('min-height', window.innerHeight - 165);
    };

    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixPostCardWidth('navContainer');
        fixPostCardWidth('artDetail', 'prenext-posts');
        fixFooterPosition();
    };
    fixStyles();

    /*调整屏幕宽度时重新设置文章列的宽度，修复小间距问题*/
    $(window).resize(function () {
        fixStyles();
    });

    /*初始化瀑布流布局*/
    $('#articles').masonry({
        itemSelector: '.article'
    });

    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });

    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {
        $('#articleContent a').attr('target', '_blank');

        $('#articleContent img').each(function () {
            let imgPath = $(this).attr('src');
            $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>');
            // 图片添加阴影
            $(this).addClass("img-shadow img-margin");
            // 图片添加字幕
            let alt = $(this).attr('alt');
            let title = $(this).attr('title');
            let captionText = "";
            // 如果alt为空，title来替
            if (alt === undefined || alt === "") {
                if (title !== undefined && title !== "") {
                    captionText = title;
                }
            } else {
                captionText = alt;
            }
            // 字幕不空，添加之
            if (captionText !== "") {
                let captionDiv = document.createElement('div');
                captionDiv.className = 'caption';
                let captionEle = document.createElement('b');
                captionEle.className = 'center-caption';
                captionEle.innerText = captionText;
                captionDiv.appendChild(captionEle);
                this.insertAdjacentElement('afterend', captionDiv)
            }
        });
        $('#articleContent, #myGallery').lightGallery({
            selector: '.img-item',
            // 启用字幕
            subHtmlSelectorRelative: true
        });

        // progress bar init
        const progressElement = window.document.querySelector('.progress-bar');
        if (progressElement) {
            new ScrollProgress((x, y) => {
                progressElement.style.width = y * 100 + '%';
            });
        }
    };
    articleInit();

    $('.modal').modal();

    /*回到顶部*/
    $('#backTop').click(function () {
        $('body,html').animate({scrollTop: 0}, 400);
        return false;
    });

    /*监听滚动条位置*/
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    showOrHideNavBg($(window).scrollTop());
    $(window).scroll(function () {
        /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
        let scroll = $(window).scrollTop();
        showOrHideNavBg(scroll);
    });

    function showOrHideNavBg(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            $nav.removeClass('nav-transparent');
            $backTop.slideDown(300);
        }
    }

    	
	$(".nav-menu>li").hover(function(){
		$(this).children('ul').stop(true,true).show();
		 $(this).addClass('nav-show').siblings('li').removeClass('nav-show');
		
	},function(){
		$(this).children('ul').stop(true,true).hide();
		$('.nav-item.nav-show').removeClass('nav-show');
	})
	
    $('.m-nav-item>a').on('click',function(){
            if ($(this).next('ul').css('display') == "none") {
                $('.m-nav-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(100);
                $(this).parent('li').addClass('m-nav-show').siblings('li').removeClass('m-nav-show');
            }else{
                $(this).next('ul').slideUp(100);
                $('.m-nav-item.m-nav-show').removeClass('m-nav-show');
            }
    });

    // 初始化加载 tooltipped.
    $('.tooltipped').tooltip();
});

//黑夜模式提醒开启功能
setTimeout(function () {
    if ((new Date().getHours() >= 19 || new Date().getHours() < 7) && !$('body').hasClass('DarkMode')) {
        let toastHTML = '<span style="color:#97b8b2;border-radius: 10px;>' + '<i class="fa fa-bellaria-hidden="true"></i>晚上使用深色模式阅读更好哦。(ﾟ▽ﾟ)</span>'
        M.toast({ html: toastHTML })
    }
}, 2200);

//黑夜模式判断
if (localStorage.getItem('isDark') === '1') {
    document.body.classList.add('DarkMode');
    $('#sum-moon-icon').addClass("fa-sun").removeClass('fa-moon')
} else {
    document.body.classList.remove('DarkMode');
    $('#sum-moon-icon').removeClass("fa-sun").addClass('fa-moon')
}




/* 修复 PrismJS 代码块丢失复制按钮的问题 */
$(function() {
    // 等待页面加载完成
    setTimeout(function() {
        $('pre').each(function() {
            var $pre = $(this);
            
            // 1. 如果已经有复制按钮了，就不重复添加
            if ($pre.find('.copy-btn').length > 0) return;

            // 2. 找到 Matery 生成的代码块头部 (包含红黄绿圆点的那个条)
            // PrismJS 模式下，Matery 可能会生成一个 .code-header 或者是直接包裹在 .code-area 里
            var $header = $pre.parent().find('.code-header'); 
            
            // 如果找不到 header，说明可能是纯 PrismJS 结构，尝试直接找父级
            if ($header.length === 0) {
                 // 这种情况通常不需要特殊处理，直接把按钮浮动在 pre 右上角即可
            }

            // 3. 创建复制按钮元素
            var $copyBtn = $('<span class="copy-btn"><i class="fas fa-copy"></i></span>');
            
            // 4. 将按钮插入到 DOM 中
            // 优先插入到 code-header 的右侧（如果存在 header）
            if ($header.length > 0) {
                // 如果 header 里已经有显示语言的 span，插在它前面或后面
                $header.append($copyBtn);
            } else {
                // 如果没有 header，直接 append 到 pre 标签内，并用 CSS 绝对定位
                $pre.css('position', 'relative');
                $copyBtn.css({
                    'position': 'absolute',
                    'top': '5px',
                    'right': '10px',
                    'cursor': 'pointer',
                    'color': '#fff',
                    'z-index': '100'
                });
                $pre.append($copyBtn);
            }

            // 5. 绑定点击复制事件
            $copyBtn.click(function() {
                var codeToCopy = $pre.find('code').text();
                
                // 使用浏览器剪贴板 API
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(codeToCopy).then(function() {
                        M.toast({html: '复制成功！'}); // Matery 自带的提示框
                    }).catch(function(err) {
                        M.toast({html: '复制失败，请手动复制'});
                    });
                } else {
                    // 降级处理（旧浏览器）
                    var textarea = document.createElement('textarea');
                    textarea.value = codeToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    M.toast({html: '复制成功！'});
                }
            });
        });
    }, 1000); // 延迟 1 秒执行，确保 PrismJS 渲染完毕
});