package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.CCSDefaultAction;
import cn.ybits.server.IService;

import java.io.*;

public class NoMatchedRouteAction extends CCSDefaultAction implements IService {


    public void doAction(HttpRequest request, HttpResponse response) {

        String WEB_APP_PATH = WEB_ROOT + WEB_APP;

        FileInputStream in;
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        byte[] buf = new byte[1024];
        try {
            in = new FileInputStream(WEB_APP_PATH+request.getPath());

            int rt = -1;
            while((rt = in.read(buf)) > 0) {
                out.write(buf, 0, rt);
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
