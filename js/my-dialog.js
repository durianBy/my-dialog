/**
 * 提示信息弹出窗
 * 注：有按钮，需要手动关闭，点击有回调
 * 注：需要依赖插件<Bootstrap-modal><underscore>
 *
 * @author zhangbiying
 * @date 2016-04-05
 */
+function ($) {
    'use strict';

    var Notice = function (options) {
        this.options = $.extend(true, {}, Notice.DEFAULTS, options);
    };

    Notice.DEFAULTS = {
        type: 'info', // 提示类型，包括: 'warning', 'info', 'success', 'danger'
        height: '',
        width: 340,
        title: '信息提示', // 标题
        message: '', // 提示信息
        btnClick : false,//是否已点击按钮
        buttons: [{ // 按钮
            type: 'primary', // 按钮类型，包括: 'warning', 'info', 'success', 'danger'
            text: '确定', // 按钮信息
            close: true, // 点击按钮是否关闭弹出窗
            onclick: null // 按钮点击回调事件
        }, { // 按钮
            type: 'white', // 按钮类型，包括: 'warning', 'info', 'success', 'danger'
            text: '确定', // 按钮信息
            close: true, // 点击按钮是否关闭弹出窗
            onclick: null // 按钮点击回调事件
        }]
    };

    Notice.template = {
        notice: _.template([
            '<div class="modal fade modal-notice modal-notice-<%= notice.type %>" tabindex="-1" role="dialog">',
            '  <div class="modal-dialog iep-dialog" style="height: <%= notice.height %>px; width: <%= notice.width %>px;">',
            '    <div class="modal-content">',
            '      <div class="modal-header iep-dialog-head bg-primary">',
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '        <div class="modal-title iep-dialog-title"><%= notice.title%></div>',
            '      </div>',
            '      <div class="modal-body iep-dialog-body">',
            '        <span class="icon-Warning"></span>',
            '        <span class="text"><%= notice.message %></span>',
            '      </div>',
            '      <div class="modal-footer iep-dialog-footer">',
            '        <% for(var i=0; i< notice.buttons.length; i++) { %>',
            '          <button <% if(notice.buttons[i].close) { %> data-dismiss="modal" <% } %> class="btn btn-<%= notice.buttons[i].type %>"><%= notice.buttons[i].text%></button>',
            '        <% } %>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>',
        ].join(''))
    };

    Notice.prototype = {
        render: function () {
            var that = this;
            var buttons = this.options.buttons,
                noticeHtml = '',
                i;
            noticeHtml = Notice.template.notice({
                notice: this.options
            });
            // 将DOM元素添加到body上
            $('body').append(noticeHtml);

            // notice关闭后将添加上的元素移除
            $('body').find('.modal-notice')
                .modal('show')
                .on('shown.bs.modal', function (e) {
                    if($("object").length > 0){
                        if(!window.TEMPOBJECT){
                            window.TEMPOBJECT=[];
                        }
                        $("object:visible").each(function(i,el){
                            window.TEMPOBJECT.push($(el).attr("id"));
                        });
                        $("object:visible").hide();
                    }
                })
                .on('hidden.bs.modal', function (e) {
                    if(!that.options.btnClick && that.options.hideCallBack){
                        that.options.hideCallBack();
                    }
                    $(this).remove();
                    $.each(window.TEMPOBJECT,function(i,el){
                        $("#"+el).show();
                    });
                });

            // 遍历buttons，绑定onclick事件
            for (i = 0; i < buttons.length; i++) {
                if (buttons[i].onclick) {
                    // 在循环中绑定事件，使用闭包传递参数
                    (function (index) {
                        $('body').find('.modal-notice .modal-footer button').eq(index).on('click', function (event) {
                            that.options.btnClick = true;
                            buttons[index].onclick.call(this);
                            event.preventDefault();
                        });
                    })(i);
                }
            }
        },

        close: function () {
            $('body').find('.modal-notice').modal('hide');
        }
    };

    function Plugin(option) {
        var options = typeof option == 'object' && option,
            notice = new Notice(options);

        /* Notice未打开，则渲染 */
        if (!$('body').find('.modal-notice').length) {
            notice.render();
        }

        if (typeof option == 'string') {
            notice[option].call(notice);
        }
    }

    var old = $.notice;

    $.notice = Plugin;

    $.notice.noConflict = function () {
        $.notice = old;
        return this;
    };
}(jQuery);