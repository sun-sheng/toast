#toast
notification for web app
### Demo
http://sun-sheng.github.io/toast/demo/index.html
### INSTALL
    bower install ui-toast --save    
### USE
Reference these files in your index.html

```html
<link rel="stylesheet" href="path/to/bower_components/toast/dist/toast.min.css"/>
<script src="path/to/bower_components/toast/dist/toast.min.js"></script>
```
### API
#### show(options)
options 会继承 defaultOptions
<table>
    <thead>
    <tr>
        <th>名称</th>
        <th>格式</th>
        <th>说明</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>title</td>
        <td>string | html</td>
        <td>toast 的标题</td>
    </tr>
    <tr>
        <td>text</td>
        <td>string | html</td>
        <td>toast 的内容</td>
    </tr>
    <tr>
        <td>type</td>
        <td>string </td>
        <td>toast 的类型[success|error|warn|info|default]</td>
    </tr>
    <tr>
        <td>duration</td>
        <td>number</td>
        <td>toast 显示的时长(ms)</td>
    </tr>
    <tr>
        <td>icon</td>
        <td>html|boolean</td>
        <td>
            toast 显示的图标，false 或者 空字符串时，不显示 icon，样式会有调整
        </td>
    </tr>
    <tr>
        <td>position</td>
        <td>string</td>
        <td>
            toast 显示的位置 'x y'
            <ul>
            <li>移动端忽略 x</li>
            <li>x: left center right</li>
            <li>y: top center bottom</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>distinct</td>
        <td>boolean</td>
        <td>
            是否清除重复的 toast
        </td>
    </tr>
    <tr>
        <td>showCloseBtn</td>
        <td>boolean</td>
        <td>
            是否显示关闭按钮，移动端忽略
        </td>
    </tr>
    <tr>
        <td>click</td>
        <td>function</td>
        <td>
            点击 toast 的回调函数，移动端忽略
        </td>
    </tr>
    </tbody>
</table>

#### hide(mix)
<br/>mix 为 $toast.show() 的返回值

#### clear()
<br/>清除所有的 toast

#### success(title, [text|options, [text, options]])
<br/>$toast.show 的快捷调用，type 限定为 success
#### error(title, [text|options, [text, options]])
<br/>$toast.show 的快捷调用，type 限定为 error
#### warn(title, [text|options, [text, options]])
<br/>$toast.show 的快捷调用，type 限定为 warn
#### info(title, [text|options, [text, options]])
<br/>$toast.show 的快捷调用，type 限定为 info

#### config(defaultOptions)
<br/> 设置默认的配置项，配置类容参考 $toast.show
