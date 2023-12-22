const defaultValue = `# Editor.md

![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)

![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)

**目录 (Table of Contents)**

[TOCM]


# Heading 1
## Heading 2               
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
# Heading 1 link [Heading link](https://github.com/pandao/editor.md "Heading link")
## Heading 2 link [Heading link](https://github.com/pandao/editor.md "Heading link")
### Heading 3 link [Heading link](https://github.com/pandao/editor.md "Heading link")
#### Heading 4 link [Heading link](https://github.com/pandao/editor.md "Heading link") Heading link [Heading link](https://github.com/pandao/editor.md "Heading link")
##### Heading 5 link [Heading link](https://github.com/pandao/editor.md "Heading link")
###### Heading 6 link [Heading link](https://github.com/pandao/editor.md "Heading link")

#### 标题（用底线的形式）Heading (underline)

This is an H1
=============

This is an H2
-------------

### 字符效果和横线等
                
----

~~删除线~~ <s>删除线（开启识别HTML标签时）</s>
*斜体字*      _斜体字_
**粗体**  __粗体__
***粗斜体*** ___粗斜体___

上标：X<sub>2</sub>，下标：O<sup>2</sup>

**缩写(同HTML的abbr标签)**

> 即更长的单词或短语的缩写形式，前提是开启识别HTML标签时，已默认开启

The <abbr title="Hyper Text Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

### 引用 Blockquotes

> 引用文本 Blockquotes

引用的行内混合 Blockquotes
                    
> 引用：如果想要插入空白换行\`即<br />标签\`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。

### 锚点与链接 Links

[普通链接](http://localhost/)

[普通链接带标题](http://localhost/ "普通链接带标题")

直接链接：<https://github.com>

[锚点链接][anchor-id] 

[anchor-id]: http://www.this-anchor-link.com/

[mailto:test.test@gmail.com](mailto:test.test@gmail.com)

GFM a-tail link @pandao  邮箱地址自动链接 test.test@gmail.com  www@vip.qq.com

> @pandao

### 多语言代码高亮 Codes

#### 行内代码 Inline code

执行命令：\`npm install marked\`

#### 缩进风格

即缩进四个空格，也做为实现类似 \`<pre>\` 预格式化文本 ( Preformatted Text ) 的功能。

    <?php
        echo "Hello world!";
    ?>
    
预格式化文本：

    | First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |

#### JS代码　

\`\`\`javascript
function test() {
	console.log("Hello world!");
}
 
(function(){
    var box = function() {
        return box.fn.init();
    };

    box.prototype = box.fn = {
        init : function(){
            console.log('box.init()');

			return this;
        },

		add : function(str) {
			alert("add", str);

			return this;
		},

		remove : function(str) {
			alert("remove", str);

			return this;
		}
    };
    
    box.fn.init.prototype = box.fn;
    
    window.box =box;
})();

var testBox = box();
testBox.add("jQuery").remove("jQuery");
\`\`\`

#### HTML 代码 HTML codes

\`\`\`html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <meta name="keywords" content="Editor.md, Markdown, Editor" />
        <title>Hello world!</title>
        <style type="text/css">
            body{font-size:14px;color:#444;font-family: "Microsoft Yahei", Tahoma, "Hiragino Sans GB", Arial;background:#fff;}
            ul{list-style: none;}
            img{border:none;vertical-align: middle;}
        </style>
    </head>
    <body>
        <h1 class="text-xxl">Hello world!</h1>
        <p class="text-green">Plain text</p>
    </body>
</html>
\`\`\`

### 图片 Images

Image:

![](https://pandao.github.io/editor.md/examples/images/4.jpg)

> Follow your heart.

![](https://pandao.github.io/editor.md/examples/images/8.jpg)

> 图为：厦门白城沙滩

图片加链接 (Image + Link)：

[![](https://pandao.github.io/editor.md/examples/images/7.jpg)](https://pandao.github.io/editor.md/images/7.jpg "李健首张专辑《似水流年》封面")

> 图为：李健首张专辑《似水流年》封面
                
----

### 列表 Lists

#### 无序列表（减号）Unordered Lists (-)
                
- 列表一
- 列表二
- 列表三
     
#### 无序列表（星号）Unordered Lists (*)

* 列表一
* 列表二
* 列表三

#### 无序列表（加号和嵌套）Unordered Lists (+)
                
+ 列表一
+ 列表二
    + 列表二-1
    + 列表二-2
    + 列表二-3
+ 列表三
    * 列表一
    * 列表二
    * 列表三

#### 有序列表 Ordered Lists (-)
                
1. 第一行
2. 第二行
3. 第三行

#### GFM task list

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
    - [ ] GFM task list 3-1
    - [ ] GFM task list 3-2
    - [ ] GFM task list 3-3
- [ ] GFM task list 4
    - [ ] GFM task list 4-1
    - [ ] GFM task list 4-2
                
----
                    
### 绘制表格 Tables

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机      | $1600   |   5     |
| 手机        |   $12   |   12   |
| 管线        |    $1    |  234  |
                    
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell 

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

| Function name | Description                    |
| ------------- | ------------------------------ |
| \`help()\`      | Display the help window.       |
| \`destroy()\`   | **Destroy your computer!**     |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

| Item      | Value |
| --------- | -----:|
| Computer  | $1600 |
| Phone     |   $12 |
| Pipe      |    $1 |
                
----

#### 特殊符号 HTML Entities Codes

&copy; &  &uml; &trade; &iexcl; &pound;
&amp; &lt; &gt; &yen; &euro; &reg; &plusmn; &para; &sect; &brvbar; &macr; &laquo; &middot; 

X&sup2; Y&sup3; &frac34; &frac14;  &times;  &divide;   &raquo;

18&ordm;C  &quot;  &apos;

[========]


#### 反斜杠 Escape

\*literal asterisks\*

[========]
            
### 科学公式 TeX(KaTeX)

$$E=mc^2$$

行内的公式$$E=mc^2$$行内的公式，行内的$$E=mc^2$$公式。

$$x > y$$

$$\\(\\sqrt{3x-1}+(1+x)^2\\)$$
                    
$$\\sin(\\alpha)^{\\theta}=\\sum_{i=0}^{n}(x^i + \\cos(f))$$

多行公式：


### 分页符 Page break

> Print Test: Ctrl + P

[========]

### 绘制流程图 Flowchart

\`\`\`flow
st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op
\`\`\`

[========]
                    
### 绘制序列图 Sequence Diagram
                    
\`\`\`seq
Andrew->China: Says Hello 
Note right of China: China thinks\\nabout it 
China-->Andrew: How are you? 
Andrew->>China: I am good thanks!
\`\`\`

### End`

