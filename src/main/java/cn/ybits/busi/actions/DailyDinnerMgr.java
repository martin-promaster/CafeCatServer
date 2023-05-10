package cn.ybits.busi.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;
import cn.ybits.server.vo.LeaveApplication;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.logging.log4j.core.time.Instant;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.SimpleFormatter;

public class DailyDinnerMgr extends CCSDefaultAction implements IService {
    @Override
    public void doAction(HttpRequest request, HttpResponse response) {
        JSONObject jsonData = new JSONObject();

        JSONArray jsonArray = new JSONArray();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        JSONObject jsonObject = new JSONObject();
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

        try {
            response.setPayload(jsonData.toJSONString().getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        response.setContentType("text/json; charset=UTF-8");
        response.setSuccessMessage();
    }
}
