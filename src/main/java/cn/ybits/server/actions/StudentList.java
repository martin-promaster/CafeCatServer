package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.ActionBase;
import cn.ybits.server.IService;
import cn.ybits.server.vo.LeaveApplication;
import cn.ybits.server.vo.Student;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class StudentList extends ActionBase implements IService {

    public void doAction(HttpRequest request, HttpResponse response) {

        String[] searchValues = request.getParameters().split("&");
        String term = "";
        for (String searchValue : searchValues) {
            if (searchValue.startsWith("term")) {
                term = searchValue.split("=")[1];
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            JSONObject jResult = new JSONObject();

            List<Student> studentList = new ArrayList<Student>();
            for (int i = 0; i < 20; i++) {
                Student student = new Student();
                student.setId("898w74982387489823"+i);
                student.setText("同学"+i);
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

            out.write(jResult.toJSONString().getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        response.setContentType("text/json");
        response.setMessageBody(out.toByteArray());
        response.setSuccessMessage();
    }
}
