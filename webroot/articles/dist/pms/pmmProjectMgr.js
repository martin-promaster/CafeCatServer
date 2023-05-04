$(function () {
  'use strict'

  refreshTableData();
  
  $("#btnQuery").on('click', function() {
    refreshTableData(1000); // Query all
  });

  $("#btnOpen").on('click', function() {
    refreshTableData(10);
  });

  $('#btnAdd').on('click', function () {
    initModal();
  });

  $('#btnQryRun').on('click', function () {
    refreshTableData(1002); //交付中项目
  });

  $('#btnQryLowGrossRate').on('click', function () {
    refreshTableData(1001); //查询低毛利
  });

  // 模块button事件绑定
  $('#modal-btnSave').on('click', function() {
    saveModule();
  });

  $('#modal-project-log-btnSave').on('click', function() {
    saveProjectLogModal();
  });

  $('#modal-task-save').on('click', function() {
    saveTaskModal();
  });

  $('#modal-task-add').on('click', function() {
    initTaskModal();
  });
  
});

/**
 * 根据传入的项目状态，刷新数据表单
 * @param {Number} status 9-待启动; 10-招聘中; 11-暂停; 12-驻场交付; 13-关闭
 */
function refreshTableData(status) {
  $("#example1").DataTable({
    "aLengthMenu" : [5, 15, 30], //更改显示记录数选项
    "destroy": true,
    "processing": true,
    "responsive": true,
    "lengthChange": true,
    "autoWidth": false,
    serverSide: true,
    //"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
    "ajax": {
      async: false,
      url: "/api/v1/pm/projectBaseInformation/list",
      contentType: "application/json;charset=utf-8;",
      data: {
        "status": status
      }
    },
    "columns": [
      {"data": "customerId" },
      {"data": "code" },
      {"data": "name" },
      {"data": "description" },
      {"data": "entryDate" },
      {"data": "status" }, // eq(4)
      {"data": "priority" }, // eq(5)
      {"data": "poDescription" },
      {"data": "poOnsiteStaff" },
      {"data": "poMonthlyRevenue" },
      {"data": "poMonthlyGrossRate" }, // eq(9)
      {"data": "hiringManager" }, // eq(10)
      {"data": "salesDistrict" },
      {"data": "salesDirector" },
      {"data": "salesManager" },
      {"data": "remark" },
      // data area
      {"data": null}
    ],
    "createdRow": function (row, data, index) {

      $('td', row).eq(0).html(getCustName(data.customerId));

      $('td', row).eq(4).html(new Date(data.entryDate).toLocaleDateString());

      $('td', row).eq(5).html(getValueFromDataDictionaryById(data.status));
      $('td', row).eq(6).html(getValueFromDataDictionaryById(data.priority));
      // Radix is setting to 2 means keep 2 digital after decimal point
      var gr = formatPercent(data.poMonthlyGrossRate, 2);
      $('td', row).eq(10).html(gr<0?"<span class='text-bold text-danger'>"+ gr +"</span>":gr);
      $('td', row).eq(11).html(getUserNameByUserCode(data.hiringManager));
      // Operation buttons
      var $btnGroup = $("<div></div>", {class: "btn-group"})
      $btnGroup.append(createDataTableOpButton("#modal-default","updateModal("+index+")", "btn-info","fa fa-edit"));
      $btnGroup.append(createDataTableOpButton("#modal-project-log","updateProjectLogModal("+index+")", "btn-success","fa fa-clipboard-list"));
      $('td', row).eq(-1).html($btnGroup);
    }
  });//.buttons().container().appendTo('#example1_wrapper .col-md-4:eq(0)');

  initDistrictChart();
  initTop10ProjectChart();
}

