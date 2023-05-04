$(function () {
  'use strict'

  // Fix display of .info-box
  $(".info-box").css("min-height", "73px")
  // $("section > div > section").each(function(d, e) {  $(e).css("height","260px");  })
  addToDoListItem(0, 3);

  let welcomeMeassage = "Hi，"+osmpLib.baseData.onlineUser.userName+"，欢迎来到我的工作台！";
  $("#say-hello").html(welcomeMeassage);

  $("#custom-tabs-two-finicail-tab").on("click", () => {
    setTimeout(() => {
      refreshDataTable("", "实施中");
    }, 200);
  })

  $("#custom-tabs-two-l2-tab").on("click", () => {
    
  })

  refreshProgressBar((new Date).format("yyyy-MM"));

  // 为了快速加载，汇总信息做延时处理
  osmpLoadingBox().show("projectTypeChart")
  setTimeout(() => {
    getUtmpProjectSummary("", "");
  }, 300);

  $("#btnDisplayCurMilestone").on("click", function() {
    makeMilestoneReport( JSON.parse(osmpTempKVPairs().get("curMilestoneProjects")) );
  })

  $("#btnDisplayDelayedMilestone").on("click", function() {
    makeMilestoneReport( JSON.parse(osmpTempKVPairs().get("delayedMilestoneProjects")) );
  })

  $("[type='checkbox']").on("change", function() {
    if ($("#chkDisplayAllProject").prop("checked")) {
      $("#chkDisplayCompletedProject").prop("checked", false);
      $("#chkDisplayCompletedProject").disabled = true;
      $("#chkDisplayPendigProject").prop("checked", false);
      $("#chkDisplayPendigProject").disabled = true; //
      $("#chkDisplayInsuranceProject").prop("checked", false);
      $("#chkDisplayInsuranceProject").disabled = true;
      refreshDataTable("", "");
    } else {
      $("#chkDisplayCompletedProject").disabled = false;
      $("#chkDisplayPendigProject").disabled = false;
      let status = [];
      if ($("#chkDisplayCompletedProject").prop("checked")) {
        $("#chkDisplayAllProject").prop("checked", false);
        status.push("完结");
      }
      if ($("#chkDisplayPresaleProject").prop("checked")) {
        $("#chkDisplayAllProject").prop("checked", false);
        status.push("售前");
      }
      if ($("#chkDisplayPendigProject").prop("checked")) {
        $("#chkDisplayAllProject").prop("checked", false);
        status.push("暂停");
      }
      if ($("#chkDisplayInsuranceProject").prop("checked")) {
        $("#chkDisplayAllProject").prop("checked", false);
        status.push("质保期");
      }
      if(status.length==0) {
        status.push("实施中");
      }
      let qryStatus = "";
      status.forEach( (e) => {
        qryStatus += e + ",";
      });
      
      refreshDataTable("", qryStatus);
    }
  })
})

function updateModal(data) {

}

function makeProjectCostDialog(data) {
  const p = data;
  let tableIndex = 0;
  let h = '<table class="table table-bordered table-striped display compact">'+
    '<thead><tr><th>No.</th><th>里程碑</th><th>最新计划</th><th>收入</th><th>实际成本</th><th>实际工时成本</th><th>实际差旅</th><th>实际采购</th></tr></thead><tbody>';
  p.forEach((e) => {
    let finishDate = "";
    if (e.cnfinishdate) {
      finishDate = new Date(e.cnfinishdate).format("yyyy-MM-dd")
    }
    h += '<tr><td>'+ (tableIndex++) +
      '</td><td>'+ e.name +
      '</td><td>'+ finishDate +
      '</td><td class="text-right text-bold">'+ formatMoney(e.income) +
      '</td><td class="text-right text-bold">'+ formatMoney(e.sjcost) +
      '</td><td class="text-right">'+ formatMoney(e.xgspentcost) +
      '</td><td class="text-right">'+ formatMoney(e.sjtravelcosts) +
      '</td><td class="text-right">'+ formatMoney(e.sjpurchasecosts) +'</td></tr>';
  })
  h += "</tbody></table>"
  let cardContainer = $("#cost-sum-dialog");
  cardContainer.children("div").html(h);
  cardContainer.children("div").css("box-shadow", "0 0 0 rgb(0,0,0), 0 0 0 rgb(0,0,0)");
  $(cardContainer.children("div").children("table")).DataTable({"aLengthMenu" : [10, 15, 30]});

}

