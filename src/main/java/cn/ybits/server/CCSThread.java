package cn.ybits.server;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.dispatcher.CCSDefaultDispatcher;
import org.apache.logging.log4j.*;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class CCSThread implements  Runnable  {

    private final static Logger log = LogManager.getLogger(CCSThread.class);

    private final Socket socket;

    public CCSThread(Socket socket) {
        this.socket = socket;
    }

    public void run() {

        try {
            CCSDefaultDispatcher handler = new CCSDefaultDispatcher(socket.getInputStream());
            log.debug("Received request is : "+ handler.getRequest().toString());

            handler.dispatch(handler.getRequest(), handler.getResponse());

            socket.getOutputStream().write(handler.getResponse().getResponseMessage());

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
}
