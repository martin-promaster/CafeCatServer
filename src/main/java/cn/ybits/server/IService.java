package cn.ybits.server;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;

public interface IService {

    String WEB_ROOT = CCSContext.getInstance().getUserProfile() + "\\webroot\\";
    String WEB_APP = "articles";

    void doAction(HttpRequest request, HttpResponse response);
}
