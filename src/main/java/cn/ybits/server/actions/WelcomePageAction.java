package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.IService;
import cn.ybits.server.ActionBase;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class WelcomePageAction extends ActionBase implements IService {

    public void doAction(HttpRequest request, HttpResponse response) {

        StringBuffer sbResponseMessage = new StringBuffer();

        Date nowTime = new Date(System.currentTimeMillis());
        SimpleDateFormat sdFormatter = new SimpleDateFormat("yyyy-MM-dd HH:MM:ss:SS");
        String retStrFormatNowDate = sdFormatter.format(nowTime);

        sbResponseMessage.append("Hello, welcome use CafeCatServer. This is a light web server.<br>" +
                "Now time is: " + retStrFormatNowDate +
                "<br>This is a default page. Please contact administrator of this web site." +
                "<br><br><br>Copyright(C)2020, @ybits, allrights reserved.");

        response.setContentType("text/html");
        try {
            response.setMessageBody(sbResponseMessage.toString().getBytes("UTF-8"));

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}
