package cn.ybits.busi.actions;

import cn.ybits.common.dbcp.SqlResultSet;
import cn.ybits.common.dbcp.SqlStore;
import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;
import cn.ybits.server.annotation.RequestPath;
import cn.ybits.busi.vo.Student;
import com.alibaba.fastjson.JSONObject;

import java.nio.charset.StandardCharsets;
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

        response.setPayload(jResult.toJSONString().getBytes(StandardCharsets.UTF_8));

        response.setContentType("text/json; charset=UTF-8");
    }

    @RequestPath(path = "/apply/student/list")
    public void test(String s) {

    }
}
