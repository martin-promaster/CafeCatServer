package cn.ybits.busi.actions;

import cn.ybits.common.dbcp.SqlResultSet;
import cn.ybits.common.dbcp.SqlStore;
import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;
import cn.ybits.busi.vo.LeaveApplication;
import cn.ybits.server.annotation.ResponseBody;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public class DailyDinnerMgr extends CCSDefaultAction implements IService {

    @Override
    public void doAction(HttpRequest request, HttpResponse response) {
        List<LeaveApplication> leaveApplicationList = new ArrayList<>();

        try {
            SqlStore sqlStore = new SqlStore();
            sqlStore.createSqlHelper("mysql", "pms_db", "database.xml");
            SqlResultSet rs = sqlStore.get("pms_db").doQuery("select * from inf_leave_application;");

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

    @ResponseBody(path = "/apply/dinner/list", className = "111")
    public void testResponseBody() {

    }
}