function refreshTaskModalTableDate(params) {
  $("#example2").DataTable({
    "aLengthMenu" : [5, 15, 30], //更改显示记录数选项
    "destroy": true,
    "processing": true,
    "responsive": true,
    "lengthChange": true,
    "autoWidth": false,
    serverSide: true,
    //"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
    "ajax": {
      async: false,
      url: "/api/v1/task/tbl",
      contentType: "application/json;charset=utf-8;",
      data: {
        "projectId": params
      }
    },
    "columns": [
      {"data": "id" },
      {"data": "code" },
      {"data": "name" },
      {"data": "description" },
      {"data": "reqs" },
      {"data": "duration" }, // eq(4)
      {"data": "jobTitle" }, // eq(5)
      {"data": "jobLevel" },
      {"data": "entryDate" },
      {"data": "modifyDate" },
      {"data": "remark" },
      // data operation placeholder.
      {"data": null}
    ],
    "createdRow": function (row, data, index) {
      $('td', row).eq(7).html(getValueFromDataDictionaryById(data.jobLevel));
      $('td', row).eq(-4).html((new Date(data.entryDate)).toLocaleDateString());
      $('td', row).eq(-3).html((new Date(data.modifyDate)).toLocaleDateString());

      // Operation buttons
      var $btnGroup = $("<div></div>", {class: "btn-group"})
      $btnGroup.append(createDataTableOpButton("#modal-task","updateTaskModal("+index+")", "btn-success","fa fa-edit"));
      $('td', row).eq(-1).html($btnGroup);
    }
  });//.buttons().container().appendTo('#example1_wrapper .col-md-4:eq(0)');
}

// ---------------------------------------
// Default Modal - Popup
function initModal() {
  $('#modal-unique-id').val("");

  $('#modal-default-code').val("")
  $('#modal-default-name').val("")
  $('#modal-default-description').val("")
  $('#modal-default-entryDate').val(new Date().toLocaleDateString());
  initSelect2Option($('#modal-default-selOption-status'), "/api/v1/sm/dd/status/selOption")
  initSelect2Option($('#modal-default-selOption-priority'), "/api/v1/sm/dd/priority/selOption")
  $('#modal-default-poOnsiteStaff').val("")
  $('#modal-default-poDescription').val("")
  $('#modal-default-poMonthlyRevenue').val("")
  $('#modal-default-poMonthlyGrossRate').val("")
  //招聘专员
  updateSelect2Option($('#modal-selOption-hiringManagerCode'), "/api/v1/sm/user/list/selOption", getOnlineUserCode())
  $('#modal-default-salesDistrict').val("")
  $('#modal-default-salesDirector').val("")
  $('#modal-default-salesManager').val("")
  $('#modal-site-address').val("")
  $('#modal-default-remark').val("")
  // UI attribute update
  $('#modal-default-entryDate').attr('disabled', 'true');
  $('#modal-default-poOnsiteStaff').attr('disabled', 'true');
  $('#modal-default-poMonthlyRevenue').attr('disabled', 'true');
  $('#modal-default-poMonthlyGrossRate').attr('disabled', 'true');
  $('#modal-selOption-hiringManagerCode').attr('disabled', 'true');

  initSelect2Option($('#modal-default-selOption-customer-name'), "/api/v1/customer/list/selOption")
}

function updateModal(rowIndex) {
  var dataTable2 = $('#example1').dataTable()
  var nodes =  dataTable2.fnGetNodes();
  var data = dataTable2.fnGetData(nodes[rowIndex]);

  $('#modal-unique-id').val(data.id);

  $('#modal-default-code').val(data.code);
  $('#modal-default-name').val(data.name);
  $('#modal-default-description').val(data.description);
  $('#modal-default-entryDate').val((new Date(data.entryDate)).toLocaleDateString());
  // 状态
  updateSelect2Option($('#modal-default-selOption-status'), "/api/v1/sm/dd/status/selOption", data.status)
  // 优先级
  updateSelect2Option($('#modal-default-selOption-priority'), "/api/v1/sm/dd/priority/selOption", data.priority)
  $('#modal-default-poOnsiteStaff').val(data.poOnsiteStaff);
  $('#modal-default-poDescription').val(data.poDescription);
  $('#modal-default-poMonthlyRevenue').val(data.poMonthlyRevenue);
  $('#modal-default-poMonthlyGrossRate').val(data.poMonthlyGrossRate)
  // 招聘专员
  updateSelect2Option($('#modal-selOption-hiringManagerCode'), "/api/v1/sm/user/list/selOption", data.hiringManager)
  $('#modal-default-salesDistrict').val(data.salesDistrict);
  $('#modal-default-salesDirector').val(data.salesDirector);
  $('#modal-default-salesManager').val(data.salesManager);
  $('#modal-site-address').val(data.siteAddress);
  $('#modal-default-remark').val(data.remark);
  updateSelect2Option($('#modal-default-selOption-customer-name'), "/api/v1/customer/list/selOption", data.customerId)
  // UI attribute update
  $('#modal-default-entryDate').attr('disabled', 'true');
  $('#modal-default-poOnsiteStaff').attr('disabled', 'true');
  $('#modal-default-poMonthlyRevenue').attr('disabled', 'true');
  $('#modal-default-poMonthlyGrossRate').attr('disabled', 'true');
  $('#modal-selOption-hiringManagerCode').attr('disabled', 'true');
  // 刷新招聘任务列表
  refreshTaskModalTableDate(data.id);
}

