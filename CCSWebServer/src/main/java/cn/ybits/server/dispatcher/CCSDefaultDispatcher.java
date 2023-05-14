package cn.ybits.server.dispatcher;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.ReflectionUtils;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class CCSDefaultDispatcher {
    private HttpResponse response;
    private HttpRequest request;

    public CCSDefaultDispatcher() {

    }

    public CCSDefaultDispatcher(InputStream is) {
        request = new HttpRequest();
        try {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is));
            while(true) {

                String lineMessage = null;

                lineMessage = bufferedReader.readLine();

                if (lineMessage.contains("HTTP/1.0") || lineMessage.contains("HTTP/1.1")) {

                    String[] arr = lineMessage.split(" ");

                    request.setMethod(arr[0]);
                    request.setPath(arr[1]);
                    request.setHttpVersion(arr[2]);

                    request.setContentLength(0);
                }

                if (lineMessage.contains("Content-Length")) {
                    request.setContentLength(Integer.parseInt(lineMessage.split(":")[1].trim()));
                }

                if(lineMessage.equals("")) {
                    // Support both POST and GET.
                    if ( (request.getMethod().equals("POST") ||  request.getMethod().equals("GET") ) && request.getContentLength() > 0) {
                        char[] buf = new char[request.getContentLength()];
                        bufferedReader.read(buf, 0, request.getContentLength());

                        String s = new String(buf);
                        request.setRequestBody(s.getBytes(StandardCharsets.UTF_8));
                    } else {
                        request.setRequestBody(null);
                    }

                    break;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public HttpRequest getRequest() {
        return this.request;
    }

    public HttpResponse getResponse() {
        return this.response;
    }

    public void dispatch() throws UnsupportedEncodingException {
        Class<?> clazzCCSRequestMapping = null;
        Map<String, String> actionMap;
        try {
            clazzCCSRequestMapping = Class.forName("cn.ybits.server.dispatcher.CCSRequestMapping");
            cn.ybits.server.dispatcher.CCSRequestMapping ccsRequestMapping = (cn.ybits.server.dispatcher.CCSRequestMapping) clazzCCSRequestMapping.newInstance();
            actionMap = new HashMap<String, String>(cn.ybits.server.dispatcher.CCSRequestMapping.map);
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }


        response = new HttpResponse();


        actionMap.put("/",                      "cn.ybits.server.actions.WelcomePageAction");
//        actionMap.put("/apply/dinner/list",     "cn.ybits.busi.actions.DailyDinnerMgr");
//        actionMap.put("/apply/student/list",    "cn.ybits.busi.actions.StudentQueryMgr");

        String clazzName = actionMap.get(request.getPath());

        if (clazzName == null || clazzName.equals("")) {
            clazzName = "cn.ybits.server.actions.NoMatchedRouteAction";
        }

        // Loading class
        try {
            Class<?> clazz = Class.forName(clazzName);
            CCSDefaultAction defaultAction = (CCSDefaultAction)clazz.newInstance();

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
