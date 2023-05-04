var deptIds = [];
var departmentLists = {
	yyglzx: "2097164",
	jfzxjr: "2097180",
	jfzxito: "2341059",
	jfzxitofdu: "2680741",
	jfzxitoidu: "2680747",
	jfzxitondu: "2680748",
	jfzxitoeou: "2423224"
}
var allStaffs = [];
var allStaffMailList = [];
var weeks = ["SUN","MON","TUE","WED","THR","FRI","SAT",];

$(function () {
	// init parameters.
	$("#fromDate").val((new Date()).format("yyyy-MM") + "-01")
	$("#toDate").val((new Date()).format("yyyy-MM-dd"))
	$("#ratioValue").html("数据结果:填报比例[<=" + $("#ratio").val() + "%]的人员列表")
	deptIds.push(departmentLists.yyglzx)
	// Refresh data
	refreshTable(deptIds);
});

// Event handler
$("#ratio").on("input propertychange", function () {
	$("#ratioValue").html("数据结果:填报比例[<=" + $("#ratio").val() + "%]的人员列表")
	refreshTable(deptIds);
});

$("input[type=date]").on("change", function () {
	refreshTable(deptIds);
})

$("input[type=text]").on("input propertychange", function () {
	refreshTable(deptIds);
})

$("#chkDisplayAllStaff").on("change", function () {
	// let flag = $("#chkDisplayAllStaff").prop("checked");
	// $("#chkDisplayNC").prop("disabled", !flag)
	refreshTable(deptIds);
})

$("#chkDisplayAllNotIn2Days").on("change", function () {
	// let flag = $("#chkDisplayAllStaff").prop("checked");
	// $("#chkDisplayNC").prop("disabled", !flag)
	refreshTable(deptIds);
}) 

$("#chkDisplayAllVacation").on("change", function () {
	let displayFlag = $("#chkDisplayAllVacation").prop("checked")?"":"none";
	$('th[style]').css("display", displayFlag)
	$('td[style]').css("display", displayFlag)
}) //


$("#sendTimesheetMenthioMail").on("click", function(){
	// Open pop-up message dialog
	$('#myModal').modal({
		backdrop:'static'      //<span style="color:#FF6666;">设置模态框之外点击无效</span>
	})
	$('#myModal').modal('show');   //弹出模态框
	setTimeout(()=> {
		pmsPost("/api/v1/pub/send/mail", allStaffMailList, function(data){
			// Close pop-up message dialog
			$('#myModal').modal('hide');
		})
	}, 1000);
})

$("#chkDisplayNC").on("change", function () {
	$("#ncStaffMessage").html("");
	if (!$("#chkDisplayNC").prop("checked")) {
		$("#ncStaffMessage").html("");
		return;
	}
	// Open popup dialog.
	$('#myModal').modal({
		backdrop:'static'      //<span style="color:#FF6666;">设置模态框之外点击无效</span>
	})
	$('#myModal').modal('show');   //弹出模态框

	let asycCounter = 0;
	let pageTotal = 11;
	let xAccessToken = osmpLib.utmpXAcessToken()
	let respData = [];
	for (let pageNum = 1; pageNum < pageTotal; pageNum++) {
		let reqData = JSON.stringify({
			"checkStatus": false,
			"name": $("#createTrueName").val(),
			"queryLike": "",
			"departmentIds": [departmentLists.yyglzx],
			"ribaoDate": [
				(new Date($("#fromDate").val())).subDays(1).format("yyyy-MM-dd") + "T16:00:00.000Z",
				(new Date($("#toDate").val())).subDays(1).format("yyyy-MM-dd") + "T16:00:00.000Z"
			],
			"isWaiBao": null,
			"type": null,
			"pageNum": pageNum,
			"pageSize": 1000,
			"orders": [],
			"systemDateStart": $("#fromDate").val() + " 00:00:00",
			"systemDateEnd": $("#toDate").val() + " 23:59:59"
		})
		var reqUrl = "https://utmpapi.utry.cn/utmp-admin-api/userAllWorkload/page/query"
		$.ajax({
			// async: false,
			headers: {
				"x-access-token": xAccessToken
			},
			url: reqUrl,
			type: "POST",
			contentType: "application/json",
			dataType: "json",
			data: reqData,
			// beforeSend: function(){       //ajax发送请求时的操作，得到请求结果前有效
			// },
			complete: function(){            //ajax得到请求结果后的操作
				asycCounter++;
				$("#myModalMsg").html("队列中第[" + asycCounter + "]个异步请求，正在获取后台数据...");
				if (asycCounter == 10) {
					updateNCStaffMessage(respData);
				}
			},
			success: function (data, textStaus, jqXHR) {
				//respData = data.data.list;
				if (data.data.list.length > 0) {
					respData[pageNum] = data.data.list;
				}
			}
		}); // .ajax
	}
})

