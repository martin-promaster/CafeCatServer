$(function () {
	'use strict'

	/* initialize the external events */
	function initEvents(ele) {
		ele.each(function () {
			// create an Event Object (https://fullcalendar.io/docs/event-object)
			// it doesn't need to have a start or end
			var eventObject = {
				title: $.trim($(this).text()) // use the element's text as the event title
			}
			// store the Event Object in the DOM element so we can get to it later
			$(this).data('eventObject', eventObject)
			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 1070,
				revert: true, // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			})

		})
	}

	initEvents($('#external-events div.external-event'))
	$("#whole-week-calendar").data("wholeWeekCalendar", false);

	/* initialize the calendar */
	var Calendar = FullCalendar.Calendar;
	var Draggable = FullCalendar.Draggable;

	var containerEl = document.getElementById('external-events');
	var checkbox = document.getElementById('drop-remove');
	// checkbox.setAttribute("checked", true);
	var calendarEl = document.getElementById('calendar');

	// initialize the external events
	new Draggable(containerEl, {
		itemSelector: '.external-event',
		eventData: function (eventEl) {
			return {
				title: eventEl.innerText,
				backgroundColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
				borderColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
				textColor: window.getComputedStyle(eventEl, null).getPropertyValue('color'),
			};
		}
	});
	var calendar = new Calendar(calendarEl, {
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay',
		},
		locale: "zh-cn",
		firstDay: 1,
		weekends: false, 
		slotMinTime: "08:00:00",
		slotDuration: "00:15:00",
		themeSystem: 'bootstrap',
		events: "/api/v1/pm/calendarLog/list",
		editable: true,
		droppable: true, // this allows things to be dropped onto the calendar !!!
		eventReceive: function (info) {
			// is the "remove after drop" checkbox checked?
			if (checkbox.checked) {
				// if so, remove the element from the "Draggable Events" list
				info.draggedEl.parentNode.removeChild(info.draggedEl);
			}
			var data = {
				id: info.event.id,
				title: info.event.title,
				start: info.event.start,
				end: info.event.end,
				allDay: info.event.allDay,
				backgroundColor: info.event.backgroundColor,
				borderColor: info.event.borderColor,
			}
			pmsPost("/api/v1/pm/calendarLog/save", data);
			info.event.remove();
			calendar.refetchEvents();
		},
		eventDrop: function (info) {
			var data = {
				id: info.event.id,
				title: info.event.title,
				start: info.event.start,
				end: info.event.end,
				allDay: info.event.allDay,
				backgroundColor: info.event.backgroundColor,
				borderColor: info.event.borderColor,
			}
			pmsPost("/api/v1/pm/calendarLog/save", data);
			calendar.refetchEvents();
		},
		eventResize: function (info) {
			var data = {
				id: info.event.id,
				title: info.event.title,
				start: info.event.start,
				end: info.event.end,
				allDay: info.event.allDay,
				backgroundColor: info.event.backgroundColor,
				borderColor: info.event.borderColor,
			}
			pmsPost("/api/v1/pm/calendarLog/save", data);
		},
		eventClick: function (info) {
			popupDialog(info, calendar);
		},
	});

	calendar.render();
	// $('#calendar').fullCalendar()
	
	// Auto scale
	autoScaleFullCalendar();
	$(".fc-toolbar-chunk").on("click", function (params) {
		autoScaleFullCalendar();
	})


	/* ADDING EVENTS */
	var currColor = '#3c8dbc' //Red by default
	// Color chooser button
	$('#color-chooser > li > a').click(function (e) {
		e.preventDefault()
		// Save color
		currColor = $(this).css('color')
		// Add color effect to button
		$('#new-event').val();
		$('#add-new-event').css({
			'background-color': currColor,
			'border-color': currColor
		})
	})
	$('#external-events > div').click(function (e) {
		e.preventDefault()
		// Save color
		currColor = $(this).css('background-color')
		// Add color effect to button
		$('#new-event').val($(this).html()+":");
		$('#add-new-event').css({
			'background-color': currColor,
			'border-color': currColor
		})
	})
	$('#add-new-event').click(function (e) {
		e.preventDefault()
		// Get value and make sure it is not null
		var val = $('#new-event').val()
		if (val.length == 0) {
			return
		}
		// Create events
		var event = $('<div />')
		event.css({
			'background-color': currColor,
			'border-color': currColor,
			'color': '#fff'
		}).addClass('external-event')
		event.text(val)
		$('#external-events').prepend(event)
		// Add draggable funtionality
		initEvents(event)
		// Remove event from text input
		$('#new-event').val('')
	})
	$("#whole-week-calendar").on("click", function (event) {
		var flag = $("#whole-week-calendar").data("wholeWeekCalendar");
		calendar.setOption("weekends", !flag);
		calendar.render();
		$("#whole-week-calendar").data("wholeWeekCalendar", !flag);
		
	})
})

function autoScaleFullCalendar() {
	$(".fc-col-header").removeAttr("style");
	$(".fc-daygrid-body.fc-daygrid-body-unbalanced").removeAttr("style");
	var style = $(".fc-scrollgrid-sync-table").attr("style").split(";");
	var defaultHeigth = "";
	for (let i = 0; i < style.length; i++) {
		const e = style[i].trim();
		if (e.indexOf("height") >= 0) {
			defaultHeigth = e;
		}
	}
	$(".fc-scrollgrid-sync-table").removeAttr("style");
	$(".fc-scrollgrid-sync-table").attr("style", defaultHeigth);
}

function popupDialog(info, params) {
	$("#modal-default").dialog({
		height: 300,
		width: 500,
		// 模态开启
		modal: true,
		// 是否可拖拽
		draggable: false,
		// 最小宽度
		minWidth: 500,
		buttons: {
			"Delete": function() {
				var data = {
					id: info.event.id,
					title: info.event.title,
					start: info.event.start,
					end: info.event.end,
					allDay: info.event.allDay,
					backgroundColor: info.event.backgroundColor,
					borderColor: info.event.borderColor,
				}
				pmsPost("/api/v1/pm/calendarLog/delete", data);
				$(this).dialog("close");
			},
			"Update": function() {
				var data = {
					id: info.event.id,
					title: $("#modal-dialog-event-title").val(),
					start: info.event.start,
					end: info.event.end,
					allDay: info.event.allDay,
					backgroundColor: info.event.backgroundColor,
					borderColor: info.event.borderColor,
				}
				pmsPost("/api/v1/pm/calendarLog/save", data);
				$(this).dialog("close");
			},
			"Cancel": function () {
				$(this).dialog("close");
			},
		},
		open: function() {
			$("#modal-unique-id").val(info.event.id);
			$("#modal-dialog-event-title").val(info.event.title)
			$("#modal-dialog-event-title").click(function(){
				$(this).focus();
			});
		},
		close: function(event, ui){
			params.refetchEvents();
		}
	});
}