function makeMilestoneReport(data) {
  const p = data;
  let h = '<table class="table table-bordered table-striped display compact">'+
    '<thead><tr><th>项目名称</th><th>状态</th><th>项目经理</th><th>当前里程碑</th><th>计划时间</th><th>倒计时</th></tr></thead><tbody>';
  p.forEach((e) => {
    h += '<tr><td>'+e.name +
    '</td><td>'+ e.status +
      '</td><td>'+ e.managerName +
      '</td><td>'+ e.nextmilestone +
      '</td><td>'+ new Date(e.plancomplettime).format("yyyy-MM-dd") +
      "</td><td>"+e.countdown+'</td></tr>';
  })
  h += "</tbody></table>"
  let cardContainer = $("#dlgCurMilestoneProjectReport");
  cardContainer.children("div").html(h);
  cardContainer.children("div").css("box-shadow", "0 0 0 rgb(0,0,0), 0 0 0 rgb(0,0,0)");
  $(cardContainer.children("div").children("table")).DataTable({"aLengthMenu" : [5, 10, 30]});

  $("#dlgCurMilestoneProjectReport").dialog({
    title: "项目里程碑状态报表",
    autoOpen: false,
    width: 1200,
    modal: true,
    buttons: {
      "确定": function () {
          $(this).dialog("close");
      },
    },
    close: function() {
      let report = $("#dlgCurMilestoneProjectReport");
      report.children("div").remove()
      report.append('<div class="card"></div>');
      $(".ui-dialog").remove();
    }
  });
  $("#dlgCurMilestoneProjectReport").dialog("open");
}

function makeProjectTypeChar(paramData) {
  var chartDom = document.getElementById('projectTypeChart');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: '5%',
      left: '5%',
      textStyle: {fontWeight: "bold"},
      formatter: (name) => {
        let a;
        option.series[0].data.forEach((e) => {
          if (e.name == name)
            a = e.name + " " +e.value;
        })
        return a;
      }
    },
    series: [
      {
        name: '项目状态',
        type: 'pie',
        center: ['65%', '50%'], // 横/纵坐标
        radius: ['35%', '70%'], // 内/外半径
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
        data: paramData
      }
    ]
  };
  option && myChart.setOption(option);
  window.addEventListener('resize', myChart.resize);

  // 这个图表绘制时间最长，待它画好了再绑定处理事件。
  const $SELECTOR_PUSHMENU_BTN = $('[data-widget="pushmenu"]');
  $SELECTOR_PUSHMENU_BTN.on('collapsed.lte.pushmenu shown.lte.pushmenu', () => {
    if ($("#custom-tabs-two-l2-tab").hasClass("active")) {
      setTimeout(() => {
        myChart.resize();
      }, 200);
    } else {
      setTimeout(() => {
        refreshDataTable("", "实施中");
      }, 300);
    }
  });
}

