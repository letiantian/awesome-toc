# awesome-toc

awesome-toc是一个为网页生成目录的小工具，也支持回到顶部的功能。

![](./demo.gif)

## 用法

```js
<script type="text/javascript" src="/path/to/awesome-toc.min.js"></script>
<script type="text/javascript">
    $.awesome_toc({        
      autoDetectHeadings: true,
      enableToTopButton: true,
      title: "INDEX",
      css: {
          fontSize: "14px",
          largeFontSize: "18px",
      },
    });
</script>
```


## 依赖
jQuery。

在jquery 1.11和jquery 2.0中测试通过。

## 配置项

| 属性        | 类型           | 说明  |
| ------------- |-------------|--------|
| css.fontSize | string | 目录项字体大小，"90%"、"16px" |
| css.largeFontSize      | string      |   标题字体大小 |
| css.fontColor | string      |    基本的字体颜色，"#999"、"red" |
| css.activeFontColor|string| 标题和当前active的目录项的字体颜色 |
| css.lineHeight | string| 目录项的行高|
| css.backgroundColor | string | 目录的背景颜色 |
| css.zIndex | int | 目录的z-index | 
| title | string | 标题 |
| windowMinWidth | int | 单位px。当窗口宽度低于此值时，不显示目录 |
| sideBarId | string | 目录的id，最好带随机字符，以防和网页中id冲突/混淆 |
| sideBarWidth | string | 目录的宽度 |
| sideBarPrefix | string | 目录中生成的元素的class的前缀，<br/>最好带随机字符，以防和网页中id冲突/混淆|
| headingList | array of string | 识别哪些h*标签 |
| enableToTopButton | bool |是否显示“返回顶部”的按钮|
| enableToc | bool | 是否生成目录 |
| overlay | bool | 是否以遮盖方式显示目录 |
| autoDetectHeadings | bool | 是否自动探测使用哪些h*标签生成目录 |
| contentId | string | 若不为空，则根据这个id对应的元素的内容生成目录 |
| contentClass | string | 若不为空，则根据这个class对应<br/>的第一个元素的内容生成目录 |
| displayNow | bool| 是否立即显示目录|
| topOffset | int | 单位px。有些网页的菜单是固定在顶部的，<br/>占有一定空间，该属性值和菜单的高度应该一致。<br/>如果设置的合理，点击目录项时，<br/>页面滚动后，标题不会被覆盖 |
| itemPrefix | string | 每个菜单项目的前缀，例如"- " |



## 小书签

> 目前相关js文件放在[这里](http://hi.letiantian.me/toc)，但是不稳定。 **正在找合适的CDN来托管**

在浏览器中创建书签，url使用下面的内容：

```js
javascript:(function(){var a=function(a){var b=document.createElement("script");b.setAttribute("src",a+"?time="+Date.parse(new Date)),document.body.appendChild(b)};a("http://hi.letiantian.me/toc/loader.min.js")})();
```

示例：

![](./bookmarklet.gif)


## 其他

界面设计上参考了[hexo-theme-next](https://github.com/iissnan/hexo-theme-next)。

目前的小书签托管在github的pages服务中，在https的网站中使用可能会遇到“已阻止载入混合活动内容”这类问题。





