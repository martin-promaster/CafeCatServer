$(function () {
    'use strict'

    pmsGet("/api/v1/pm/projectLog/detail/list", {}, function(data) {
      data.data.forEach(task => {
        var msgFooter = "招聘接口人: " + task.hiringManager + " | 销售经理: " + task.salesManager;
        if (task.taskType == "招聘中") {
          addDoingTaskItem($("#doingList"), task.name, task.id, task.projectLog, msgFooter);
        } else if(task.taskType == "驻场中") {
          addDoneTaskItem($("#doneList"), task.name, task.id, task.projectLog, msgFooter);
        } else if(task.taskType == "待启动") {
          addToDoTaskItem($("#todoList"), task.name, task.id, task.projectLog, msgFooter);
        } else if(task.taskType == "关闭") {
          // do nothing
        } else {
          addOverdueTaskItem($("#overdueList"), task.name, task.id, task.projectLog, msgFooter);
        }
      });
    });

    $("a[data-project-id]").on("click", function() {
      var id = $(this).data("project-id");
      var name = $(this).data("project-name");
      $(".modal-title").html(name+"-变更日志");
      $("#modal-project-log-unique-id").val(id);
      $("#modal-project-log-header").val("")
      $("#modal-project-log-body").val("")
      $("#modal-project-log-footer").val("")
    
      refreeshProjectLogTimeline($("#modal-project-log-unique-id").val());
    });

    $('#modal-project-log-btnSave').on('click', function() {
      saveProjectLogModal();
    });
});

function addToDoTaskItem(o, tiHeader, tiId, tiBody, tiFooter) {
  addTaskItem(o, tiHeader, tiId, tiBody, tiFooter, "card-primary")
}

function addDoingTaskItem(o, tiHeader, tiId, tiBody, tiFooter) {
  addTaskItem(o, tiHeader, tiId, tiBody,  tiFooter, "card-teal")
}

function addDoneTaskItem(o, tiHeader, tiId, tiBody, tiFooter) {
  addTaskItem(o, tiHeader, tiId, tiBody,  tiFooter, "card-success")
}

function addOverdueTaskItem(o, tiHeader, tiId, tiBody, tiFooter) {
  addTaskItem(o, tiHeader, tiId, tiBody,  tiFooter, "card-danger")
}

/**
 * 通用函数，用于在任务看板中构造和插入一条taskitem对象
 * @param {*} o JQuery object
 * @param {string} tiHeader header of task item 
 * @param {number} tiId id of tesk item
 * @param {string} tiBody body of task item
 * @param {string} tiClass  class name of style
 */
function addTaskItem(o, tiHeader, tiId, tiBody, tiFooter, tiClass) {
  $taskItem = $("<div></div>", {class: "card card-outline"});
  $taskItem.addClass(tiClass);
  if (tiHeader != null) {
    $taskItemHeader=$("<div />", {class: "card-header"}).appendTo($taskItem);
    $("<h5 />", {class: "card-title"}).append(tiHeader).appendTo($taskItemHeader);
    $("<div />", {class: "card-tools"})
      .append( $("<a />", {class: "btn btn-tool btn-link", href: "#"}).append("#"+tiId) )
      .append( $("<a />", {class: "btn btn-tool", href: "#", 
                            "data-project-id": tiId, "data-project-name": tiHeader,
                            "data-toggle": "modal", "data-target": "#modal-project-log"
                          }).append("<i class=\"fas fa-pen\"></i>") )
      .append( $("<button />", {class: "btn btn-tool", "data-card-widget": "collapse"}).append("<i class=\"fas fa-minus\"></i>") )
    .appendTo($taskItemHeader);
  }
  if (tiBody != null) {
    $taskItemBody=$("<div />", {class: "card-body"}).appendTo($taskItem)
    $("<p />").append(tiBody).appendTo($taskItemBody)    
  }
  if (tiFooter != null) {
    $tiFooter=$("<div />", {class: "card-footer"}).appendTo($taskItem)
    $("<span />", {class: "badge", style: "color: black"}).append(tiFooter).appendTo($tiFooter)    
  }
  o.append($taskItem)
}

//
// ProjectLog Modal functions
//
function refreeshProjectLogTimeline(projectId) {
  pmsGet('/api/v1/pm/projectLog/list', 
    {projectId: projectId}, 
    function (data, textStatus, jqXHR) {
        $timeline = $(".timeline");
        $timeline.empty();
        var arr = data.data;
        for (let index = 0; index < arr.length; index++) {
          addTimelineMessage($timeline, new Date(arr[index].entryDate).toLocaleString()+": "+ getUserNameByUserCode(arr[index].userCode), 
            arr[index].projectLogHeader, 
            arr[index].projectLogBody, 
            arr[index].projectLogFooter);
        }
    }, function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
    });
}

function initProjectLogModal() {
  $("#modal-project-log-header").val("");
  $("#modal-project-log-body").val("");
  $("#modal-project-log-footer").val("");
}

function saveProjectLogModal() {
  if ($('#modal-project-log-body').val() == "" ||
      $("#modal-project-log-header").val() == "") {
    alert("输入不能为空！");
    return;
  }
  var saveObject = {
    projectId:  $('#modal-project-log-unique-id').val(),
    userCode: getOnlineUserCode(),
    projectLogHeader: $("#modal-project-log-header").val(),
    projectLogBody:$("#modal-project-log-body").val(),
    projectLogFooter: $("#modal-project-log-footer").val(),
  };

  $.ajax({
    method: 'POST',
    url: '/api/v1/pm/projectLog/save',
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(saveObject),
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      alert('Saved successfully.');
      //$('#modal-project-log').modal('hide');
      refreeshProjectLogTimeline($("#modal-project-log-unique-id").val());
      initProjectLogModal();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}