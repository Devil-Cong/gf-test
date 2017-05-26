;(function (global) {
    'use strict';

    /**
     * 判断是否数组
     * @param  {*}  o
     * @return {Boolean}
     */
    var isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    /**
     * 判断元素是否有某个class
     * @param  {HTMLElement}  el
     * @param  {String}  cls
     * @return {Boolean}
     */
    var hasClass = function (el, cls) {
        return el.className.match(new RegExp('(\\s|^)(' + cls + ')(\\s|$)'));
    };

    /**
     * 为元素添加class
     * @param {HTMLElement} el
     * @param {String} cls
     */
    var addClass = function (el, cls) {
        if (!hasClass(el, cls)) {
            el.className += ' ' + cls;
        }
    };

    /**
     * 移除元素的某个class
     * @param  {HTMLElement} el
     * @param  {String} cls
     */
    var removeClass = function (el, cls) {
        if (hasClass(el, cls)) {
            el.className = el.className.replace(RegExp('(\\s|^)(' + cls + ')(\\s|$)'), '$3');
        }
    };

    /**
     * 获取元素当前某些带有px单位的属性值
     * @param  {HTMLElement} el
     * @param  {String} prop
     * @return {Integer}
     */
    var getPxProp = function (el, prop) {
        var valStr = getComputedStyle(el, null)[prop] || '';
        return !!~valStr.indexOf('px') ? parseInt(valStr.replace('px', '')) : 0;
    };

    /**
     * 产生ID字符串
     * @return {String}
     */
    var getIdStr = function () {
        return 'ialbum-' + Math.ceil(Math.random() * 100000);
    };

    /**
     * 相册的主体HTML模板
     * @type {String}
     */
    var template =  '<div class="ialbum-content">\
                        <div class="close"></div>\
                        <div class="dire prev"></div>\
                        <div class="dire next"></div>\
                        <div class="photo">\
                            <div class="box p-top">\
                                <div class="introduce"></div>\
                                <ul>{{picHtml}}</ul>\
                            </div>\
                            <div class="box p-bottom">\
                                <ul>{{thumbHtml}}</ul>\
                            </div>\
                        </div>\
                    </div>';

    /**
     * 图片显示的模板
     * @type {String}
     */
    var imgTpl = '<li class="{{className}}" data-index="{{index}}" style="background-image: url({{imgUrl}})"></li>';

    /**
     * 简介的模板
     * @type {String}
     */
    var descTpl = '<div class="text"><span>{{name}}</span>{{desc}}</div>';

    /**
     * 默认参数
     * @type {Object}
     */
    var _opts = {
        animation: true,        // 是否开启动画
        introduce: true,       // 是否显示简介
        line: 3                // 简介显示行数，当introduce为true有效
    };

    var iAlbum = function (opts) {
        // 验证参数
        if (!opts) {
            throw new Error('options can not be empty!');
        } else if (!isArray(opts.data)) {
            throw new Error('options.data must be a array!');
        } else if (opts.data.length === 0) {
            throw new Error('options.data can not be a empty array!');
        }

        // 合并参数
        for (var key in _opts) {
            if (opts[key] === undefined && _opts.hasOwnProperty(key)) {
                opts[key] = _opts[key];
            }
        }
        // 当前相册的ID
        this.id = getIdStr();

        this.opts = opts;
        // 缩略图默认选中的下标
        this.thumbIndex = 0;
        // 缩略图当前区域
        this.thumbStart = 0;
        this.thumbEnd = 5;
        // 是否绑定过简介显示隐藏
        this.descEvent = false;

        this.init();
    };

    iAlbum.prototype = {
        constructor: iAlbum,

        /**
         * 初始化函数
         * @public
         */
        init: function () {
            this._render();
            this._setting();
            this._bindEvent();
        },

        /**
         * 显示某个人对应相片
         * key，value组合的条件
         * @param  {String} key
         * @param  {String|Number|Boolean} value
         * @public
         */
        show: function (key, value) {
            // 根据条件，在data里面查找对应的下标
            var index = this.opts.data.findIndex(function (val) {
                return val[key] === value;
            });
            // 显示出相册
            removeClass(this.wrap, 'hide');
            if (this.opts.animation) {
                addClass(this.wrap, 'zoom-in');
            } else {
                this.wrap.style.opacity = 1;
            }

            // 选中某一个
            this.select(index);
            // 缩略图滚动
            this._move();
        },

        /**
         * 隐藏关闭当前相册
         * @private
         */
        hide: function () {
            var self = this;
            if (self.opts.animation) {
                addClass(self.wrap, 'zoom-out');
                setTimeout(function () {
                    addClass(self.wrap, 'hide');
                    removeClass(self.wrap, 'zoom-in zoom-out');
                }, 500);
            } else {
                addClass(self.wrap, 'hide');
            }
        },

        /**
         * 缩略图往左移动一个item
         * @public
         */
        next: function () {
            if (this.thumbEnd < this.opts.data.length - 1) {
                this._move('next');
            }
        },

        /**
         * 缩略图往右移动一个item
         * @public
         */
        prev: function () {
            if (this.thumbStart > 0) {
                this._move('prev');
            }
        },

        /**
         * 渲染相册函数，只渲染基本框架及缩略图
         * 简介及大图片等用户调用show方法才渲染显示
         * @private
         */
        _render: function () {
            this.wrap = document.createElement('div');
            this.wrap.id = this.id;
            addClass(this.wrap, 'ialbum hide');

            var thumbHtml = '';
            for(var i = 0; i < this.opts.data.length; i++) {
                var item = this.opts.data[i];
                thumbHtml += imgTpl.replace('{{imgUrl}}', item.thumb).replace('{{index}}', i);
            }
            template = template.replace('{{ID}}', this.id).replace('{{thumbHtml}}', thumbHtml);

            this.wrap.innerHTML = template;
            document.body.appendChild(this.wrap);
        },

        /**
         * 统一设置对某些常用的DOM节点的引用
         * @private
         */
        _setting: function () {
            this.closeBtn = document.querySelector('#'+ this.id + ' .ialbum-content .close');
            this.nextBtn = document.querySelector('#'+ this.id + ' .ialbum-content .dire.next');
            this.prevBtn = document.querySelector('#'+ this.id + ' .ialbum-content .dire.prev');
            this.thumbLists = document.querySelector('#'+ this.id + ' .box.p-bottom ul');
            this.picLists = document.querySelector('#'+ this.id + ' .box.p-top ul');
            this.descPanel = document.querySelector('#'+ this.id + ' .box.p-top .introduce');
        },

        /**
         * 当show的item不在当前缩略图的可视区域
         * 则调整缩略图可视区域内容至包含当前item
         * @param  {String} flag [next|prev]
         * @private
         */
        _move: function (flag) {
            // 点击上一个下一个按钮的移动
            if (flag) {
                if (flag === 'next') {
                    this.thumbEnd++;
                    this.thumbStart++;
                } else {
                    this.thumbStart--;
                    this.thumbEnd--;
                }
            } else {
                if (this.thumbIndex < this.thumbStart) {
                    // 缩略图需要向右移动
                    this.thumbStart = this.thumbIndex;
                    this.thumbEnd = this.thumbStart + 5;
                } else if (this.thumbIndex > this.thumbEnd) {
                    // 缩略图向左移动
                    this.thumbEnd = this.thumbIndex;
                    this.thumbStart = this.thumbEnd - 5;
                }
            }

            // 获取一个thumb的移动单位
            var item = this.thumbLists.children[0];
            var marginRight = getPxProp(item, 'marginRight');
            var width = item.offsetWidth + marginRight;

            if (this.opts.animation) {
                addClass(this.thumbLists, 'use-anim');
            }

            var left =  width * this.thumbStart;
            this.thumbLists.style.left = '-' + left + 'px';
        },

        /**
         * 缩略图选中某一个
         * @param  {Number} index
         * @public
         */
        select: function (index) {
            // 如果index异常，index重置为上次的下表
            if (index < 0) {
                index = this.thumbIndex;
            }

            if (this.opts.animation) {
                // 取消上次选中的
                removeClass(this.thumbLists.children[this.thumbIndex], 'select bounce-in');
                // 选中当前
                addClass(this.thumbLists.children[index], 'select bounce-in');
            } else {
                // 取消上次选中的
                removeClass(this.thumbLists.children[this.thumbIndex], 'select');
                // 选中当前
                addClass(this.thumbLists.children[index], 'select');
            }

            // 渲染图片
            this._renderPic(index);
        },

        /**
         * 渲染简介及大图
         * @param  {[type]} index
         * @private
         */
        _renderPic: function (index) {
            // 获取item数据
            var item = this.opts.data[index];

            if (!isArray(item.pictures)) {
                throw new Error('pictures must be a array!');
            } else if (item.pictures.length === 0){
                throw new Error('pictures can not be empty!');
            }

            var picHtml = '';
            for (var i = 0; i < item.pictures.length; i++) {
                var imgUrl = item.pictures[i];
                picHtml += imgTpl.replace('{{imgUrl}}', imgUrl).replace('{{index}}', i)
                .replace('{{className}}', this.opts.animation ? 'hide-opacity' : '');
            }
            this.picLists.innerHTML = picHtml;

            if (this.opts.animation) {
                var self = this;
                var i = 0;
                var timer = setInterval(function () {
                    addClass(self.picLists.children[i], 'fade-in-right');
                    i++;
                    if (i === self.picLists.children.length) {
                        clearInterval(timer);
                    }
                }, 150);
            }

            // 需要显示简介
            if (this.opts.introduce) {
                var descHtml = '';
                // 用户自定义格式化简介
                if (this.opts.descFormat) {
                    descHtml = this.opts.descFormat(item);
                } else {
                    descHtml = descTpl.replace('{{name}}', item.name).replace('{{desc}}', item.desc);
                }
                if (this.opts.animation) {
                    addClass(this.descPanel, 'fade-in-up');
                } else {
                    this.descPanel.style.opacity = 1;
                }
                this.descPanel.innerHTML = descHtml;
                // 设置用户自定义的行数
                document.querySelector('#' + this.id + ' .p-top .introduce .text').style.webkitLineClamp = this.opts.line;
                // 绑定简介隐藏显示事件
                if (!this.descEvent) {
                    this.descEvent = true;
                    this._bindDescEvent();
                }

            } else {
                addClass(this.descPanel, 'hide');
            }

            this.thumbIndex = index;

            // 将图片滚动置于最左边
            this.picLists.style.left = '0px';
            this._bindPicDrag();
        },

        /**
         * 绑定简介显示隐藏事件
         * @return {[type]} [description]
         */
        _bindDescEvent: function () {
            var self = this;
            var enterHanlder = self._enter = function (e) {
                if (self.opts.animation) {
                    addClass(self.descPanel, 'fade-out-down');
                } else {
                    addClass(self.descPanel, 'hide');
                }
            };

            var leaveHanlder = self._leave = function (e) {
                if (self.opts.animation) {
                    removeClass(self.descPanel, 'fade-out-down');
                } else {
                    removeClass(self.descPanel, 'hide');
                }
            };
            self.picLists.addEventListener('mouseenter', enterHanlder, false);
            self.picLists.addEventListener('mouseleave', leaveHanlder, false);
        },

        /**
         * 给大图绑定拖拽事件
         * @private
         */
        _bindPicDrag: function () {
            var self = this;
            // 先解绑原来绑定的事件
            self.picLists.removeEventListener('mousedown', self._start);
            self.picLists.removeEventListener('mouseleave', self._end);

            // 获取外部可视区域宽度
            var outerWidth = getPxProp(document.querySelector('#' + self.id + ' div.p-top'), 'width');
            // 通过获取单个图片宽度，margin值，以图片数目，计算图片总长度
            var picWidth = self.picLists.children[0].offsetWidth;
            var marginRight = getPxProp(self.picLists.children[0], 'marginRight');
            var count = self.picLists.children.length;
            var picsWidth = picWidth * count + marginRight * (count - 1);
            // 计算可以移动最大位移
            var maxDiff = 0 - (picsWidth - outerWidth);

             var start = self._start = function (e) {
                // 鼠标按下，记录鼠标X位置及当前元素的位置
                self.startX = e.pageX;
                self.left = getPxProp(self.picLists, 'left');

                self.picLists.addEventListener('mousemove', move, false);
                self.picLists.addEventListener('mouseup', end, false);
            };

            var move = function (e) {
                e.preventDefault();
                // 获取移动过程当中的鼠标X位置
                var currentX = e.pageX;
                // 计算与开始时的距离差
                var diffX = currentX - self.startX;
                // 计算当前图片应该移动的位置
                var moveX = self.left + diffX;
                // 修正图片移动的位置，防止超出可以移动范围
                if (moveX < maxDiff) {
                    moveX = maxDiff;
                }
                if (moveX > 0) {
                    moveX = 0;
                }
                self.picLists.style.left = moveX + 'px';
            }

            var end = this._end = function (e) {
                self.picLists.removeEventListener('mousemove', move);
                self.picLists.removeEventListener('mouseup', end);
            }

            self.picLists.addEventListener('mousedown', start, false);
            // 避免鼠标拖动的时候已开可视区域，回来图片会跟着移动
            self.picLists.addEventListener('mouseleave', end, false);

        },

        /**
         * 初始化时绑定基本操作事件
         * @private
         */
        _bindEvent: function () {
            var self = this;
            // 绑定关闭按钮事件
            var hideHanlder = self._hide = function (e) {
                self.hide();
            };
            self.closeBtn.addEventListener('click', hideHanlder, false);

            // 绑定缩略图往左移一个item
            var nextHanlder = self._next = function (e) {
                self.next();
            };
            self.nextBtn.addEventListener('click', nextHanlder, false);

            // 绑定缩略图往右移一个item
            var prevHanlder = self._prev = function (e) {
                self.prev();
            }
            self.prevBtn.addEventListener('click', prevHanlder, false);


            /**
             * 缩略图绑定点击事件
             * 采用事件委托的方式，可避免给每个缩略图都绑定点击事件
             */
            var selectHanlder = self._select = function (e) {
                var target = e.target;
                while (target.tagName !== 'LI') {
                    if (target === self.thumbLists){
                        target = null;
                        break;
                    }
                    target = target.parentNode;
                }
                if (target) {
                    var index = parseInt(target.getAttribute('data-index'));
                    self.select(index);
                }
            };
            self.thumbLists.addEventListener('click', selectHanlder, false);
        },

        /**
         * 销毁当前实例，并从DOM当中移除
         * @public
         */
        destroy: function () {
            // 移除相关绑定事件
            this.closeBtn.removeEventListener('click', this._hide);
            this.nextBtn.removeEventListener('click', this._next);
            this.prevBtn.removeEventListener('click', this._prev);
            this.thumbLists.removeEventListener('click', this._select);
            this.picLists.removeEventListener('mousedown', this._start);
            this.picLists.removeEventListener('mouseleave', this._end);
            this.picLists.removeEventListener('mouseenter', this._enter);
            this.picLists.removeEventListener('mouseleave', this._leave);
            // 从DOM当中移除
            document.body.removeChild(this.wrap);
            // 释放内存引用
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this[key] = null;
                }
            }
        }
    };

    // 兼容CommonJS
    if (typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports) {
        module.exports = iAlbum;
    } else if (typeof define === 'function' && define['amd']) {
        // 兼容AMD
        define(function () {
            return iAlbum;
        });
    } else {
        global.iAlbum = iAlbum;
    }
})(window || this);