function getUtmpProjectSummary(qryHead, qryStatus) {
  // pmsGet("/api/v1/pub/utmp/project/queryMilestoneVersion", {projectId: "2377"}, (e) => {
  //   console.log(e);
  // })
  pmsGet("/api/v1/pub/utmp/project/summary", {
    async: true,
    status: qryStatus,
    head: qryHead,
    ssascription: "2097164, 2097123, 2097173, 2097177, 2097179, 2097180, 2341059, 2920991, 3167706"
  }, (data) => {
    let allProjects = data.data;
    let a=0, b=0, c=0, deliverd=0, opening=0, pending=0, h=0, preSale=0, protectionProject=0, notDefined=0;
    let curMilestoneProjects = [];
    let delayedMilestoneProjects = [];
    allProjects.forEach((e) => {
      if (e.plancomplettime) {
        // 筛选当月里程碑项目并暂存本地
        let milestoneDuration = new Date(e.plancomplettime).getUTCMonth() - new Date().getUTCMonth()
        if ( milestoneDuration == 0) {
          if (e.status=="实施中" || e.status=="质保期") {
            curMilestoneProjects.push(e);
          }
        } else if( e.countdown.indexOf("已超时")>=0 ) {
          if (e.status=="实施中" || e.status=="质保期") {
            delayedMilestoneProjects.push(e);
          }
        }
      }
      a+= e.contractamount;
      b+= e.income;
      c+= e.actualpayment;
      if (e.status=="完结") {
        deliverd += 1;
      }
      if (e.status=="实施中") {
        opening += 1;
      }
      if (e.status=="暂停") {
        pending += 1;
      }
      if (e.status=="失效") {
        h += 1;
      }
      if (e.status=="售前") {
        preSale += 1;
      }
      if (e.status=="质保期") {
        protectionProject += 1;
      }
      if (e.status=="无") {
        notDefined += 1;
      }
    }) // .end of forEach()
    osmpTempKVPairs().set("curMilestoneProjects", null);
    osmpTempKVPairs().set("curMilestoneProjects", JSON.stringify(curMilestoneProjects));
    osmpTempKVPairs().set("delayedMilestoneProjects", null);
    osmpTempKVPairs().set("delayedMilestoneProjects", JSON.stringify(delayedMilestoneProjects));
    $("#ib-onsiteStaff").html(formatMoney(a));
    $("#ib-openProject").html(formatMoney(b));
    $("#ib-deliveredProject").html(formatMoney(c));
    $("#ib-total-projects").html(allProjects.length);
    $("#ib-project-cost").html(0);
    $("#ib-gross-rate").html(0);
    // Prepare chart display.
    var chartData = [
      { value: opening, name: '实施中' },
      { value: protectionProject, name: '质保期' },
      { value: preSale, name: '售前' },
      { value: deliverd, name: '完结' },
      { value: pending, name: '暂停' },
      { value: h, name: '失效' },
      { value: notDefined, name: '无' }
    ];
    makeProjectTypeChar(chartData);
  })
}

function refreshDataTable(qryHead, qryStatus) {
  new OsmpDataTable("#pms-data-table", "/api/v1/pub/utmp/project/detail", 
  {
    status: qryStatus,
    head: qryHead,
    ssascription: "2097164, 2097123, 2097173, 2097177, 2097179, 2097180, 2341059, 2920991, 3167706"
  }, 
  [
    {"data": "projectnum", "colName":"编号"},
    {"data": "name", "colName":"项目名称"},
    {"data": "contractname", "colName":"合同名称"},
    {"data": "isspecialproject", "colName":"特批"},
    {"data": "crmType", "colName":"类型"},
    {"data": "ssYwAscription", "colName":"业务归属"},
    {"data": "status", "colName":"状态"},
    {"data": "contractamount", "colName":"合同额"},
    {"data": "income", "colName":"收入"},
    {"data": "actualpayment", "colName":"回款"},
    {"data": "nextmilestone", "colName":"Next Milestone"},
    {"data": "plancomplettime", "colName":"Planned Date"},
    // {"data": "plancomplettime" },
    // {"data": "pauseTime" },
  ],
  {
    bFilter: true,
    bExported: false,
    "aLengthMenu" : [7, 30, 50],
    "createdRow": function(row, data, index) {
      $('td', row).eq(1).html(data.name+" | pm:"+data.managerName+" | qa:"+data.qaName);
      let contractname = $('td', row).eq(2).html()
      contractname = contractname.length>20?contractname.substring(0, 17)+"...":contractname;
      $('td', row).eq(2).html(contractname+" | sale:"+data.saleName);
      // 
      let classStatus = "", classMoney = "";
      switch (data.status) {
        case "实施中":
          classStatus = "text-primary";
          classMoney = "text-primary text-bold text-right" ;
          break;
        case "暂停":
          classStatus = "text-danger";
          classMoney = "text-danger text-bold text-right" ;
          break;
        case "完结":
          classStatus = "text-success";
          classMoney = "text-success text-bold text-right" ;
          break;
        default:
          classStatus = "text-gray";
          classMoney = "text-gray text-bold text-right" ;
          break;
      }
      $('td', row).eq(6).html('<span class="'+ classStatus+'">'+ data.status +'</span>');
      $('td', row).eq(7).html('<span class="'+ classMoney+'">'+formatMoney(data.contractamount)+'</span>');
      $('td', row).eq(8).html('<span class="'+ classMoney+'">'+formatMoney(data.income)+'</span>');
      $('td', row).eq(9).html('<span class="'+ classMoney+'">'+formatMoney(data.actualpayment)+'</span>');
      if (data.countdown) {
        let countdownClass = data.countdown.includes("剩余")?"text-success text-bold text-left":"text-danger text-bold text-left"
        $('td', row).eq(11).html((new Date(data.plancomplettime)).format("yyyy-MM-dd") + '<span class="'+countdownClass+'">'+" ("+ data.countdown +')</span>');
      } else {
        $('td', row).eq(11).html("")
      }
    },
    "fnOperationButtonHandler": (data)=>{

      pmsGet("/api/v1/pub/utmp/project/queryMilestoneVersion", {projectId: data.id}, (e) => {
        console.log(e.data)
        makeProjectCostDialog(e.data);
      })
      let $dialog = $("#project-detail-information-dialog");
      $($dialog.find('.modal-title')).html(data.name);
      $dialog.modal({ show: true, backdrop: 'static' });
    }
  });
}

