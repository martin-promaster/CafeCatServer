package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.intf.IService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;

public class NoMatchedRouteAction extends AbsRouteAction implements IService {

    private final static Logger log = LogManager.getLogger(NoMatchedRouteAction.class);

    public void doAction(HttpRequest request, HttpResponse response) {
         
        String WEB_APP_PATH = WEB_ROOT + WEB_APP;
        log.debug("Web Application path is: "+WEB_APP_PATH);

        ByteArrayOutputStream out = new ByteArrayOutputStream();


        try {
            try (FileInputStream in = new FileInputStream(WEB_APP_PATH+request.getPath())) {
                byte[] buf = new byte[1024];
                int rt = -1;
                while((rt = in.read(buf)) > 0) {
                    out.write(buf, 0, rt);
                }
            }
            response.setPayload(out.toByteArray());
        } catch (FileNotFoundException e) {
            response.setNotFoundMessage();
            //e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
