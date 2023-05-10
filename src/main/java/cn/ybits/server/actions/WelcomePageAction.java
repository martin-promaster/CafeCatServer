package cn.ybits.server.actions;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.IService;
import cn.ybits.server.CCSDefaultAction;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;

public class WelcomePageAction extends CCSDefaultAction implements IService {

    public void doAction(HttpRequest request, HttpResponse response) {

        StringBuilder sbResponseMessage = new StringBuilder();

        Date current = new Date(System.currentTimeMillis());
        String retStrFormatNowDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SS").format(current);

        sbResponseMessage
                .append("<h1>Hello, welcome use CafeCatServer. </h1>This is a light-weight web server.<br>" + "Now time is: ")
                .append(retStrFormatNowDate)
                .append("<h3>This is a default page, please contact administrator of this web site.</h3>")
                .append("Copyright (C) 2021, @YBITS, All rights reserved.");

        response.setPayload(sbResponseMessage.toString().getBytes(StandardCharsets.UTF_8));
    }
}