//
// Public Functions
//
function updateNCStaffMessage(param) {
	let msg = "";
	for (let idx = 1; idx < param.length; idx++) {
		const data = param[idx];
		data.forEach(element => {
			if (element.threeDept == '生态合作部') {
				return;
			}
			let userName = element.userName.length<3?element.userName+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;':element.userName;
			if (element.projectName == "其他" || element.projectName == "部门工作") {
				msg += "[" + element.dailyTime +"] "+ userName +" | <strong>"+ element.projectName+"</strong> | "+ element.taskType+" | "
						+ element.taskTypeName +" | "+ element.workload +" Hrs | "+ element.remark + "<br>";
			}
		}); // forEach()
	} // for()
	$("#ncStaffMessage").html(msg).addClass("text-primary");
	$('#myModal').modal('hide');  //隐藏模态框
}


function refreshTable(deptIds) {
	// Init table
	$("#result tr:not(:first)").html("");
	$("#table-finicial tr:not(:first)").html("");
	$("#table-internet tr:not(:first)").html("");
	$("#table-newbusiness tr:not(:first)").html("");
	$("#table-ecologic tr:not(:first)").html("");
	$("#table-communication tr:not(:first)").html("");
	// Init page
	$("#totalMsg").html("");
	$("#mail-list").html("");
	$("#mail-body").html("");
	$("#ncStaffMessage").html("");
	$("#chkDisplayNC").prop("checked", false)
	// Get default value
	var ratio = $("#ratio").val();
	var createTrueName = $("#createTrueName").val();
	// Query report ratio
	var reqData = JSON.stringify({
		"createTrueName": createTrueName,
		"beginEndDate": [(new Date($("#fromDate").val())).subDays(1).format("yyyy-MM-dd") + "T16:00:00.000Z",
		(new Date($("#toDate").val())).subDays(1).format("yyyy-MM-dd") + "T16:00:00.000Z"],
		"projectStatus": null,
		"createTime": ["", ""],
		"leaveStatus": null,
		"isJobMastWorkStatus": null,
		"departmentIds": deptIds,
		"pageNum": 1,
		"pageSize": 500,
		"orders": [],
		"beginDate": $("#fromDate").val() + " 00:00:00",
		"endDate": $("#toDate").val() + " 23:59:59",
		"begincreateTime": null, "endcreateTime": null
	});
	var reqUrl = "https://utmpapi.utry.cn/utmp-admin-api/workload/page/query";
	$.ajax({
		async: false,
		beforeSend: function (req) {
			let token = osmpLib.utmpXAcessToken()
			req.setRequestHeader("x-access-token", token);
		},
		url: reqUrl,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: reqData,
		success: function (data, textStaus, jqXHR) {
			if (data.code != 1) {
				$("#totalMsg").append("UTMP接口调用返回错误，错误信息：" + data.msg);
			} else {
				allStaffs = [];
				allStaffMailList = [];
				let responseDate = data.data.list;
				let onsiteStaff = 0;
				let thirdpartyStaff = 0;
				let mailLoop = "<h5>运营管理中心</h5>";
				let allMailLoop = "";
				// 运营管理中心
				let allStaffSum = 0;
				for (let index = 0; index < responseDate.length; index++) {
					const element = responseDate[index];
					//if (element.threeDept == null && element.statutoryWriteRate <= ratio) {
					if (element.statutoryWriteRate <= ratio) {
						if ($("#chkDisplayAllStaff").prop("checked")) {
							allStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#result").append(makeTR(element))
							allMailLoop += element.email + "; ";
							allStaffMailList.push({createTrueName: element.createTrueName,
								email: element.email,
								twoDept: element.twoDept,
								deletionDaysNum: element.deletionDaysNum,
								statutoryWriteRate: element.statutoryWriteRate
							});
						} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
							if ( element.statutoryWriteRate >= 100 ) {
								continue;
							}
							allStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#result").append(makeTR(element))
							allMailLoop += element.email + "; ";
							allStaffMailList.push({createTrueName: element.createTrueName,
								email: element.email,
								twoDept: element.twoDept,
								deletionDaysNum: element.deletionDaysNum,
								statutoryWriteRate: element.statutoryWriteRate
							});
						} else {
							if (element.deletionDaysNum != 0) {
								allStaffSum++;
								$("#result").append(makeTR(element))
								allMailLoop += element.email + "; ";
								allStaffMailList.push({createTrueName: element.createTrueName,
									email: element.email,
									twoDept: element.twoDept,
									deletionDaysNum: element.deletionDaysNum,
									statutoryWriteRate: element.statutoryWriteRate
								});
							}
						}
					}
				}
				$("#custom-tabs-two-l2-tab").html("运营管理中心 ("+ allStaffSum +")");
				onsiteStaff += allStaffSum;
				// 解决方案部
				let fbuStaffSum = 0;
				for (let index = 0; index < responseDate.length; index++) {
					const element = responseDate[index];
					if (element.twoDept == "解决方案部" && element.statutoryWriteRate <= ratio) {
						if ($("#chkDisplayAllStaff").prop("checked")) {
							fbuStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-finicial").append(makeTR(element))
							mailLoop += element.email + "; "
						} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
							if ( element.statutoryWriteRate >= 100 ) {
								continue;
							}
							fbuStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-finicial").append(makeTR(element))
							mailLoop += element.email + "; "
						} else {
							if (element.deletionDaysNum != 0) {
								fbuStaffSum++
								$("#table-finicial").append(makeTR(element))
								mailLoop += element.email + "; "
							}
						}
					}
				}
				$("#custom-tabs-two-finicail-tab").html("解决方案部 ("+ fbuStaffSum +")");
				onsiteStaff += fbuStaffSum;
				// 产品部
				let ibuStaffSum = 0;
				mailLoop += "<br>"
				for (let index = 0; index < responseDate.length; index++) {
					const element = responseDate[index];
					if (element.twoDept == "产品部" && element.statutoryWriteRate <= ratio) {
						if ($("#chkDisplayAllStaff").prop("checked")) {
							ibuStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-internet").append(makeTR(element))
							mailLoop += element.email + "; "
						} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
							if ( element.statutoryWriteRate >= 100 ) {
								continue;
							}
							ibuStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-internet").append(makeTR(element))
							mailLoop += element.email + "; "
						} else {
							if (element.deletionDaysNum != 0) {
								ibuStaffSum++
								$("#table-internet").append(makeTR(element))
								mailLoop += element.email + "; "
							}
						}
					}
				}
				$("#custom-tabs-two-internet-tab").html("产品部 ("+ ibuStaffSum +")");
				onsiteStaff += ibuStaffSum;
				// 项目交付部
				let nbuStaffSum = 0;
				mailLoop += "<br>"
				for (let index = 0; index < responseDate.length; index++) {
					const element = responseDate[index];
					if (element.twoDept == "项目交付部" && element.statutoryWriteRate <= ratio) {
						if ($("#chkDisplayAllStaff").prop("checked")) {
							nbuStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-newbusiness").append(makeTR(element))
							mailLoop += element.email + "; "
						} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
							if ( element.statutoryWriteRate >= 100 ) {
								continue;
							}
							nbuStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-newbusiness").append(makeTR(element))
							mailLoop += element.email + "; "
						} else {
							if (element.deletionDaysNum != 0) {
								nbuStaffSum++
								$("#table-newbusiness").append(makeTR(element))
								mailLoop += element.email + "; "
							}
						}
					}
				}
				$("#custom-tabs-two-newbusiness-tab").html("项目交付部 ("+ nbuStaffSum +")");
				onsiteStaff += nbuStaffSum;
				// 新业务DU
				let itoStaffSum = 0;
				mailLoop += "<br>"
				for (let index = 0; index < responseDate.length; index++) {
					const element = responseDate[index];
					if (element.twoDept == "ITO交付部" && element.statutoryWriteRate <= ratio) {
						if ($("#chkDisplayAllStaff").prop("checked")) {
							itoStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-ecologic").append(makeTR(element))
							mailLoop += element.email + "; "
						} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
							if ( element.statutoryWriteRate >= 100 ) {
								continue;
							}
							itoStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-ecologic").append(makeTR(element))
							mailLoop += element.email + "; "
						} else {
							if (element.deletionDaysNum != 0) {
								itoStaffSum++
								$("#table-ecologic").append(makeTR(element))
								mailLoop += element.email + "; "
							}
						}
					}
				}
				$("#custom-tabs-two-ecologic-tab").html("ITO交付部 ("+ itoStaffSum +")");
				onsiteStaff += itoStaffSum;
				// 通讯及低代码研发部
				let communicationStaffSum = 0;
				mailLoop += "<br>"
				for (let index = 0; index < responseDate.length; index++) {
					const element = responseDate[index];
					if (element.twoDept == "通讯及低代码研发部" && element.statutoryWriteRate <= ratio) {
						if ($("#chkDisplayAllStaff").prop("checked")) {
							communicationStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-communication").append(makeTR(element))
							mailLoop += element.email + "; "
						} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
							if ( element.statutoryWriteRate >= 100 ) {
								continue;
							}
							communicationStaffSum++;
							allStaffs.push(element.createTrueName);
							$("#table-communication").append(makeTR(element))
							mailLoop += element.email + "; "
						} else {
							if (element.deletionDaysNum != 0) {
								communicationStaffSum++
								$("#table-communication").append(makeTR(element))
								mailLoop += element.email + "; "
							}
						}
					}
				}
				$("#custom-tabs-two-communication-tab").html("通讯及低代码研发部 ("+ communicationStaffSum +")");
				onsiteStaff += communicationStaffSum;
				// 外包人员
				// mailLoop += "<h5>生态合作：</h5>"
				// for (let index = 0; index < responseDate.length; index++) {
				// 	const element = responseDate[index];
				// 	if (element.threeDept == "生态合作部" && element.statutoryWriteRate <= ratio) {
				// 		if ($("#chkDisplayAllStaff").prop("checked")) {
				// 			thirdpartyStaff++
				// 			$("#table-ecologic").append(makeTR(element))
				// 			mailLoop += element.email + "; "
				// 		} else if ($("#chkDisplayAllNotIn2Days").prop("checked")) { // chkDisplayAllNotIn2Days
				// 			if ( element.statutoryWriteRate >= 100 ) {
				// 				continue;
				// 			}
				// 			thirdpartyStaff++
				// 			$("#table-ecologic").append(makeTR(element))
				// 			mailLoop += element.email + "; "
				// 		} else {
				// 			if (element.deletionDaysNum != 0) {
				// 				thirdpartyStaff++
				// 				$("#table-ecologic").append(makeTR(element))
				// 				mailLoop += element.email + "; "
				// 			}
				// 		}
				// 	}
				// }
				// $("#custom-tabs-two-ecologic-tab").html("生态合作部 ("+ thirdpartyStaff +")");
				// 汇总行信息
				$("#totalMsg").append("运营管理中心: " + onsiteStaff/2 + "人 | 解决方案部："+ fbuStaffSum +" | 产品部："+ ibuStaffSum +
					" | 项目交付部："+ nbuStaffSum +" | ITO交付部："+ itoStaffSum +" | <br>生态合作: " + thirdpartyStaff + "人")
				$("#mail-list").append(mailLoop)
				// Binding event to buttons.
				$("input[type=button]").on("click", function () {
					updateLogDetail(this)
				})
			}
		}
	}); // .ajax()
}

