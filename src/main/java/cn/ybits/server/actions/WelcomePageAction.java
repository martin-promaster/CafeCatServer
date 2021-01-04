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

        StringBuilder sbResponseMessage = new StringBuilder();

        Date current = new Date(System.currentTimeMillis());
        String retStrFormatNowDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS").format(current);

        sbResponseMessage.append("<h1>Hello, welcome use CafeCatServer. </h1>This is a light-weight web server.<br>" + "Now time is: ")
                .append(retStrFormatNowDate)
                .append("<h3>This is a default page, please contact administrator of this web site.</h3>")
                .append("Copyright (C) 2021, @YBITS, All rights reserved.");

        response.setContentType("text/html");
        try {
            response.setMessageBody(sbResponseMessage.toString().getBytes("UTF-8"));
            response.setSuccessMessage();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}
