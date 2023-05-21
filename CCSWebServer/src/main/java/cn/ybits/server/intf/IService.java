package cn.ybits.server.intf;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.utils.ContextUtils;

public interface IService {

    String WEB_ROOT = ContextUtils.getInstance().getUserProfile() + "\\webroot\\";
    String WEB_APP = "articles";

    void doAction(HttpRequest request, HttpResponse response);
}