function updateLogDetail(dom) {
	$("#detailed-dialog").modal({ show: true, backdrop: 'static' })
	$("#logDetail").html("")
	var reqData = JSON.stringify({
		"checkStatus": false,
		"name": $(dom).data("u"),
		"queryLike": "",
		"departmentIds": deptIds,
		"ribaoDate": [
			(new Date($("#fromDate").val())).subDays(1).format("yyyy-MM-dd") + "T16:00:00.000Z",
			(new Date($("#toDate").val())).subDays(1).format("yyyy-MM-dd") + "T16:00:00.000Z"
		],
		"isWaiBao": null,
		"type": null,
		"pageNum": 1,
		"pageSize": 100,
		"orders": [],
		"systemDateStart": $("#fromDate").val() + " 00:00:00",
		"systemDateEnd": $("#toDate").val() + " 23:59:59"
	})
	var reqUrl = "https://utmpapi.utry.cn/utmp-admin-api/userAllWorkload/page/query"
	var respData;
	$.ajax({
		async: false,
		headers: {
			"x-access-token": osmpLib.utmpXAcessToken()
		},
		url: reqUrl,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: reqData,
		success: function (data, textStaus, jqXHR) {
			$timeline = $(".timeline");
			$timeline.empty();
			respData = data.data.list;
			respData.forEach(element => {
				var fullProjectName = "<b>" + element.projectName + "</b>";
				if (element.pocProjectName != null) {
					fullProjectName += " (" + element.pocProjectName + ")"
				}
				fullProjectName += " (" + element.taskType + ") "
				fullProjectName += "<span class='badge badge-primary'>" + element.taskTypeName + "</span>";

				addTimelineMessage($timeline,
					element.dailyTime + "  " + (function (ymd) {
						return weeks[(new Date(ymd)).getDay()];
					})(element.dailyTime),
					fullProjectName,
					"日报明细：" + element.remark,
					element.createDailyTime + " by " + element.userName);
			});

		}
	}); // .ajax
}

