package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.ActionBase;
import cn.ybits.server.CCSContext;
import cn.ybits.server.IService;

import java.io.*;

public class DefaultAction extends ActionBase implements IService {


    public void doAction(HttpRequest request, HttpResponse response) {

        String WWEB_ROOT = CCSContext.getInstance().getUserProfile() + "\\webroot\\";
        String WEB_APP = "AdminLTE-2.4.5";

        String WEB_APP_PATH = WWEB_ROOT + WEB_APP;

        FileInputStream in;
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        byte[] buf = new byte[1];
        try {
            in = new FileInputStream(WEB_APP_PATH+request.getPath());

            while(in.read(buf) > 0) {
                out.write(buf);
            }

            response.setContentType("text/html");

            if (request.getPath().endsWith(".js")) {
                response.setContentType("application/json");
            } else if (request.getPath().endsWith(".css")) {
                response.setContentType("text/css");
            } else if (request.getPath().endsWith(".woff")) {
                response.setContentType("application/x-font-woff");
            } else if (request.getPath().endsWith(".woff2")) {
                response.setContentType("application/x-font-woff2");
            }else if (request.getPath().endsWith(".ttf")) {
                response.setContentType("application/x-font-truetype");
            }

            response.setMessageBody(out.toByteArray());
            response.setSuccessMessage();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }



    }
}
