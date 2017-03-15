## fis3-command-new ##


----------

> 该插件是结合fis3，通过cmd命令去初始化项目，新建page 或者 widget。
> 要是通过在fs，path模块对文件内容的拷贝，替换以及写入到具体位置。

![fyg new -h](http://img.blog.csdn.net/20170315142455954?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvWW9nb190/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast) 

```
1. -w widgetname   //新建vue格式的组件，widgetname 为widget名字
2. -p pagename     //新建page文件
3. -i              //初始化项目
4. --type          //选择新建page 是为pc格式还是wap格式，配合 -p使用，默认为pc

//例如
/*
1. fyg new -i
2. fyg new -p index [--type wap]
3. fyg new -w comp_header
*/
```
