package cn.ybits.busi.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;
import cn.ybits.server.annotation.ResponseBody;
import cn.ybits.server.vo.Student;
import com.alibaba.fastjson.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class StudentQueryMgr extends CCSDefaultAction implements IService {
    @Override
    public void doAction(HttpRequest request, HttpResponse response) {
        String[] searchValues = request.getParameters().split("&");
        String term = "";
        for (String searchValue : searchValues) {
            if (searchValue.startsWith("term")) {
                term = searchValue.split("=")[1];
            }
        }

        JSONObject jResult = new JSONObject();

        List<Student> studentList = new ArrayList<Student>();
        for (int i = 0; i < 20; i++) {
            Student student = new Student();
            student.setId("898w74982387489823"+i);
            student.setText("新同学"+i);
            studentList.add(student);
        }

        if (term.isEmpty()) {
            jResult.put("results", studentList);
        } else {
            List<Student> students2 = new ArrayList<Student>();
            for (Student s : studentList) {
                if (s.getText().contains(term)) {
                    students2.add(s);
                }
            }
            jResult.put("results", students2);
        }

        jResult.put("pagination", JSONObject.parseObject("{\"more\": false}"));

        try {
            response.setPayload(jResult.toJSONString().getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        response.setContentType("text/json; charset=UTF-8");
    }

    @ResponseBody()
    public void test(String s) {

    }
}