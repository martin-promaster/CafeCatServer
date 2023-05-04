/*!
 * OSMP v0.2.0-rc (http://osmp.com.cn)
 * Copyright 2022-2023 Martin Dong <http://osmp.com.cn>
 * Licensed under MIT (https://github.com/ColorlibHQ/AdminLTE/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.osmp = {}, global.jQuery));
})(this, (function (exports, $) { 'use strict';

  //import $, { timers } from 'jquery'

  /**
   * Constants
   * ====================================================
   */
  var NAME$2 = 'OsmpLib';
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];

  /**
   * Class Definition
   * ====================================================
   */
  var OsmpLib = /*#__PURE__*/function () {
    /**
     * Properties
     * ====================================================
     */

    /**
     * Constructor
     * ====================================================
     */
    function OsmpLib(option) {
      this.baseData = {
        dataDictionary: [],
        projectBaseInformation: [],
        allUsers: [],
        allDepts: [],
        allCusts: [],
        onlineUser: {}
      };
      this._init(option);
    }

    /**
     * Public
     * ====================================================
     */
    var _proto = OsmpLib.prototype;
    _proto.getBaseData = function getBaseData() {
      return this.baseData;
    };
    _proto.utmpXAcessToken = function utmpXAcessToken() {
      var xAccessToken;
      this._get("/api/v1/pub/utmp/token", {}, function (data) {
        xAccessToken = data.data;
      });
      return xAccessToken;
    }

    /**
     * Render Sidebar user (optional)
     */;
    _proto.renderSidebar = function renderSidebar() {
      $("<div></div>", {
        class: "image"
      }).append($("<img />", {
        src: "../dist/img/default_id.png",
        class: "img-circle elevation-2",
        alt: "User Image"
      })).appendTo($('.user-panel'));
      $("<div></div>", {
        class: "info"
      }).append($("<a></a>", {
        class: "d-block",
        href: "#"
      }).append("Hi, " + this.baseData.onlineUser.userName)).appendTo($('.user-panel'));

      // Rendering the main footer.
      var url = "http://osmp.com.cn";
      var reg = "OSMP.COM.CN";
      var $copyright = $('<span><strong>Copyright &copy; 2021-2024 <a href="' + url + '">' + reg + '</a></strong>&nbsp;&nbsp;All rights reserved.</span>');
      var $version = $("<div />", {
        class: 'float-right d-none d-sm-inline-block'
      }).html("<b>Version</b>3.1.0");
      $(".main-footer").children().remove();
      $(".main-footer").append($copyright).append($version);
    }

    /**
     * Private
     * ====================================================
     */;
    _proto._init = function _init(option) {
      var vList;
      if (option.department) {
        this._get('/api/v1/sm/department/list', {}, function (data) {
          vList = data.data;
        });
        this.baseData.allDepts = vList;
      }
      if (option.user) {
        this._get("/api/v1/sm/user/mapping/all", {}, function (data) {
          vList = data.data;
        });
        this.baseData.allUsers = vList;
      }
      if (option.customer) {
        this._get("/api/v1/customer/list", {}, function (data) {
          vList = data.data;
        });
        this.baseData.allCusts = vList;
      }
      if (option.dd) {
        this._get("/api/v1/sm/dd/-1", {}, function (data) {
          vList = data.data;
        });
        this.baseData.dataDictionary = vList;
      }
      if (option.projectBaseInformation) {
        this._get("/api/v1/pm/projectBaseInformation/qry/-1", {}, function (data) {
          vList = data.data;
        });
        this.baseData.projectBaseInformation = vList;
      }
      this.baseData.onlineUser = this._getOnlineUser();
      osmpTempKVPairs().set("historyUrl", top.location.href);
    };
    _proto._get = function _get(url, param, suc, err) {
      $.ajax({
        async: false,
        url: url,
        type: 'GET',
        beforeSend: function beforeSend(jqXHR) {
          jqXHR.setRequestHeader("If-Modified-Since", "0");
          jqXHR.setRequestHeader("Cache-Control", "no-cache");
        },
        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        data: param,
        success: function success(data, textStatus, jqXHR) {
          typeof suc === 'function' && suc(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          typeof err === 'function' && err();
        }
      });
    };
    OsmpLib.post = function post(url, param, suc, err) {
      $.ajax({
        async: false,
        url: url,
        type: 'POST',
        beforeSend: function beforeSend(jqXHR) {
          jqXHR.setRequestHeader("If-Modified-Since", "0");
          jqXHR.setRequestHeader("Cache-Control", "no-cache");
        },
        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        data: param,
        success: function success(data, textStatus, jqXHR) {
          typeof suc === 'function' && suc(data);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          typeof err === 'function' && err();
        }
      });
    };
    _proto._getOnlineUser = function _getOnlineUser() {
      var onlineUser;
      this._get("/api/v1/pub/user/online", {}, function (data) {
        if (data.errorCode != undefined) {
          top.location.href = '/pages/index.html';
        }
        onlineUser = data.data;
      }, function (jqXHR, textStatus, errorThrown) {
        top.location.href = '/pages/index.html';
      });
      return onlineUser;
    };
    _proto._randomRGBStr = function _randomRGBStr() {
      var rgba = Math.floor(255 * Math.random() % 255);
      var rgbb = Math.floor(255 * Math.random() % 255);
      var rgbc = Math.floor(255 * Math.random() % 255);
      return "rgb(" + rgba + "," + rgbb + "," + rgbc + ")";
    };
    _proto._randomRGBAStr = function _randomRGBAStr(radix) {
      var color = this._randomRGBStr();
      return "rgba" + color.substring(3, color.length - 1) + "," + radix + ")";
    }

    /**
     * Static
     * ====================================================
     */;
    OsmpLib._jQueryInterface = function _jQueryInterface() {
      var ignoredWebPages = ["myWorkspace.html", "dashboard.html", "calendar.html"];
      var a = top.location.pathname.split("/");
      var curWebPageFileName = a[a.length - 1];
      var option = {
        department: true,
        user: true,
        customer: true,
        dd: true,
        projectBaseInformation: true
      };
      if (curWebPageFileName.length < 1 || curWebPageFileName == "/" || curWebPageFileName == "index.html") {
        //  
        return null;
      } else if (ignoredWebPages.indexOf(curWebPageFileName) >= 0) {
        option.department = false;
        option.user = true;
        option.customer = false;
        option.dd = false;
        option.projectBaseInformation = false;
        return new OsmpLib(option);
      } else {
        return new OsmpLib(option);
      }
    };
    return OsmpLib;
  }();
  /* Global */
  /* Init common methods */
  $(window).on('load', function () {
    window.osmpLib = OsmpLib._jQueryInterface.call();
    if (osmpLib) {
      osmpLib.renderSidebar();
    }
  });

  /**
   * jQuery API
   * ====================================================
   */
  $.fn[NAME$2] = OsmpLib._jQueryInterface;
  $.fn[NAME$2].Constructor = OsmpLib;
  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return OsmpLib._jQueryInterface;
  };

  //import $, { timers } from 'jquery'

  /**
   * Constants
   * ====================================================
   */
  var NAME$1 = 'OsmpSidebar';
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];

  /**
   * Class Definition
   * ====================================================
   */
  var OsmpSidebar = /*#__PURE__*/function () {
    function OsmpSidebar(options) {
      this.sidebaMenuItems = [{
        pageName: "My Workspace",
        pageUrl: "myWorkspace.html",
        subMenuItems: []
      }, {
        pageName: "Dashboard",
        pageUrl: "dashboard.html",
        subMenuItems: []
      }, {
        pageName: "Calendar",
        pageUrl: "calendar.html",
        subMenuItems: []
      }, {
        pageName: "客户管理",
        pageUrl: "#",
        subMenuItems: [{
          href: "custRelationshipMgr.html",
          name: "客户关系管理"
        }]
      }, {
        pageName: "项目管理",
        pageUrl: "#",
        subMenuItems: [{
          href: "pmmProjectMgr.html",
          name: "项目基本信息"
        }, {
          href: "pmmTaskBoard.html",
          name: "项目任务看板"
        }, {
          href: "pmmProjectTimesheet.html",
          name: "项目工时管理"
        }]
      }, {
        pageName: "人员管理",
        pageUrl: "#",
        subMenuItems: [{
          href: "osmOnsiteStaffMgr.html",
          name: "驻场人员基本信息"
        }]
      }, {
        pageName: "招聘管理",
        pageUrl: "#",
        subMenuItems: [{
          href: "rcmDailyReport.html",
          name: "招聘进展日报"
        }, {
          href: "rcmProjectReport.html",
          name: "招聘项目报告"
        }, {
          href: "rcmCandidateMgr.html",
          name: "人才信息库"
        }]
      }, {
        pageName: "工具和设置",
        pageUrl: "#",
        subMenuItems: [{
          href: "cfgStaffDailyReport.html",
          name: "日报提取工具"
        }]
      }, {
        pageName: "系统管理",
        pageUrl: "#",
        subMenuItems: [{
          href: "sysUser.html",
          name: "用户管理"
        }, {
          href: "sysDepartment.html",
          name: "部门管理"
        }, {
          href: "sysRole.html",
          name: "权限管理"
        }, {
          href: "sysBaseData.html",
          name: "基础数据"
        }, {
          href: "sysParameter.html",
          name: "系统参数"
        }, {
          href: "cfgUserSecurity.html",
          name: "个人设置"
        }]
      }];
      this._initSidebar();
    }

    // Public
    /**
     *  <li>                           | parent    addClass("menu-open")
     *     <a href='#'>                |           addClass('active')
     *     <ul>                        | parent    css("display", "block")
     *       <li>                      | parent
     *         <a href=activedMenuUrl> |           menuUrl
     * 
     * @param {String} activedUrl Current web page file name
     * @return {void}
     */
    var _proto = OsmpSidebar.prototype;
    _proto.activeItem = function activeItem(activedUrl) {
      var menuPrefix = ["pmm", "osm", "rem", "rcm", "sys", "cfg", "cus"];
      if (menuPrefix.indexOf(activedUrl.substring(0, 3)) > -1) {
        var menuItem = $('[href="' + activedUrl + '"]');
        menuItem.addClass("active");
        var subUL = menuItem.parent().parent();
        subUL.css("display", "block");
        subUL.parent().addClass("menu-open");
        subUL.parent().children("a").addClass('active');
      } else {
        $("[href='" + activedUrl + "']").addClass("active");
      }
      if (localStorage.getItem("osmp.lte.pushmenu.collapse") == "true") {
        $('body').removeClass('sidebar-open');
        $('body').addClass('sidebar-collapse');
      } else {
        $('body').removeClass('sidebar-collapse');
        $('body').addClass('sidebar-open');
      }

      // Modify UI
      //$('.nav-sidebar').addClass('text-sm')
      //$('.nav-sidebar').addClass('nav-compact')
      $('body').addClass('layout-fixed text-sm');
      // $('body').addClass('layout-footer-fixed')
      // $(window).trigger('resize')
    }

    // Private
    ;
    _proto._initSidebar = function _initSidebar() {
      var _this = this;
      // Brand Logo & Text
      $('.brand-text').html('OSMP');

      // Sidebar Menu
      var $sidebarMenu = $("<ul />", {
        // sidebar 主样式
        class: "nav nav-pills nav-sidebar flex-column nav-compact",
        role: "menu",
        "data-widget": "treeview",
        "data-accordion": "false"
      });
      $('.mt-2').append($sidebarMenu);
      this.sidebaMenuItems.forEach(function (e) {
        _this._addMutipleSidebarMenuItem($sidebarMenu, e.pageName, e.pageUrl, e.subMenuItems);
      });
    };
    _proto._addMutipleSidebarMenuItem = function _addMutipleSidebarMenuItem(domElement, parentItemName, parentUrl, subMenus) {
      if (parentUrl != "#") {
        var clsActive = "";
        // isActived==true?clsActive="active":clsActive="";
        var $singleItem = $("<li />", {
          class: "nav-item"
        });
        var $suba = $("<a />", {
          class: "nav-link " + clsActive,
          href: parentUrl
        });
        $suba.append("<i class=\"nav-icon fas fa-circle text-info\"></i>");
        $suba.append("<p>" + parentItemName + "</p>");
        $singleItem.append($suba);
        // Append to sidebar
        domElement.append($singleItem);
      } else {
        var $multiItem = $("<li />", {
          class: "nav-item"
        });
        var $suba = $("<a />", {
          href: "#",
          class: "nav-link"
        });
        $suba.append("<i class=\"nav-icon fas fa-plus-square\"></i>");
        $suba.append("<p>" + parentItemName + "<i class=\"right fas fa-angle-left\"></i></p>");
        $multiItem.append($suba);

        // Append sub menu items
        var $subul = $("<ul />", {
          class: "nav nav-treeview"
        });
        subMenus.forEach(function (e) {
          var $subli = $("<li />", {
            class: "nav-item"
          });
          var $suba = $("<a />", {
            href: e.href,
            class: "nav-link"
          });
          $suba.append("<i class=\"far fa-circle nav-icon\"></i>");
          $suba.append("<p>" + e.name + "</p>");
          $subli.append($suba);
          $subul.append($subli);
        });
        $multiItem.append($subul);
        // Append to sidebar
        domElement.append($multiItem);
      }
    }

    // Static
    ;
    OsmpSidebar._jQueryInterface = function _jQueryInterface(options) {
      var osmpSidebar = new OsmpSidebar();
      // Add active class to the opened menu item.
      var a = top.location.pathname.split("/");
      osmpSidebar.activeItem(a[a.length - 1]);
    };
    return OsmpSidebar;
  }();
  /**
   * Init common methods.
   */
  OsmpSidebar._jQueryInterface.call();

  /**
   * jQuery API
   * ====================================================
   */
  $.fn[NAME$1] = OsmpSidebar._jQueryInterface;
  $.fn[NAME$1].Constructor = OsmpSidebar;
  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return OsmpSidebar._jQueryInterface;
  };

  //import $, { timers } from 'jquery'

  /**

   */

  /**
   * Constants
   * ====================================================
   */
  var NAME = 'OsmpDataTable';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var DEFAULT_OPTION = {
    "aLengthMenu": [5, 10, 30],
    //更改显示记录数选项
    "bFilter": true,
    "destroy": true,
    "processing": true,
    "responsive": true,
    "lengthChange": true,
    "autoWidth": false,
    "serverSide": true,
    "ajax": {
      "async": false,
      "url": null,
      "contentType": "application/json",
      "data": null
    },
    "columns": null,
    "createdRow": null,
    "callbackReg": null,
    "scrollX": true,
    // OSMP defined properties.
    hasFooter: false
  };

  /**
   * Class Definition
   * ====================================================
   * Usage: 
   *   1. Meed a html tag injection listed below in a HTML file.
   *      <div id="pms-data-table"></div>
   * 
   *  2. Create a new instance of OsmpDataTable including javascript listed below in script tag.
   *        Parameter 1: inner table id.
   *        Parameter 2: url of ajax request to fetch data in JSON object.
   *        Parameter 3: Payload of request.
   *        Parameter 4: displayed columns be created of data table in HTML page in html file
   *
   * @example
   *    <div id="pms-data-table"></div>
   *    <script type="text/javascript">
   *      $(function () {
   *        new OsmpDataTable("#pms-data-table", "/api/v1/sm/dd/list", 
   *          {}, 
   *          [
   *            {"data": "id", "colName": "id" },
   *            {"data": "code", "colName": "code" },
   *            {"data": "type", "colName": "type" },
   *            {"data": "value", "colName": "value" },
   *            {"data": "remark", "colName": "remark" },
   *          ],
   *          {
   *            bFilter: true,
   *            bExported: true, 
   *            createdRow: function(row, data, index) {
   *              console.log("Log")
   *            }
   *            fnOperationButtonHandler: function(data) {
   *                let $dialog = $("#project-detail-information-dialog");
   *                $($dialog.find('.modal-title')).html(data.name);
   *                $dialog.modal({ show: true, backdrop: 'static' });
   *             }
   *          }
   *        );
   *      }
   *    </script>
   */
  var OsmpDataTable = /*#__PURE__*/function () {
    /**
     * Properties
     * ====================================================
     */

    /**
     * Constructor
     * ====================================================
     */
    function OsmpDataTable(selector, ajaxUrl, ajaxData, dtCols, param) {
      this._me = null;
      if (selector == null) {
        throw new Error("OsmpDataTable: Html tag should be binding to. e.g. <div id=\"pms-data-table\"></div>.");
      }
      if (dtCols == null) {
        throw new Error("OsmpDataTable: Columns should be defined.");
      }
      if (ajaxUrl == null || ajaxData == null) {
        throw new Error("OsmpDataTable: Ajax url and data cannot be null.");
      }
      this._wrapper = selector;
      this._inner = selector + '_' + new Date().valueOf();
      if (param.bExported) {
        param.dom = 'B<lf<t>ip>';
        param.buttons = ["csv", "excel"]; // ["copy", "csv", "excel", "pdf", "print", "colvis"],
      }

      // Set datatable.columns
      dtCols.push({
        data: null,
        colName: "Operation"
      });

      // Merge data table configuration.
      this._option = $.extend({}, DEFAULT_OPTION, param, {
        ajax: {
          url: ajaxUrl,
          data: ajaxData,
          contentType: "application/json",
          async: false
        },
        columns: dtCols
      });

      // Drawing wapper ...
      $(this._wrapper).children().remove();
      var tableObj = $("<table></table>", {
        id: this._inner.substring(1),
        class: "table table-bordered table-striped"
      });
      var tableTH = $("<tr></tr>");
      var tableTF = $("<tr></tr>");
      dtCols.forEach(function (element) {
        var displayName = element.colName == undefined ? element.data : element.colName == null ? "Not defined" : element.colName;
        $("<th>" + displayName + "</th>").appendTo(tableTH);
        $("<th>" + displayName + "</th>").appendTo(tableTF);
      });
      $("<thead></thead>").append(tableTH).appendTo(tableObj);
      $("<tbody></tbody>").appendTo(tableObj);
      if (this._option.hasFooter) {
        $("<tfoot></tfoot>").append(tableTF).appendTo(tableObj);
      }
      // Binding to wapper
      $(this._wrapper).append(tableObj);

      // Addd handlers
      var fnx = {};
      fnx.fnDefaultRenderRow = this.fnDefaultRenderRow;
      fnx.fnAppendOperationButton = this.fnAppendOperationButton;
      fnx.createdRow = param.createdRow;
      fnx.fnOperationButtonHandler = param.fnOperationButtonHandler;
      this.fnCallbackChain(fnx);
      $(this._inner).DataTable(this._option);
      //.buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    }

    /**
     * Public
     * ====================================================
     */
    var _proto = OsmpDataTable.prototype;
    _proto.fnAppendOperationButton = function fnAppendOperationButton(row, data, index, handler) {
      // Button of operation
      var btnUpdate = $("<button />", {
        "type": "button",
        "class": "btn btn-sm btn-info",
        "data-toggle": "modal",
        "data-target": "#modal-default",
        "data-v": JSON.stringify(data)
      }).append('<i class="fa fa-edit">');
      btnUpdate.on("click", function () {
        handler($(this).data("v"));
      });
      var buttonGroup = $("<div />", {
        "class": "btn-group"
      });
      buttonGroup.append(btnUpdate);
      $('td', row).eq(-1).html("").append(buttonGroup);
    };
    _proto.fnDefaultRenderRow = function fnDefaultRenderRow(row, data, index) {
      // 此正则对于 '2017-001-0002' 和 '2017-1-2' 也是能匹配的
      // "^\\d{4}-0*((1|3|5|7|8|10|12)-0*([1-9]|[1-2]\\d|3[0-1])|(4|6|9|11)-0*([1-9]|[1-2]\\d|30)|2-0*([1-9]|[1-2]\\d))$";
    }

    /**
     * Private
     * ====================================================
     */;
    _proto.fnCallbackChain = function fnCallbackChain(o) {
      if (typeof o.createdRow == "function") {
        this._option.createdRow = function (row, data, index) {
          o.createdRow.call(this, row, data, index);
          o.fnDefaultRenderRow.call(this, row, data, index);
          o.fnAppendOperationButton.call(this, row, data, index, o.fnOperationButtonHandler);
        };
      } else {
        this._option.createdRow = function (row, data, index) {
          o.fnDefaultRenderRow.call(this, row, data, index);
          o.fnAppendOperationButton.call(this, row, data, index, o.fnOperationButtonHandler);
        };
      }
      $(this._inner).dataTable().fnAdjustColumnSizing();
    };
    _proto.fnGetRowData = function fnGetRowData(cIndex) {
      this._me = $(this._inner).dataTable();
      var nodes = this._me.fnGetNodes();
      return this._me.fnGetData(nodes[cIndex]);
    };
    _proto.fnIsNumber = function fnIsNumber(param) {
      return Number.isNaN(Number.parseFloat(param));
    }

    /**
     * Static
     * ====================================================
     */;
    OsmpDataTable._jQueryInterface = function _jQueryInterface() {
      return new OsmpDataTable();
    };
    return OsmpDataTable;
  }();
  /* Global */
  /* Init common methods */
  // $(window).on('load', () => {
  //     var pmsObject = OsmpDataTable._jQueryInterface.call();
  // })
  window.OsmpDataTable = OsmpDataTable;

  /**
   * jQuery API
   * ====================================================
   */

  $.fn[NAME] = OsmpDataTable._jQueryInterface;
  $.fn[NAME].Constructor = OsmpDataTable;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return OsmpDataTable._jQueryInterface;
  };

  exports.OsmpDataTable = OsmpDataTable;
  exports.OsmpLib = OsmpLib;
  exports.OsmpSidebar = OsmpSidebar;

}));
//# sourceMappingURL=pms.js.map
