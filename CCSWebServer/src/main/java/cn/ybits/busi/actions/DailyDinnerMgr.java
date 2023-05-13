package cn.ybits.busi.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;
import cn.ybits.server.vo.LeaveApplication;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;


public class DailyDinnerMgr extends CCSDefaultAction implements IService {

    @Override
    public void doAction(HttpRequest request, HttpResponse response) {

        JSONObject jsonData = new JSONObject();

        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < 20; i++) {
            LeaveApplication leaveApplication = new LeaveApplication();
            leaveApplication.setId("898w74982387489823"+i);
            leaveApplication.setName("同学");
            leaveApplication.setLeaveType("晚自习请假");
            leaveApplication.setLeaveDate(new Date());
            leaveApplication.setStatus("已审批");
            jsonArray.add(JSONObject.toJSON(leaveApplication));
        }

        jsonData.put("data", jsonArray);

        response.setPayload(jsonData.toJSONString().getBytes(StandardCharsets.UTF_8));

        response.setContentType("text/json; charset=UTF-8");
    }
}
