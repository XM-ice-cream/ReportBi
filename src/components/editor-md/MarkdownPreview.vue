<template>
    <div class="outBox">
      <link rel="stylesheet" href="/static/editor.md-master/css/editormd.preview.css">
      <div id="sidebar" style="padding: 0;overflow: scroll;">
        <h1>Table of Contents</h1>
        <div class="markdown-body editormd-preview-container" id="custom-toc-container">#custom-toc-container</div>
      </div>
      <div id="editor" class="editMain" >
        <textarea id="content" v-model="markdownToHtml" />
      </div>
    </div>
  </template>
  
  <script>
  import scriptjs from 'scriptjs'
  export default {
    name: 'MarkdownPreview',
    props: {
      value: {
        type: String,
        required: false,
        default: ''
      }
    },
    data() {
      return {
        editor: null
      }
    },
    computed: {
      markdownToHtml() {
        return this.value
      }
    },
    mounted() {
      // 初始化
      //this.initEditor()
    },
    methods: {
      initEditor() {
        (async() => {
          await this.fetchScript('/static/editor.md-master/jquery.min.js')
          await this.fetchScript('/static/editor.md-master/lib/marked.min.js')
          await this.fetchScript('/static/editor.md-master/lib/prettify.min.js')
          await this.fetchScript('/static/editor.md-master/lib/raphael.min.js')
          await this.fetchScript('/static/editor.md-master/lib/underscore.min.js')
          await this.fetchScript('/static/editor.md-master/lib/sequence-diagram.min.js')
          await this.fetchScript('/static/editor.md-master/lib/flowchart.min.js')
          await this.fetchScript('/static/editor.md-master/lib/jquery.flowchart.min.js')
          await this.fetchScript('/static/editor.md-master/editormd.min.js')
  
          await this.$nextTick(() => {
            this.editor = window.editormd.markdownToHTML('editor', {
                path: '/static/editor.md-master/lib/',
                emoji: true,
                htmlDecode      : "style,script,iframe",  // you can filter tags decode
                //toc             : false,
                tocm            : true,    // Using [TOCM]
                tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
                //gfm             : false,
                //tocDropdown     : true,
                // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
                emoji           : true,
                taskList        : true,
                tex             : true,  // 默认不解析
                flowChart       : true,  // 默认不解析
                sequenceDiagram : true,  // 默认不解析
            })
          })
          console.log(this.editor);
          // const content = this.value
          // // 设置值, 另一种方法
          // const contentDoc = document.getElementById('content')
          // contentDoc.value = content
        })()
      },
      fetchScript(url) {
        return new Promise((resolve) => {
          scriptjs(url, () => {
            resolve()
          })
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .outBox{
    display: flex;
  }
  .editMain{
    padding: 0;
    width: 70%;
    padding: 10px;
  }
  #sidebar{
    width: 20%;
  }
  .markdown-body {
      padding-left: 0;
  }
  .editormd-preview-container{
    text-align: left;
    font-size: 14px;
    line-height: 1.6;
    padding: 20px;
    background-color: #fff;
}
  </style>
  
  