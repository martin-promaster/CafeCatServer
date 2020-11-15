package cn.ybits.server;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;

public interface IService {

    void doAction(HttpRequest request, HttpResponse response);

}
