### gf-test
目前只针对PC端及chrome浏览器(其余浏览器未做测试)

### iMembers

#### 介绍
* 采用flex布局，所以显示结果可以由挂在节点宽度控制一行显示多少个
* 头像图片加载失败会显示默认图片
* 兼容CommonJS、AMD

#### 使用方法
同时引入 `iMembers.css `和 `iMembers.js` 。

```javascript
var members = new iMembers({
    el: '#member-lists', // 挂在的DOM节点，必传
    animation: true, // 是否使用动画，默认使用
    delay: 200, // 每个item动画间隔事件，当animation为true时候有效，单位ms
    title: '优秀员工', // 列表主标题，e.g., 员工，嘉宾
    subtitle: '座右铭', // item父标签，e.g., 爱好，简介，座右铭
    data: [ // 列表展示的数据，必须是非空数组
        {
            name: 'dodolog', // 姓名
            hobby: '唱歌，听音乐，打篮球，街舞', // 爱好或者简介或者座右铭
            img: 'mock/images/dodolog-head.jpg' // 头像图片路径
        }
    ],
    click: function (item) { // 点击某个item出发的函数
        // 在这里做操作
    }
});
```
具体API方法请看源码。

### iAlbum

#### 介绍
* 实例挂在后不渲染大图，调用show方法后才渲染大图
* 显示多张大图，大图可水平拖拽
* 兼容CommonJS、AMD

#### 使用方法
同时引入 `iAlbum.css `和 `iAlbum.js` 。

```javascript
var album = new iAlbum({
    animation: true, // 是否使用动画，默认使用
    introduce: true, // 是都显示简介
    line: 5, // 简介文字行数，当introduce为true有效
    data: [ // 相册显示的数据，必须是非空数组
        {
            name: 'dodolog', // 姓名
            desc: '文字文字文字文字文字', // 简介
            thumb: 'mock/images/dodolog-id.jpg', // 相册缩略图
            pictures: [ // 相册大图的数据，必须是非空数组
                'mock/images/dodolog-big-1.jpg',
                'mock/images/dodolog-big-2.jpg',
                'mock/images/dodolog-big-3.jpg',
                'mock/images/dodolog-big-4.jpg',
                'mock/images/dodolog-big-5.jpg'
            ]
            // 可以有其他属性，e.g., 年龄，毕业院校
        }
    ],
    descFormat: function (item) { // 简介显示内容的自定义格式化行数，非必传，返回格式化内容，默认格式化是name和desc
        return '<span>' + item.name + '<span><span>' + item.age + '<span>';
    }
});

// 显示出相册，并渲染name属性为dodolog的大图
// 也可通过其他属性操作显示，e.g., show('id', userId);
album.show('name', 'dodolog');
```
具体API方法请看源码。