function saveModule() {
  var saveObject = {
    id:  $('#modal-unique-id').val(),
    code: $('#modal-default-code').val(),
    name: $('#modal-default-name').val(),
    description: $('#modal-default-description').val(),
    entryDate: new Date($('#modal-default-entryDate').val()).valueOf(),
    status: $('#modal-default-selOption-status').select2("data")[0].id,
    priority: $('#modal-default-selOption-priority').select2("data")[0].id,
    poOnsiteStaff: $('#modal-default-poOnsiteStaff').val(),
    poDescription: $('#modal-default-poDescription').val(),
    poMonthlyRevenue: $('#modal-default-poMonthlyRevenue').val(),
    poMonthlyGrossRate: $('#modal-default-poMonthlyGrossRate').val(),
    // 招聘专员
    hiringManager: $('#modal-selOption-hiringManagerCode').select2("data")[0].id,
    salesDistrict: $('#modal-default-salesDistrict').val(),
    salesDirector: $('#modal-default-salesDirector').val(),
    salesManager: $('#modal-default-salesManager').val(),
    siteAddress: $('#modal-site-address').val(),
    remark: $('#modal-default-remark').val(),
    customerId: $('#modal-default-selOption-customer-name').select2("data")[0].id,
  };

  $.ajax({
    url: '/api/v1/pm/projectBaseInformation/save',
    type: 'post',
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(saveObject),
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      alert('Saved successfully.');
      $('#modal-default').modal('hide');
      initModal();
      refreshTableData();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}

// ---------------------------------------
// Task Modal functions
function initTaskModal() {
  $("#modal-task-project-id").val($("#modal-unique-id").val());

  $("#modal-task-id").val("")
  $("#modal-task-code").val("")
  $("#modal-task-name").val("")
  $("#modal-task-description").val("")
  $("#modal-task-reqs").val("")
  $("#modal-task-duration").val("")
  $("#modal-task-job-title").val("")
  initSelect2Option($('#modal-selOption-jobLevel'), "/api/v1/sm/dd/jobLevel/selOption")
  $("#modal-task-entry-date").val(Date.now())
  $("#modal-task-modify-date").val(Date.now())
  $("#modal-task-remark").val("")

  $('#modal-task-id').attr('disabled', 'true');
}

function updateTaskModal(rowIndex) {

  var dataTable2 = $('#example2').dataTable()
  var nodes =  dataTable2.fnGetNodes();
  var data = dataTable2.fnGetData(nodes[rowIndex]);
  // projectId
  $("#modal-task-project-id").val(data.projectId)

  $("#modal-task-id").val(data.id)
  $("#modal-task-code").val(data.code)
  $("#modal-task-name").val(data.name)
  $("#modal-task-description").val(data.description)
  $("#modal-task-reqs").val(data.reqs)
  $("#modal-task-duration").val(data.duration)
  $("#modal-task-job-title").val(data.jobTitle)
  // 岗位级别
  updateSelect2Option($('#modal-selOption-jobLevel'), "/api/v1/sm/dd/jobLevel/selOption", data.jobLevel)
  $("#modal-task-entry-date").val(data.entryDate)
  $("#modal-task-modify-date").val(data.modifyDate)
  $("#modal-task-remark").val(data.remark)

  $('#modal-task-id').attr('disabled', 'true');

}

function saveTaskModal() {
  var saveObject = {
    projectId:$("#modal-task-project-id").val(),
    //userCode: getOnlineUserCode(),
    id:$("#modal-task-id").val(),
    code:$("#modal-task-code").val(),
    name:$("#modal-task-name").val(),
    description:$("#modal-task-description").val(),
    reqs:$("#modal-task-reqs").val(),
    duration:$("#modal-task-duration").val(),
    jobTitle:$("#modal-task-job-title").val(),
    jobLevel: $('#modal-selOption-jobLevel').select2("data")[0].id,
    entryDate:$("#modal-task-entry-date").val(),
    modifyDate:$("#modal-task-modify-date").val(),
    remark:$("#modal-task-remark").val(),
  };

  $.ajax({
    method: 'POST',
    url: '/api/v1/task/save',
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(saveObject),
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      alert('Saved successfully.');
      $('#modal-task').modal('hide');
      initTaskModal();
      //refreshTaskModalTableDate(saveObject.projectId)
      $('#modal-default').modal();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
  });
}

// ---------------------------------------
// ProjectLog Modal functions
function initProjectLogModal() {
  $("#modal-project-log-unique-id").val("")

  $("#modal-project-log-header").val("");
  $("#modal-project-log-body").val("");
  $("#modal-project-log-footer").val("");
}

function updateProjectLogModal(rowIndex) {

  var dataTable2 = $('#example1').dataTable()
  var nodes =  dataTable2.fnGetNodes();
  var data = dataTable2.fnGetData(nodes[rowIndex]);
  // projectId
  $("#modal-project-log-unique-id").val(data.id)
  
  $("#modal-project-log-header").val("")
  $("#modal-project-log-body").val("")
  $("#modal-project-log-footer").val("")

  refreeshProjectLogTimeline($("#modal-project-log-unique-id").val());
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

// 更新项目日志
function refreeshProjectLogTimeline(projectId) {
  pmsGet("/api/v1/pm/projectLog/list", {projectId: projectId}, 
    function (data, textStatus, jqXHR) {
      $timeline = $(".timeline");
      $timeline.empty();
      var arr = data.data;
      for (let index = 0; index < arr.length; index++) {
        addTimelineMessage($timeline, 
          (new Date(arr[index].entryDate).toLocaleString())+": "+ getUserNameByUserCode(arr[index].userCode), 
          arr[index].projectLogHeader, 
          arr[index].projectLogBody, 
          arr[index].projectLogFooter);
      }
    },
    function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
  )
}

// Chart
function initDistrictChart() {
  var chartData = {
    // labels
    labels: ['金牌渠道部', '华东大区', '华南大区', '西部大区', '渠道营销中心', '智能运营中心', '其它'],
    // datas
    sumPlannedProject: [0, 0, 0, 0, 0, 0, 0],
    sumOpenProject: [0, 0, 0, 0, 0, 0, 0],
    sumPendingProject: [0, 0, 0, 0, 0, 0, 0],
    sumDoneProject: [0, 0, 0, 0, 0, 0, 0],
    sumClosedProject: [0, 0, 0, 0, 0, 0, 0],
    sumProject: [0, 0, 0, 0, 0, 0, 0],
    sumStaff: [0, 0, 0, 0, 0, 0, 0],
    avgGrossRate: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  }
  pmsGet("/api/v1/pm/project/chart", {}, function(data){
    data.data.forEach(e => {
      var index = chartData.labels.indexOf(e.salesDistrict);
      // 不在大区的项目归属于资源池
      if (index < 0) {
        index = 6;
      }
      chartData.sumProject[index] += 1;
      switch (e.status) {
        case 9:
          chartData.sumPlannedProject[index] += 1;
          break;
        case 10:
          chartData.sumOpenProject[index] += 1;
          break;
        case 11:
          chartData.sumPendingProject[index] += 1;
          break;
        case 12:
          chartData.sumDoneProject[index] += 1;
          break;
        case 13:
          chartData.sumClosedProject[index] += 1;
          break;
      }
      chartData.sumStaff[index] += e.poOnsiteStaff;
      chartData.avgGrossRate[index] += e.poMonthlyGrossRate;
    });
  });

  // Calculate AVG gross rate of each district, and set labels
  for (let i = 0; i < chartData.labels.length; i++) {
    if (chartData.avgGrossRate[i]/chartData.sumStaff[i] > 0) {
      chartData.avgGrossRate[i] = chartData.avgGrossRate[i]/chartData.sumStaff[i];
    }
  }
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('grossRateChart'));
  option = {
    title: {
      text: "项目数和利润率分布",
      left:'center',
    },
    tooltip: {
      trigger: 'axis',
      //axisPointer: { type: 'cross' }
    },
    legend: {
      top: "7%"
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        "axisLabel":{
          interval: 0,
          rotate: 45, //文字倾斜角度
        },
        data: chartData.labels
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '项目数',
        min: 0,
        // max: 250,
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '毛利率',
        min: 0,
        // max: 25,
        position: 'right',
        axisLabel: {
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: '项目数',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.sumProject
      },
      {
        name: '毛利率',
        type: 'line',
        smooth: false,
        yAxisIndex: 1,
        data: chartData.avgGrossRate
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  option && myChart.setOption(option);

  // 基于准备好的dom，初始化echarts实例
  var myChart2 = echarts.init(document.getElementById('districtChart'));
  window.onresize = function() {
    myChart2.resize();
  };
  option2 = {
    title: {
      text: "项目数大区分布",
      left:'center',
    },
    tooltip: {
      trigger: 'axis',
      //axisPointer: { type: 'cross' }
    },
    legend: {
      top: "7%",
      bottom: "10%",
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          rotate: 45, //文字倾斜角度
        },
        data: chartData.labels
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '项目数',
        min: 0,
        // max: 250,
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '待启动',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.sumPlannedProject
      },
      {
        name: '招聘中',
        type: 'bar',
        smooth: true,
        yAxisIndex: 0,
        data: chartData.sumOpenProject
      },
      {
        name: '暂停',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.sumPendingProject
      },
      {
        name: '驻场中',
        type: 'bar',
        smooth: true,
        yAxisIndex: 0,
        data: chartData.sumDoneProject
      },
      {
        name: '关闭',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.sumClosedProject
      },
      {
        name: '项目总数',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: chartData.sumProject
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option2);
}

function initTop10ProjectChart() {
  var chartData = {
    // labels
    labels: [],
    // datas
    sumProject: []
  }
  var pieChartData = [];
  pmsGet("/api/v1/pm/project/chart", {}, function(data){
    data.data.forEach(e => {
      if (e.status == 9 || e.status == 10 || e.status == 12) {
        if (!chartData.labels.includes(e.salesManager)) {
          chartData.labels.push(e.salesManager);
          chartData.sumProject.push(0)
        }

        index = chartData.labels.indexOf(e.salesManager);
        chartData.sumProject[index] += 1;
        
      }
    });
    // data.data.forEach(e => {
    //   if (e.status == 9 || e.status == 10 || e.status == 12) {
    //     index = chartData.labels.indexOf(e.salesManager);
    //     chartData.sumProject[index] += 1;
    //   }
    // });
  });

  for (let i = 0; i < chartData.labels.length; i++) {
    const element = {name: chartData.labels[i], 
      value: chartData.sumProject[i]};
    if (i<=5) pieChartData.push(element);    
  }
  // 基于准备好的dom，初始化echarts实例
  var myChart2 = echarts.init(document.getElementById('projectChart'));
  window.onresize = function() {
    myChart2.resize();
  };
  option2 = {
    title: {
      text: "销售经理项目数分布",
      left:'center',
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: "7%",
      left: "center"
    },
    series: [
      {
        name: '项目数',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pieChartData,
      },      
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option2);
}