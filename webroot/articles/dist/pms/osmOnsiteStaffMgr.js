// Page initialization
$(function () {

  refreshTableData({status: "17"});
  
  $("#btnQuery").on('click', function() {
    refreshTableData();
  });

  $('#btnQryOnsiteStaff').on('click', function () {
    refreshTableData({status: "17"});
  });

  $('#btnAdd').on('click', function () {
    initModal();
  });

  $('#modal-btnSave').on('click', function() {
    saveModal();
  });
  
});
  
function initOnsiteStaffChart() {
  var chartData = {
    levelIds: [  24,  25,   26,   27,   28,   29,   30,   31,   52,   53,   54,  55],
    levels:   ["P0","P1","P2C","P2B","P2A","P3C","P3B","P3A","P4C","P4B","P4A","P5"],
    counts:   [0,0,0,0,0,0,0,0,0,0,0,0],
    avgCost:  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],
  };

  pmsGet("/api/v1/osm/onsiteStaff/jobLevel/chart", {}, function(data) {
    data.data.forEach( e => {
      var idx = chartData.levelIds.indexOf(Number(e.level));
      chartData.counts[idx] = e.count;
      chartData.avgCost[idx] = formatPercent(e.avgCost,2);
    })
  });
  
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('onsiteStaffJobLevelChart'));
  option = {
    title: {
      text: "在岗员工职级分布",
      left:'center',
    },
    tooltip: {
      trigger: 'axis',
      // axisPointer: { type: 'cross' }
    },
    legend: {
      top: "10%"
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
        data: chartData.levels
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '在岗人数',
        min: 0,
        // max: 250,
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '人均成本',
        min: 0,
        // max: 250,
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    series: [
      {
        name: '人数',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.counts
      },
      {
        name: '人均成本',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.avgCost,
        markLine: {
          data: [{ type: 'average', name: 'Cost Avg' }]
        }
      },
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  var chartData2 = {
    base: [],
    counts: [],
    avgCost: []
  };
  pmsGet("/api/v1/osm/onsiteStaff/base/chart", {}, function(data) {
    data.data.forEach( e => {
      chartData2.base.push(parseDataDictionary(e.base).value);
      chartData2.counts.push(e.count);
      chartData2.avgCost.push(formatPercent(e.avgCost,2));
    })
  });
  // 基于准备好的dom，初始化echarts实例
  var myChart2 = echarts.init(document.getElementById('onsiteStaffBaseChart'));
  option2 = {
    title: {
      text: "在岗员工地域分布",
      left:'center',
    },
    tooltip: {
      trigger: 'axis',
      // axisPointer: { type: 'cross' }
    },
    legend: {
      top: "10%"
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
        data: chartData2.base
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '在岗人数',
        min: 0,
        // max: 250,
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '人均成本',
        min: 0,
        // max: 250,
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    series: [
      {
        name: '人数',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData2.counts
      },
      {
        name: '人均成本',
        type: 'line',
        yAxisIndex: 1,
        data: chartData2.avgCost,
        markLine: {
          lineStyle: {color: "#bf3d01", type: "solid"},
          data: [{ type: 'average', name: 'Cost Avg' }]
        }
      },
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option2);
}
  
function initDistrictChart() {
  var chartData = {
    // labels
    labels: ['金牌渠道部', '华东大区', '华南大区', '西部大区', '渠道营销中心', '智能运营中心', '其它'],
    labelsWithStaff: [],
    // datas
    sumStaff: [0, 0, 0, 0, 0, 0, 0],
    avgGrossRate: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  }
  pmsGet("/api/v1/osm/onsiteStaff/chart", {}, function(data) {
    data.data.forEach(e => {
      var index = chartData.labels.indexOf(e.salesDistrict);
      if (index < 0) {
        index = 6;
      }
      chartData.sumStaff[index] += e.sumStaff;
      chartData.avgGrossRate[index] += e.staffAvgGrossRate;
    });
  });

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('OnsiteStaffDistrictChart'));
  option = {
    title: {
      text: "在岗员工大区分布",
      left:'center',
    },
    tooltip: {
      trigger: 'axis',
      // axisPointer: { type: 'cross' }
    },
    legend: {
      top: "10%"
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
        data: chartData.labels,
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '在岗人数',
        min: 0,
        // max: 250,
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    series: [
      {
        name: '人数',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.sumStaff,
      },
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);  
}
  
// 项目人数总计图表
function initTop10ProjectChart() {
  var chartData = {
    // labels
    labels: [],
    // datas
    sumStaff: []
  }
  pmsGet("/api/v1/osm/onsiteStaff/chart", {}, function(data) {
    var top10 = 10;
    data.data.forEach(e => {
      if (e.sumStaff == 0) {
        return;
      }
      if (top10-- < 0) {
        return;
      }
      chartData.labels.push(e.projectName+" ("+ e.sumStaff +")");
      chartData.sumStaff.push(e.sumStaff);
    });
  });

  var charts = $("div.chart");
  $(charts[0]).children().remove();
  $(charts[0]).append($("<canvas />", {id: "projectChart", style: "height: 280px"}));

    
  /* ChartJS
  * -------
  * Here we will create a few charts using ChartJS
  */
  var barChartOptions = {
    scales: { 
      // yAxis: [
      //   { display: true, 
      //     ticks: { 
      //       suggestedMin: 0, // minimum will be 0, unless there is a lower value. // OR // beginAtZero: true // minimum value will be 0. 
      //     } 
      //   }
      // ] 
    },
    plugins: {
            legend: {
                display: true,
                position: "right"
            }
        },
    responsive              : true,
    maintainAspectRatio     : false,
    datasetFill             : false
  }
  bgColor = [];
  for(i = 0; i< chartData.labels.length; i++) {
    bgColor.push(osmpLib._randomRGBStr());
  }
  //-------------
  //- BAR CHART -
  // - sales
  //-------------
  var barChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label               : '当前在岗人数',
        backgroundColor     : bgColor,
        borderColor         : bgColor,
        //pointRadius          : false,
        //pointColor          : '#3b8bba',
        //pointStrokeColor    : 'rgba(0,123,255,1)',
        //pointHighlightFill  : '#fff',
        //pointHighlightStroke: 'rgba(0,123,255,1)',
        hoverOffset: 4,
        data                :  chartData.sumStaff
      }
    ]
  }

  var barChartCanvas = $('#projectChart').get(0).getContext('2d')
  new Chart(barChartCanvas, {
    type: 'doughnut',
    data: barChartData,
    options: barChartOptions
  })
}
  
function refreshTableData(param) {
  if($("#chkbHasQuitStaff").prop("checked")) {
    $.extend(param, {hasQuitStaff: true})
  }
  $("#example1").DataTable({
    "aLengthMenu" : [10, 15, 30], //更改显示记录数选项
    "destroy": true,
    "processing": true,
    "responsive": true,
    "lengthChange": true,
    "autoWidth": false,
    serverSide: true,
    //"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
    ajax: {
      async: false,
      url: "/api/v1/osm/onsiteStaff/list",
      contentType: "application/json",
      data: param,
    },
    "columns": [
      {"data": "code" },
      {"data": "name" },
      {"data": "gender" },
      {"data": "birthday" },
      {"data": "mobile" },
      {"data": "onboardingDate" },
      {"data": "jobTitle" },
      {"data": "jobLevel" },
      {"data": "projectId" }, //eq(8)
      {"data": "projectLevel" },
      // {"data": "customerMonthlyPayment" },
      // {"data": "actualPay" },
      {"data": "grossRate" },
      // {"data": "workingContractType" },
      {"data": "base" },
      {"data": "highestDegree" },
      {"data": null} // eq(-1)
    ],
    "createdRow": function (row, data, index) {
      $('td', row).eq(1).html(data.name);
      $('td', row).eq(1).append(getValueFromDataDictionaryById(data.status));

      $('td', row).eq(2).html(getValueFromDataDictionaryById(data.gender));
      $('td', row).eq(7).html(getValueFromDataDictionaryById(data.jobLevel));
      $('td', row).eq(8).html(getProjectBaseInformationById(data.projectId));
      $('td', row).eq(9).html(getValueFromDataDictionaryById(data.projectLevel));
      $('td', row).eq(10).html(data.grossRate<0?"<span class='text-bold text-danger'>"+data.grossRate+"</span>":data.grossRate);
      $('td', row).eq(11).html(getValueFromDataDictionaryById(data.base));

      var vhtml = '<div class=\"btn-group\">' +
        '<button type=\"button\" class=\"btn btn-sm btn-info\" data-toggle=\"modal\" data-target=\"#modal-default\" onclick=\"updateModal('+ index +')\"><i class="fa fa-edit"></i></button>' +
        '</div>';
      $('td', row).eq(-1).html(vhtml);
    }
  });//.buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
  // 刷新图表
  initDistrictChart();
  initOnsiteStaffChart();
  initTop10ProjectChart();
}
  
// ---------------------------------------
// Default Modal - Popup
function initModal() {
  $('#modal-code').val("");
  $('#modal-name').val("");
  initSelect2Option($('#modal-selOption-gender'), "/api/v1/sm/dd/staffGender/selOption")
  //Date picker
  $('#staffBirthday').datetimepicker({
        format: 'L'
  });
  $('#modal-birthday').val("");
  $('#modal-mobile').val("");
  $('#modal-onboardingDate').val("");
  //Date picker
  $('#onboardingDate').datetimepicker({
        format: 'L'
  });
  // 员工状态
  initSelect2Option($('#modal-selOption-status'), "/api/v1/sm/dd/staffStatus/selOption")
  $('#modal-jobTitle').val("");
  // $('#modal-jobLevel').val("");
  initSelect2Option($('#modal-selOption-jobLevel'), "/api/v1/sm/dd/jobLevel/selOption")
  // 项目名称
  initSelect2Option($('#modal-selOption-projectId'),"/api/v1/pm/projectBaseInformation/list/selOption")
  // $('#modal-projectLevel').val("");
  initSelect2Option($('#modal-selOption-projectLevel'), "/api/v1/sm/dd/projectLevel/selOption")
  $('#modal-workingContractType').val("");

  initSelect2Option($('#modal-selOption-base'), "/api/v1/sm/dd/city/selOption")
  $('#modal-highestDegree').val("");
  // $('#modal-hiringManagerCode').val("");
  initSelect2Option($('#modal-selOption-hiringManagerCode'), "/api/v1/sm/user/list/selOption")
  // Clean id when newly create a onsite staff.
  $('#modal-unique-id').val("")

  $('#modal-customerMonthlyPayment').val(0);
  $('#modal-actualPay').val(0);
  $('#modal-feeMargin').val(0)
  $('#modal-feeMargin').attr('disabled', 'true');
  $('#modal-grossRate').val(0)
  $('#modal-grossRate').attr('disabled', 'true');
  //Date picker
  $('#lastWorkingDate').datetimepicker({
        format: 'L'
  });
}
  
function updateModal(rowIndex) {
  var dataTable2 = $('#example1').dataTable()
  var nodes =  dataTable2.fnGetNodes();
  var data = dataTable2.fnGetData(nodes[rowIndex]);

  $('#modal-unique-id').val(data.id);
  $('#modal-code').val(data.code);
  $('#modal-name').val(data.name);
  // 员工性别
  updateSelect2Option($('#modal-selOption-gender'), "/api/v1/sm/dd/staffGender/selOption", data.gender)
  //Date picker
  $('#staffBirthday').datetimepicker({
        format: 'L'
  });
  $('#modal-birthday').val(data.birthday);
  $('#modal-mobile').val(data.mobile);
  //Date picker
  $('#onboardingDate').datetimepicker({
        format: 'L'
  });
  $('#modal-onboardingDate').val(data.onboardingDate);
  // 员工状态
  updateSelect2Option($('#modal-selOption-status'), "/api/v1/sm/dd/staffStatus/selOption", data.status)
  $('#modal-jobTitle').val(data.jobTitle);
  // 岗位级别
  updateSelect2Option($('#modal-selOption-jobLevel'), "/api/v1/sm/dd/jobLevel/selOption", data.jobLevel)
  // $('#modal-base').val(data.base);
  updateSelect2Option($('#modal-selOption-base'), "/api/v1/sm/dd/city/selOption", data.base)
  // 项目id和项目名称
  updateSelect2Option($('#modal-selOption-projectId'), "/api/v1/pm/projectBaseInformation/list/selOption", data.projectId)
  // 项目定级
  updateSelect2Option($('#modal-selOption-projectLevel'), "/api/v1/sm/dd/projectLevel/selOption", data.projectLevel)
  $('#modal-workingContractType').val(data.workingContractType);
  // 利润计算
  $('#modal-customerMonthlyPayment').val(data.customerMonthlyPayment);
  $('#modal-actualPay').val(data.actualPay);
  $('#modal-feeMargin').val(data.feeMargin);
  $('#modal-grossRate').val(data.grossRate);
  $('#modal-highestDegree').val(data.highestDegree);
  //$('#modal-hiringManagerCode').val(data.hiringManagerCode);
  updateSelect2Option($('#modal-selOption-hiringManagerCode'), "/api/v1/sm/user/list/selOption", data.hiringManagerCode)
  //Date picker
  $('#lastWorkingDate').datetimepicker({
        format: 'L'
  });
  if (data.lastWorkingDay != null) {
    $('#modal-lastWorkingDate').val(data.lastWorkingDay);
    $('#modal-lastWorkingDate').attr('disabled', 'true');
  }
  // 设置属性
  $('#modal-feeMargin').attr('disabled', 'true');
  $('#modal-grossRate').attr('disabled', 'true');
}
  
function saveModal() {
  var userObj = {
    id: $('#modal-unique-id').val(),
    code: $('#modal-code').val(),
    name: $('#modal-name').val(),
    gender: $('#modal-selOption-gender').select2("data")[0].id,
    birthday: new Date($('#modal-birthday').val()),
    mobile: $('#modal-mobile').val(),
    onboardingDate: new Date($('#modal-onboardingDate').val()),
    status: $('#modal-selOption-status').select2("data")[0].id,
    jobTitle: $('#modal-jobTitle').val(),
    jobLevel: $('#modal-selOption-jobLevel').select2("data")[0].id,
    projectId: $('#modal-selOption-projectId').select2("data")[0].id,
    projectLevel: $('#modal-selOption-projectLevel').select2("data")[0].id,
    workingContractType: $('#modal-workingContractType').val(),
    customerMonthlyPayment: $('#modal-customerMonthlyPayment').val(),
    actualPay: $('#modal-actualPay').val(),
    base: $('#modal-selOption-base').select2("data")[0].id,//$('#modal-base').val(),
    highestDegree: $('#modal-highestDegree').val(),
    lastWorkingDay: new Date($("#modal-lastWorkingDate").val()),
    hiringManagerCode: $('#modal-selOption-hiringManagerCode').select2("data")[0].id,
  };

  $.ajax({
    url: '/api/v1/osm/onsiteStaff/save',
    type: 'post',
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(userObj),
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      alert('Saved successfully.');
      $('#modal-default').modal('hide');
      initModal();
      refreshTableData();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("textStatus:" + textStatus + "; errorThrown:" +errorThrown);
      window.location.replace("/pages/dashboard");
    }
  });
}