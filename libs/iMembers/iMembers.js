;(function(global) {
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
     * 人员列表主模板
     * @type {String}
     */
    var template = '<div class="members"><div class="title"><span>{{title}}</span></div><ul class="lists">{{membersHtml}}</ul></div>';

    /**
     * 人员item模板
     * @type {String}
     */
    var itemTpl =  '<li data-index="{{index}}">\
                        <div class="info head">\
                            <img src="{{imgUrl}}">\
                        </div>\
                        <div class="info text">\
                            <div class="name">{{name}}</div>\
                            <div class="hobby">\
                                <div class="hobby-tit">{{subtitle}}</div>\
                                <div class="hobby-text">{{hobby}}</div>\
                            </div>\
                        </div>\
                    </li>';

    /**
     * 默认缺省头像
     * @type {String}
     */
    var head = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwQEBAQFBQUFBQcHBgYHBwsICQgJCAsRCwwLCwwLEQ8SDw4PEg8bFRMTFRsfGhkaHyYiIiYwLTA+PlQBAwMDAwMDBAQEBAUFBQUFBwcGBgcHCwgJCAkICxELDAsLDAsRDxIPDg8SDxsVExMVGx8aGRofJiIiJjAtMD4+VP/CABEIAEYARgMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAQUGBwgJAgT/2gAIAQEAAAAA0UACN79tecmu5MXz3w9Yn4U+xUO8N36m8kSYzjmmyciajWgmod6cgW5c2nnISV+bufNUaT9fOj1MAAB//8QAGQEAAgMBAAAAAAAAAAAAAAAAAAIBAwQF/9oACAECEAAAAOsiWk48/TDCarCodpgD/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/9oACAEDEAAAAMVDVwaSKQH/xAA+EAABAwIEAwMJAREAAAAAAAABAgMEBQYABxESCBMhIjEyCRQgQVFhcZXTNBAVGDAzN0BCUlNXY2WBgqGi/9oACAEBAAE/APxalJSkqUQAASSfUBjIfg+au6mQLiv6RLiRJ6EuwaPHVyXltL6pdkud6ArvCE4qfBvw/S6euM3bj0RYR9pjzX0Oj+5UcZ9cPdZyXlR58aW5VbbnPcqNOWgIdjvEahiSE9NSPAsdFellfQYd1Zm2ZQ5oBi1GvQmXwe5SN4UpP+QGmFQ1RlmVuBS0ddgHqHQAYNWQoFIZI3dPFjPKzYtwZN3xAmLQWxQ5UlCiPA7ETzm1j3gpw0vmNoV3bkg+jSKtUKBV6dV6csImU2YxLjKPdzGFhadfcSNDjLnM+2c3LKi1ygu7vOUBEmMSOZDkAdtl4eojApssHcUp0SQT2scYmdFItawZ9lwJG+v3ExyFsjxw4S/yrrnsKx2EYAAGg9HJPIS7s7Kk/wCYLFPo0J0InVVxBWAs9eUwjpzHf9JxenDnnXkNWF3LlnU6xPgbAHHoYCZzYSNSmTGHZfRhfEtxUXPpRIlRqZlPHl7INDDcsn4hvsnFn8E9/wB30ioVq9K4/SK1OHNisLHn7xX+3PWT/wAoJIxfdiXRlrc8q3Lkh+bTo4CwUne0+0rwvMr/AFkK9Cj0eoXDWKdR6cjfNqUxmJGH8x5QQD8BrqcZbWZRcurepVsUlsIiUyJygvTq873uPL9qnFdo4muBMN3YrQgdND1wl9/eDvXqSNT6z8TjUY4tMsmL9y0n1aNHBrFsc2fEWB21xx9pY94Ke0MJUFAEHUEag/dywvONl3f9CuuRTDVEUl9bwh80M71ltSEneQrTaVa4k+UBRIbCDl0582H0sNce7bLqFjLtfZ/qo+lg+UJBH5uXfmw+lj8PNr+Hi/mo+niXx+R51PfgvZcOFp6OthY++qe5Y2/usIQltAQnolPRI9g9Q/RP/8QAJBEAAgECBAcBAAAAAAAAAAAAAQIAAxEQEyBBBCIxMkJRUmL/2gAIAQIBAT8AjuqC5iV0c26aOJB5TtEBLi3vExq7Fvz6hrHwULKT5i333wIvcTIpfMyKXzFRU7Rr/8QAGREAAgMBAAAAAAAAAAAAAAAAESAAARAw/9oACAEDAQE/AMCUoUw8P//Z';

    /**
     * 默认参数
     * @type {Object}
     */
    var _opts = {
        animation: true,        // 是否使用动画
        delay: 150,             // 动画间隔时间
        title: '成员',           // 标题
        subtitle: '兴趣爱好'      // 副标题
    };

    var iMembers = function (opts) {
        // 验证参数
        if (!opts) {
            throw new Error('options can not be empty!');
        } else if (!opts.el) {
            throw new Error('options.el can not be empty!');
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

        this.opts = opts;

        this.init();
    };

    iMembers.prototype = {
        constructor: iMembers,

        /**
         * 初始化函数
         * @private
         */
        init: function () {
            this._render();
            this._bindEvent();
        },

        /**
         * 渲染函数
         * @private
         */
        _render: function () {
            // 获取主容器
            this.wrap = document.querySelector(this.opts.el);
            if (!this.wrap) {
                return;
            }

            // 拼装HTML
            var membersHtml = '';
            for (var i = 0; i < this.opts.data.length; i++) {
                var item = this.opts.data[i];
                membersHtml += itemTpl.replace('{{imgUrl}}', item.img).replace('{{name}}', item.name)
                .replace('{{index}}', i).replace('{{subtitle}}', this.opts.subtitle).replace('{{hobby}}', item.hobby);
            }
            var contentHtml = template.replace('{{title}}', this.opts.title).replace('{{membersHtml}}', membersHtml);

            // 插入到主容器当中
            this.wrap.innerHTML = contentHtml;

            // 保存ul，后面需要多个地方用到
            this.ulPanel = document.querySelector(this.opts.el + ' .members ul.lists');

            // 是否使用动画
            if (!this.opts.animation) {
                for (var i = 0; i < this.ulPanel.children.length; i++) {
                    this.ulPanel.children[i].style.opacity = 1;
                }
            } else {
                var self = this;
                var i = 0;
                var timer = setInterval(function () {
                    self.ulPanel.children[i].className += ' fade-in-down';
                    i++;
                    if (i === self.ulPanel.children.length) {
                        clearInterval(timer);
                    }
                }, this.opts.delay);
            }
        },

        /**
         * 初始化绑定基本操作事件
         * @private
         */
        _bindEvent: function () {
            var self = this;

            /**
             * 人员列表绑定点击事件
             * 采用事件委托的方式，可避免给每个li标签都绑定点击事件
             */
            var clickHandler = self._click = function (e) {
                var target = e.target;
                while (target.tagName !== 'LI') {
                    if (target === self.ulPanel){
                        target = null;
                        break;
                    }
                    target = target.parentNode;
                }
                if (target) {
                    var index = parseInt(target.getAttribute('data-index'));
                    if (self.opts.click) {
                        self.opts.click(self.opts.data[index]);
                    }
                }
            };
            self.ulPanel.addEventListener('click', clickHandler, false);

            /**
             * 绑定图片加载失败事件
             * 当图片加载失败的时候，使用默认图片
             */
            self.imgs = document.querySelectorAll(this.opts.el + ' img');
            for (var i = 0; i < self.imgs.length; i++) {
                self.imgs[i].onerror = function () {
                    this.src = head;
                }
            }
        },

        /**
         * 销毁当前实例，并从DOM当中移除
         * @public
         */
        destroy: function () {
            // 移除相关绑定事件
            this.ulPanel.removeEventListener('click', this._click);
            for (var i = 0; i < this.imgs.length; i++) {
                this.imgs[i].onerror = null;
            }
            // 从DOM当中移除
            this.wrap.removeChild(this.wrap.children[0]);
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
        module.exports = iMembers;
    } else if (typeof define === 'function' && define['amd']) {
        // 兼容AMD
        define(function () {
            return iMembers;
        });
    } else {
        global.iMembers = iMembers;
    }
})(window || this);
