package cn.ybits.server;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;

public interface IService {

    public void doAction(HttpRequest request, HttpResponse response);

}
