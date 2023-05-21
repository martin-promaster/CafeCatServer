package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public abstract class AbsRouteAction {

    private final static Logger log = LogManager.getLogger(AbsRouteAction.class);

    public String formatJSON(String s) {
        return s.replace("\\", "\\\\").replace("\r", "\\r")
                .replace("\n","\\n");
    }

    public void doPostProcess(HttpRequest request, HttpResponse response) {

        response.setContentType("text/html");

        if (request.getPath().endsWith(".js")) {
            response.setContentType("application/json");
        } else if (request.getPath().endsWith(".css")) {
            response.setContentType("text/css");
        } else if (request.getPath().endsWith(".woff")) {
            response.setContentType("application/x-font-woff");
        } else if (request.getPath().endsWith(".woff2")) {
            response.setContentType("application/x-font-woff2");
        } else if (request.getPath().endsWith(".ttf")) {
            response.setContentType("application/x-font-truetype");
        }

        response.setSuccessMessage();
    }
}
