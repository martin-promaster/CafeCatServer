package cn.ybits.server.dispatcher;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.ReflectionUtils;
import org.apache.logging.log4j.*;

import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class CCSDefaultDispatcher {
    Logger logger = LogManager.getLogger(CCSDefaultDispatcher.class);
    private HttpResponse response;
    private HttpRequest request;
    private Map<String,String> actionMap;

    public CCSDefaultDispatcher() {

    }

    public CCSDefaultDispatcher(InputStream is, Map<String, String> actionMap) {
        this.actionMap = actionMap;
        request = new HttpRequest();
        try {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is));
            while(true) {
                String lineMessage = bufferedReader.readLine();
                if (null == lineMessage) {
                    break;
                }

                if (lineMessage.contains("HTTP/1.0") || lineMessage.contains("HTTP/1.1")) {
                    String[] arr = lineMessage.split(" ");
                    request.setMethod(arr[0]);
                    String path = arr[1];
                    int idx = path.indexOf("?");
                    if ( idx<0 ) {
                        request.setPath(path);
                    } else {
                        request.setPath(path.substring(0, idx));
                        request.setParameters(path.substring(idx));
                    }
                    request.setHttpVersion(arr[2]);
                    request.setContentLength(0);
                }

                if (lineMessage.contains("Content-Length")) {
                    request.setContentLength(Integer.parseInt(lineMessage.split(":")[1].trim()));
                }

                if (lineMessage.equals("")) {
                    // Support both POST and GET.
                    if ( (request.getMethod().equals("POST") ||  request.getMethod().equals("GET") ) && request.getContentLength() > 0) {
                        char[] buf = new char[request.getContentLength()];
                        int receivedSize = bufferedReader.read(buf, 0, request.getContentLength());
                        logger.debug(">>> Received buffer size: {}", receivedSize);
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

        String clazzName = actionMap.get(request.getPath());
        if (clazzName == null || clazzName.equals("")) {
            clazzName = "cn.ybits.server.actions.NoMatchedRouteAction";
        }

        // Loading class
        try {
            Class<?> clazz = Class.forName(clazzName);
            CCSDefaultAction defaultAction = (CCSDefaultAction)clazz.newInstance();
            response = new HttpResponse();
            Method method;
            method = ReflectionUtils.getDeclaredMethod(defaultAction, "doAction", HttpRequest.class, HttpResponse.class);
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
