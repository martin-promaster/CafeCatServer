package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.ActionBase;
import cn.ybits.server.IService;
import cn.ybits.server.vo.LeaveApplication;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;

public class ApplyDinnerList extends ActionBase implements IService {

    public void doAction(HttpRequest request, HttpResponse response) {

        JSONObject jsonData = new JSONObject();

        JSONArray jsonArray = new JSONArray();

        JSONObject jsonObject = new JSONObject();
        for (int i = 0; i < 20; i++) {
            LeaveApplication leaveApplication = new LeaveApplication();
            leaveApplication.setId("898w74982387489823"+i);
            leaveApplication.setName("同学a");
            leaveApplication.setLeaveType("晚自习请假");
            leaveApplication.setLeaveDate(new Date("2023/05/01"));
            leaveApplication.setStatus("已确认");
            jsonArray.add(JSONObject.toJSON(leaveApplication));
        }

        jsonData.put("data", jsonArray);

        response.setPayload(jsonData.toJSONString().getBytes());

        response.setContentType("text/json");
        response.setSuccessMessage();
    }
}
