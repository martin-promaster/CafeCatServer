package cn.ybits.server.intf;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.utils.ContextUtils;

public interface IService {
    String PATH_SEPARATOR = ContextUtils.getInstance().getFileSeparator();
    String WEB_ROOT = ContextUtils.getInstance().getUserProfile() + PATH_SEPARATOR + "webroot" + PATH_SEPARATOR;
    String WEB_APP = "articles";

    void doAction(HttpRequest request, HttpResponse response);
}
