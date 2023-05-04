package cn.ybits.server.dispatcher;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.IService;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class DefaultDispatcher {

    public DefaultDispatcher() {

    }

    public void dispatch(HttpRequest request, HttpResponse response) throws UnsupportedEncodingException {

        Map<String, String> actionMap = new HashMap<String, String>();

        actionMap.put("/",                      "cn.ybits.server.actions.WelcomePageAction");
        actionMap.put("/apply/dinner/list",     "cn.ybits.server.actions.ApplyDinnerList");
        actionMap.put("/apply/student/list",    "cn.ybits.server.actions.StudentList");

        System.out.println(request.getPath());

        String clazzName = actionMap.get(request.getPath());

        if (clazzName == null || clazzName.equals("")) {
            clazzName = "cn.ybits.server.actions.DefaultAction";
        }

        // Loading class
        try {

            Class<?> clazz = Class.forName(clazzName);

            IService defaultService = (IService)clazz.newInstance();

            defaultService.doAction(request, response);

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }

    }
}
