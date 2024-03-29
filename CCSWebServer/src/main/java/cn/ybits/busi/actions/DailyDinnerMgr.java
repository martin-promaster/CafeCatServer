package cn.ybits.busi.actions;

import cn.ybits.common.dbcp.SqlResultSet;
import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.annotation.RequestPath;
import cn.ybits.server.annotation.ResponseBody;
import cn.ybits.server.utils.ContextUtils;
import cn.ybits.server.actions.AbsRouteAction;
import cn.ybits.server.intf.IService;
import cn.ybits.busi.vo.LeaveApplication;
import com.alibaba.fastjson.JSONObject;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


public class DailyDinnerMgr extends AbsRouteAction implements IService {

    @Override
    @RequestPath(path = "/apply/dinner/list")
    public void doAction(HttpRequest request, HttpResponse response) {
        List<LeaveApplication> leaveApplicationList = new ArrayList<>();

        try {

            SqlResultSet rs = ContextUtils.getInstance().getSqlStore().get("pms_db").doQuery("select * from inf_leave_application;");

            while (rs.next()) {
                LeaveApplication leaveApplication = new LeaveApplication();
                leaveApplication.setId(rs.getString("s_code"));
                leaveApplication.setName(rs.getString("s_name"));
                leaveApplication.setLeaveType(rs.getString("leave_type"));
                Timestamp localDateTime = rs.getTimestamp("leave_date");
                leaveApplication.setLeaveDate(localDateTime);
                leaveApplication.setStatus(rs.getString("status"));
                leaveApplicationList.add(leaveApplication);
            }

        } catch (NullPointerException e) {
            e.printStackTrace();
        }

        JSONObject jsonData = new JSONObject();

        jsonData.put("data", leaveApplicationList);

        response.setPayload(jsonData.toJSONString().getBytes(StandardCharsets.UTF_8));

        response.setContentType("text/json; charset=UTF-8");
    }

    @ResponseBody("test")
    public void testResponseBody() {

    }
}