function makeTR(ele) {
	var htmlstr;
	htmlstr = "<tr>"
	htmlstr += "<td>" + ele.createTrueName + "</td>"
	htmlstr += "<td>" + ele.topDept + "</td>"
	htmlstr += "<td>" + ele.twoDept + "</td>"
	htmlstr += "<td>" + (ele.threeDept == null ? " " : ele.threeDept) + "</td>"
	htmlstr += "<td>" + ele.email + "</td>"
	htmlstr += "<td>" + ele.joinDate + "</td>" 
	// 财务人天数
	htmlstr += "<td>" + ele.dailyAllWorkLoadCaiWu + "</td>"
	// 法定填报天数，2天内及时填写天数 
	htmlstr += "<td>" + ele.statutoryDailyDaysNumDays + " (" +ele.statutoryDailyDaysNumDaysBy7Day + ")</td>"
	// 缺失天数
	var className = ele.deletionDaysNum > 0 ? "class='validateTips text-bold'" : "";
	htmlstr += "<td " + className + ">" + ele.deletionDaysNum + "</td>"
	// 法定填报率2天内及时填报率
	var className = ele.statutoryWriteRate < 100 ? "class='validateTips text-bold'" : "";
	htmlstr += "<td " + className + ">" + ele.statutoryWriteRate + "%</td>" 
	// 工时填写率
	htmlstr += "<td>" + ele.writeRate + "%</td>"
	// 法定工时饱和度
	htmlstr += "<td>" + ele.workLoadSaturRatio + "%</td>"
	htmlstr += "<td style='display: none'>" + ele.vacationInfo + "</td>"
	htmlstr += "<td><input type='button' value='Detail' data-u='" + ele.createTrueName + "' /></td>"
	htmlstr += "</tr>"
	return htmlstr;
}