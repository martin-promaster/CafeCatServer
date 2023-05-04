$(function () {
  'use strict'
    
  // Retrieval data of table 'rptPerformance' from DATABASE
  var chartData = {
    // labels
    labels: [],
    // datas
    monthlyIncreasedStaff: [], 
    monthlyQuitStaff: [],
    onsiteStaff: [],
    monthlyRevenue: [],
    monthlyCost: [],
    monthlyProfit: [],
    estimatedRevenue: 0,
    estimatedProfit: 0
  };

  pmsGet("/api/v1/dashboard/rptPerformance", {}, function(data) {
    data.data.forEach(e => {
      chartData.labels.push(e.summaryDuration);
      // sales bar chart
      chartData.monthlyIncreasedStaff.push(e.monthlyIncreasedStaff);
      chartData.monthlyQuitStaff.push(e.monthlyQuitStaff);
      chartData.onsiteStaff.push(e.onsiteStaff);
      // revenue bar chart
      chartData.monthlyRevenue.push(e.monthlyRevenue);
      chartData.monthlyCost.push(e.monthlyCost);
      // profit bar chart
      chartData.monthlyProfit.push(e.monthlyProfit);
      // unused
      chartData.estimatedRevenue += e.monthlyRevenue!=null?e.monthlyRevenue:0;
      chartData.estimatedProfit += e.monthlyProfit!=null?e.monthlyProfit:0;
    });
  });


  /* ChartJS
  * -------
  * Here we will create a few charts using ChartJS
  */
  var barChartOptions = {
    responsive              : true,
    maintainAspectRatio     : false,
    datasetFill             : false
  }

  //-------------
  //- BAR CHART -
  // - sales
  //-------------
  var salesBarChartData = {
    //labels: ['January', 'February', 'March', 'April', 'May', 'June', 
    //          'July', 'August', 'September', 'October', 'November', 'December'],
    labels: chartData.labels,
    datasets: [
      {
        label               : '新增入项',
        backgroundColor     : 'rgba(32, 201, 151,0.9)',
        borderColor         : 'rgba(32, 201, 151,0.8)',
        pointRadius          : false,
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(32, 201, 151,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(32, 201, 151,1)',
        data                : chartData.monthlyIncreasedStaff
      },
      {
        label               : '离职人数',
        backgroundColor     : 'rgba(210, 214, 222, 1)',
        borderColor         : 'rgba(210, 214, 222, 1)',
        pointRadius         : false,
        pointColor          : 'rgba(210, 214, 222, 1)',
        pointStrokeColor    : '#c1c7d1',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data                : chartData.monthlyQuitStaff
      },
      {
        label               : '在岗总人数',
        backgroundColor     : 'rgba(0,123,255,0.9)',
        borderColor         : 'rgba(0,123,255,0.8)',
        pointRadius          : false,
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(0,123,255,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(0,123,255,1)',
        data                :  chartData.onsiteStaff
      }
    ]
  }

  var salesBarChartCanvas = $('#salesChart').get(0).getContext('2d')
  new Chart(salesBarChartCanvas, {
    type: 'bar',
    data: salesBarChartData,
    options: barChartOptions
  })

  //-------------
  //- BAR CHART -
  // - revenue
  //-------------
  var revenueBarChartData = {
    //labels: ['January', 'February', 'March', 'April', 'May', 'June', 
    //          'July', 'August', 'September', 'October', 'November', 'December'],
    labels: chartData.labels,
    datasets: [
      {
        label               : '月度成本',
        backgroundColor     : 'rgba(32, 201, 151,0.9)',
        borderColor         : 'rgba(32, 201, 151,0.8)',
        pointRadius          : false,
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(32, 201, 151,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(32, 201, 151,1)',
        data                : chartData.monthlyCost
      },
      {
        label               : '月度收入',
        backgroundColor     : 'rgba(0,123,255,0.9)',
        borderColor         : 'rgba(0,123,255,0.8)',
        pointRadius          : false,
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(0,123,255,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(0,123,255,1)',
        data                :  chartData.monthlyRevenue
      }
    ]
  }

  var revenueBarChartCanvas = $('#revenueChart').get(0).getContext('2d')
  new Chart(revenueBarChartCanvas, {
    type: 'bar',
    data: revenueBarChartData,
    options: barChartOptions
  })

  //-------------
  //- BAR CHART -
  // - revenue
  //-------------
  var profitBarChartData = {
    //labels: ['January', 'February', 'March', 'April', 'May', 'June', 
    //          'July', 'August', 'September', 'October', 'November', 'December'],
    labels: chartData.labels,
    datasets: [
      {
        label               : '月度利润',
        backgroundColor     : 'rgba(0,123,255,0.9)',
        borderColor         : 'rgba(0,123,255,0.8)',
        pointRadius          : false,
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(0,123,255,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(0,123,255,1)',
        data                :  chartData.monthlyProfit
      }
    ]
  }

  var profitBarChartCanvas = $('#profitChart').get(0).getContext('2d')
  new Chart(profitBarChartCanvas, {
    type: 'bar',
    data: profitBarChartData,
    options: barChartOptions
  })

  //---------------------------
  // - END MONTHLY SALES CHART -
  //---------------------------

  pmsGet("/api/v1/dashboard/infobox", {}, function(data) {
    var infoBox = data.data;
    $("#ib-onsiteStaff").text(infoBox.onsiteStaff)
    $("#ib-openProject").text(infoBox.openProject)
    $("#ib-deliveredProject").text(infoBox.deliveredProject) //.html("<small>%</small>")
    $("#ib-grossRate").html(formatPercent(infoBox.grossRate,2)+"<small>%</small>")
  
    addDiscriptionBlock("#monthlyRevenue", 
      infoBox.monthlyRevenue, infoBox.monthlyRevenueIncreaseRate, "月度总收入/TOTAL REVENUE");
    addDiscriptionBlock("#monthlyCost", 
      infoBox.monthlyCost, infoBox.monthlyCostIncreaseRate, "月度总成本/TOTAL COST");
    addDiscriptionBlock("#monthlyPayment", 
      infoBox.monthlyPayment, infoBox.monthlyPaymentIncreaseRate, "月度薪资成本/PAYMENT COST");
    addDiscriptionBlock("#monthlyProfit", 
      infoBox.monthlyProfit, infoBox.monthlyProfitIncreaseRate, "月度利润/TOTAL PROFIT");

    // Goal Completion
    // 月度收入
    addProgressBar({target: "#pgb-monthly-revenue", title: "月度收入/Revenue", progress: infoBox.monthlyRevenue, goal: 250*10000, background: "bg-primary"});
    // 月度利润
    addProgressBar({target: "#pgb-monthly-profit", title: "月度净利润/Profit", progress: infoBox.monthlyProfit, goal: 25*10000, background: "bg-warning"});
    // 月度在岗人数
    addProgressBar({target: "#pgb-monthly-onsite-staff", title: "月度在岗人数/Onsite Staff", progress: infoBox.onsiteStaff, goal: 120, background: "bg-danger"});
    // 月度利润
    addProgressBar({target: "#pgb-estimated-revenue", title: "年度收入/Est. Revenue", progress: chartData.estimatedRevenue, goal: 3000*10000, background: "bg-success"});
    // 年度利润
    addProgressBar({target: "#pgb-estimated-profit", title: "年度利润/Est. Profit", progress: chartData.estimatedProfit, goal: 300*10000, background: "bg-info"});
  });
});

function addDiscriptionBlock(target, value, rate, description) {
  var $discriptionBlock = $(target)
  if(rate>=0){
    $("<span />", {class: "description-percentage text-danger"})
      .append("<i class=\"fas fa-caret-up\"></i>" + formatPercent(rate,2) + "%")
      .appendTo($discriptionBlock);
    $("<h5 />", {class:"description-header"}).append(""+formatMoney(value))
      .appendTo($discriptionBlock);
    $("<span />", {class:"description-text"}).append(description)
      .appendTo($discriptionBlock);
  } else {
    $("<span />", {class: "description-percentage text-success"})
      .append("<i class=\"fas fa-caret-down\"></i>" + formatPercent(rate,2) + "%")
      .appendTo($discriptionBlock);
    $("<h5 />", {class:"description-header"}).append(""+formatMoney(value))
      .appendTo($discriptionBlock);
    $("<span />", {class:"description-text"}).append(description)
      .appendTo($discriptionBlock);
  }
}