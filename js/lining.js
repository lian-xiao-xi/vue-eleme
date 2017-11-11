; (function (params) {
  'use strict'

  var $form_add_task = $('.add-task')
    , task_list = []
    , $task_delete_trigger
    , $task_detail_trigger
    , $checkbox_complete
    , $task_detail = $('.task-detail')
    , $task_detail_mask = $('.task-detail-mask')
    , current_index
    , $update_form
    , $task_detail_content
    , $task_detail_content_input
    , $task_item
    , $msg = $('.msg')
    , $msg_content = $msg.find('.msg-content')
    , $msg_confirm = $msg.find('.confirmed')
    , $alerter = $('.alerter');

  init()

  $form_add_task.on('submit', on_add_task_form_submit)
  $task_detail_mask.on('click', hide_task_detail)

  function on_add_task_form_submit(e) {
    e.preventDefault()
    var new_task = {};
    var $input = $(this).find('input[name=content]')
    new_task.content = $input.val();
    if (!new_task.content) { return };
    // 存入新 task
    if (add_task(new_task)) {
      $input.val('');
    }
  }

  /**
   * 更新localStorage数据并渲染模板
   */
  function refresh_task_list() {
    localStorage.setItem('list', JSON.stringify(task_list))
    render_task_list();
  }

  /**
   * 添加task
   */
  function add_task(new_task) {
    // 将新Task推入task_list
    task_list.push(new_task)
    refresh_task_list()
    return true;
  }

  /**
   * 删除一条task
   */
  function delete_task(index) {
    if (index == undefined || !task_list[index]) { return }
    task_list.splice(index, 1)
    refresh_task_list()
  }

  /**
   * 更新task中的数据
   */
  function update_task(index, data) {
    if (index == undefined || !task_list[index]) { return }

    task_list[index] = $.extend({}, task_list[index], data)
    console.log(task_list)
    refresh_task_list()
  }
  /**
   * 渲染指定task-detail的DOM结构
   */
  function render_task_detail(index) {
    if (index == undefined || !task_list[index]) { return }
    var item = task_list[index];
    var tpl =
      '<form>' +
      '<div class="content">' +
      item.content +
      '</div>' +
      '<div class="input-item">' +
      '<input style="display: none;" type="text" name="content" value="' + (item.content || '') + '">' +
      '</div>' +
      '<div>' +
      '<div class="desc input-item">' +
      '<textarea name="desc">' + (item.desc || '') + '</textarea>' +
      '</div>' +
      '</div>' +
      '<div class="remind input-item">' +
      '<label>提醒时间</label>' +
      '<input class="datetime" name="remind_date" autocomplete="off" type="text" value="' + (item.remind_date || '') + '">' +
      '</div>' +
      '<div class="input-item"><button type="submit">更新</button></div>' +
      '</form>';

    $task_detail.html('')
    $task_detail.html(tpl)

    $('.datetime').datetimepicker();

    $update_form = $task_detail.find('form')
    $task_detail_content = $update_form.find('.content');
    $task_detail_content_input = $update_form.find('[name=content]');
    // 双击内容元素显示input, 隐藏自己
    $task_detail_content.on('dblclick', function () {
      $task_detail_content_input.show()
      $(this).hide()
    })

    $update_form.on('submit', function (e) {
      e.preventDefault()
      var data = {}
      data.desc = $(this).find('[name=desc]').val()
      data.content = $(this).find('[name=content]').val()
      data.remind_date = $(this).find('[name=remind_date]').val()
      console.log('data', data)
      update_task(index, data)
      hide_task_detail()
    })
  }

  /**
   * 展示一条task的详情
   */
  function show_task_detail(index) {
    // 生成详情模板
    render_task_detail(index);
    $task_detail.show()
    $task_detail_mask.show()
  }
  /**
   * 隐藏一条task的详情
   */
  function hide_task_detail() {
    $task_detail.hide()
    $task_detail_mask.hide()
  }

  /**
   * 查找并监听所有删除按钮的点击事件
   */
  function listen_task_delete() {
    $task_delete_trigger.on('click', function () {
      // 找到删除按钮所在的task元素
      var index = $(this).parent().parent().data('index')
      var tmd = confirm('确定删除?');
      tmd ? delete_task(index) : null;
    })
  }

  /**
   * 监听打开task_detail事件
   */
  function listen_task_detail() {
    var index;
    $task_detail_trigger.on('click', function () {
      index = $(this).parent().parent().data('index')
      show_task_detail(index);
    })

    $task_item.on('dblclick', function () {
      index = $(this).data('index');
      show_task_detail(index);
    })
  }

  function get(index) {
    return JSON.parse(localStorage.getItem('list'))[index]
  }

  /**
   * 监听完成task事件
   */
  function listen_checkbox_complete() {
    $checkbox_complete.on('click', function () {
      var index = $(this).parent().parent().data('index');
      var item = get(index)
      if(item.complete) {
        update_task(index, {complete: false});
      } else {
        update_task(index, {complete: true});
      }
    })
  }

  /**
   * 初始化DOM
   */
  function init() {
    task_list = JSON.parse(localStorage.getItem('list')) || [];
    console.log(task_list)
    listen_msg_event();
    task_list.length && render_task_list();
    task_remind_check();
  }

  function task_remind_check() {
    var current_timestamp;
    var itl = setInterval(function () {
      for (var i = 0; i < task_list.length; i++) {
        var item = task_list[i], task_timestamp;
        if(!item || !item.remind_date || item.informed) {
          continue
        }
        // console.log(item)
        current_timestamp = new Date().getTime();
        task_timestamp = new Date(item.remind_date).getTime()
        if(current_timestamp - task_timestamp >=1) {
          // 防止重复的提醒
          update_task(i, {informed: true})
          show_msg(item.content);
        }
      }
    }, 500)
  }

  
  function show_msg(msg) {
    if (!msg) return;

    $msg_content.html(msg);
    $alerter.get(0).play();
    $msg.show();
  }

  function hide_msg() {
    $msg.hide();
  }

  function listen_msg_event() {
    $msg_confirm.on('click', function () {
      hide_msg();
    })
  }

  /**
   * 渲染所有的task模板
   */
  function render_task_list(params) {
    var i,j,$task,$task_list = $('.task-list');
    $task_list.html('')
    var complete_items = []
    for ( i = 0; i < task_list.length; i++) {
      var item = task_list[i]
      if(item && item.complete) {
        complete_items[i] = item
      } else {
        $task = render_task_item(item, i)
      }
      $task_list.prepend($task)
    }
    for( j=0;j<complete_items.length;j++) {
      if(!complete_items[j]) continue;
      $task = render_task_item(complete_items[j],j)
      $task.addClass('completed');
      $task_list.append($task)
    }
    $task_delete_trigger = $('.action.delete');
    $task_detail_trigger = $('.action.detail');
    $task_item = $('.task-item')
    $checkbox_complete = $('.task-list .complete[type=checkbox]')
    listen_task_delete();
    listen_task_detail();
    listen_checkbox_complete()
  }

  /**
   * 渲染单条task模板
   */
  function render_task_item(data, index) {
    if (!data) return;
    var list_item_tpl =
      '<div class="task-item" data-index="' + index + '">' +
      '<span><input class="complete" ' + (data.complete ? 'checked' : '') + ' type="checkbox"></span>' +
      '<span class="task-content">' + data.content + '</span>' +
      '<span class="fr">' +
      '<span class="action delete"> 删除</span>' +
      '<span class="action detail"> 详细</span>' +
      '</span>' +
      '</div>';

    // 返回以这些字符串创建的元素
    return $(list_item_tpl);
  }

})();