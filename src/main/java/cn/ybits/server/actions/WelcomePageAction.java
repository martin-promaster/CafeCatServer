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

        Date current = new Date(System.currentTimeMillis());
        String retStrFormatNowDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS").format(current);

        sbResponseMessage.append("Hello, welcome use CafeCatServer. This is a light web server.<br>" + "Now time is: ")
                .append(retStrFormatNowDate)
                .append("<br>This is a default page. Please contact administrator of this web site.")
                .append("<br><br><br>Copyright(C)2020, @ybits, allrights reserved.");

        response.setContentType("text/html");
        try {
            response.setMessageBody(sbResponseMessage.toString().getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}