import {
	insertArticle
} from "@/api/bill-design-manage/article-manage.js";

const defaultConfig = {
    width: '100%',
    height: 600,
    path: '/static/editor.md-master/lib/',
    // theme: 'dark',
    // previewTheme: 'dark',
    // editorTheme: 'pastel-on-dark',
    markdown: defaultValue, // 默认填充内容
    lineWrapping: true, // 编辑框不换行
    codeFold: true, // 代码折叠
    placeholder: '请输入...',
    syncScrolling: true,
    saveHTMLToTextarea: true, // 保存 HTML 到 Textarea
    searchReplace: true,
    watch: true, // 实时预览
    htmlDecode: 'style,script,iframe|on*', // 开启 HTML 标签解析，为了安全性，默认不开启
    toolbar: true, // 工具栏
    previewCodeHighlight: true, // 预览 HTML 的代码块高亮，默认开启
    emoji: true,
    taskList: true,
    tocm: true, // Using [TOCM]
    tex: true, // 开启科学公式TeX语言支持，默认关闭
    flowChart: true, // 开启流程图支持，默认关闭
    sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
    dialogLockScreen: false, // 设置弹出层对话框不锁屏，全局通用，默认为true
    dialogShowMask: false, // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
    dialogDraggable: false, // 设置弹出层对话框不可拖动，全局通用，默认为true
    dialogMaskOpacity: 0.4, // 设置透明遮罩层的透明度，全局通用，默认值为0.1
    dialogMaskBgColor: '#000', // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
    imageUpload: true,
    imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'],
    imageUploadURL: 'http://localhost:8700/ftpfile/uploadimage',
    toolbarIcons : function() {
        return ["undo","redo",
        "|","bold","del","italic","quote","uppercase",
        "|","h1","h2","h3","h4","h5","h6",
        "|","list-ul","list-ol","hr",
        "|","link","reference-link","image","code","preformatted-text","code-block","table","datetime","emoji","html-entities","pagebreak",
        "|","goto-line","watch","preview","search","fullscreen","clear",
        "|","help","info"]
    },
    toolbarIconsClass : {
        save : "fa-floppy-o"  // 指定一个FontAawsome的图标类
    },
    // 自定义工具栏按钮的事件处理
    toolbarHandlers : {
        /**
         * @param {Object}      cm         CodeMirror对象
         * @param {Object}      icon       图标按钮jQuery元素对象
         * @param {Object}      cursor     CodeMirror的光标对象，可获取光标所在行和位置
         * @param {String}      selection  编辑器选中的文本
         */
        save : function(cm, icon, cursor, selection) {

            //var cursor    = cm.getCursor();     //获取当前光标对象，同cursor参数
            //var selection = cm.getSelection();  //获取当前选中的文本，同selection参数

            // 替换选中文本，如果没有选中文本，则直接插入
            //cm.replaceSelection("[" + selection + ":testIcon]");

            // 如果当前没有选中的文本，将光标移到要输入的位置
            // if(selection === "") {
            //     cm.setCursor(cursor.line, cursor.ch + 1);
            // }

            // this == 当前editormd实例
            //console.log("testIcon =>", this, cm, icon, cursor, selection);
            // 获取editor的html字符串
            // console.log(this.getPreviewedHTML());
            // 获取text 保存值信息
            console.log(cm.getTextArea().value)
            let Mvalue = cm.getTextArea().value
            let obj = {"title":Mvalue.slice(0,Mvalue.indexOf("\n")), "content": Mvalue};

            insertArticle(obj).then((res) => {
                if (res.code === 200) {
                    this.$Msg.success(`保存成功 `);
                    
                } else this.$Msg.error(`${this.$t("fail")}` + res.message);
            });

        }
    }
    // onload: function() {
    //    // this.fullscreen();
    //    // this.unwatch();
    //    // this.watch().fullscreen();
    //    // this.setMarkdown("#PHP");
    //    // this.width("100%");
    //    // this.height(480);
    //    // this.resize("100%", 640);
    // },
  }
  export {
    defaultConfig
  }