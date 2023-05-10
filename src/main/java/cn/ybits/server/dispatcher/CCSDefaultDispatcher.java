package cn.ybits.server.dispatcher;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;
import cn.ybits.server.ReflectionUtils;
import jdk.nashorn.internal.ir.RuntimeNode;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class CCSDefaultDispatcher {

    public CCSDefaultDispatcher() {

    }

    public void dispatch(HttpRequest request, HttpResponse response) throws UnsupportedEncodingException {

        Map<String, String> actionMap = new HashMap<String, String>();

        actionMap.put("/",                      "cn.ybits.server.actions.WelcomePageAction");
        actionMap.put("/apply/dinner/list",     "cn.ybits.busi.actions.DailyDinnerMgr");
        actionMap.put("/apply/student/list",    "cn.ybits.busi.actions.StudentQueryMgr");

        System.out.println(request.getPath());

        String clazzName = actionMap.get(request.getPath());

        if (clazzName == null || clazzName.equals("")) {
            clazzName = "cn.ybits.server.actions.NoMatchedRouteAction";
        }

        // Loading class
        try {
            Class<?> clazz = Class.forName(clazzName);
            // IService defaultService = (IService)clazz.newInstance();
            CCSDefaultAction defaultAction = (CCSDefaultAction)clazz.newInstance();
            // defaultAction.doAction(request, response);
            Method method = ReflectionUtils.getDeclaredMethod(defaultAction, "doAction", HttpRequest.class, HttpResponse.class);
            assert method != null;
            method.invoke(defaultAction, request, response);

            method = ReflectionUtils.getDeclaredMethod(defaultAction, "doPostProcess", HttpRequest.class, HttpResponse.class);
            assert method != null;
            method.invoke(defaultAction, request, response);

        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException |
                 InvocationTargetException e) {
            e.printStackTrace();
        }
    }
}