function refreshProgressBar(monthDuration) {
  pmsGet("/api/v1/rc/specialistMonthlyPerformance/"+monthDuration, {}, function(data) {
    let recruitmentSpecialistCode = ["dingjianv", "xuyuping", "miaoying", "yangshuoning", "chenhan"];
    let recruitmentSpecialistName = ["丁佳女", "徐俞萍", "苗颖", "杨烁凝", "陈含"];
    let recruitmentSpecialistScore = [0, 0, 0, 0, 0];
    data.data.forEach(e => {
      // Goal Completion
      // 月度收入
      let idx = recruitmentSpecialistCode.indexOf(e.hiringManagerCode);
      recruitmentSpecialistScore[idx] = e.c;
    });

    const lineMargin = 1.5;
    // addProgressBar({target: "#pgb-monthly-revenue", title: title: recruitmentSpecialistName[0], progress: recruitmentSpecialistScore[0], goal: 4, background: "bg-primary"});
    addProgressBar({target: "#pgb-monthly-1", title: recruitmentSpecialistName[1], progress: recruitmentSpecialistScore[1], goal: 4, background: "bg-teal"}, lineMargin);
    addProgressBar({target: "#pgb-monthly-2", title: recruitmentSpecialistName[2], progress: recruitmentSpecialistScore[2], goal: 3, background: "bg-success"}, lineMargin);
    addProgressBar({target: "#pgb-monthly-3", title: recruitmentSpecialistName[3], progress: recruitmentSpecialistScore[3], goal: 3, background: "bg-primary"}, lineMargin);
    //addProgressBar({target: "#pgb-monthly-4", title: recruitmentSpecialistName[4], progress: recruitmentSpecialistScore[4], goal: 3, background: "bg-primary"}, lineMargin);
  }); //pmsGet
}

$("#topPage1").on("click", function () {
  addToDoListItem(0, 3);
})

$("#topPage2").on("click", function () {
  addToDoListItem(3, 6);
})

/**
 * Append TODO List at page.
 * @param {Array} data 
 */
function addToDoListItem(pageStart, pageEnd) {
  pmsGet("/api/v1/pm/pbi/all", {status: 10}, function(data){
    $('#pms-todo-list').children().remove();
    $todoUL = $("<ul></ul>", {"class": "todo-list", "data-widget": "todo-list"});

    let totalPages = data.data.length;
    pageEnd = pageEnd>totalPages?totalPages:pageEnd;
    for (let idx = pageStart; idx < pageEnd; idx++) {
      const e = data.data[idx];
      $todoItem = $("<li />").append('<span class="handle"><i class="fas fa-ellipsis-v"></i></span>'+
      '<div class="icheck-primary d-inline ml-2">'+
      '<input type="checkbox" value="" name="'+ e.id +'" id=prj"'+ e.id +'">'+
      '<label for=prj"'+ e.id +'"></label></div>'+
      '<span class="text text-right">'+ e.name+ ' | ' + e.description + ' | ' 
        + getUserNameByUserCode(e.hiringManager) +'</span>'+
      '<small class="badge badge-primary">'+
      '<i class="far fa-clock"></i>'+ new Date(e.entryDate).format('yyyy-MM-dd') +'</small>'+
      '<div class="tools"><i class="fas fa-edit"></i><i class="fas fa-trash-o"></i></div>');
      $todoUL.append($todoItem);
    }

    $('#pms-todo-list').append($todoUL)
  })
}