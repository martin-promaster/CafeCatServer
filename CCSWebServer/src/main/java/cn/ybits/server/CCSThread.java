package cn.ybits.server;

import cn.ybits.server.dispatcher.CCSDefaultDispatcher;
import org.apache.logging.log4j.*;

import java.io.*;
import java.net.Socket;
import java.util.Map;

public class CCSThread implements  Runnable  {

    private final static Logger log = LogManager.getLogger(CCSThread.class);
    private final Socket socket;
    private final Map<String, String> actionMap;

    public CCSThread(Socket socket, Map<String, String > actionMap) {
        this.socket = socket;
        this.actionMap = actionMap;
    }

    public void run() {
        try {
            CCSDefaultDispatcher handler = new CCSDefaultDispatcher(socket.getInputStream(), actionMap);
            if (null != handler.getRequest().getPath()) {
                log.debug("Received TX is : "+ handler.getRequest().toString());
                handler.dispatch();
                log.debug("Returned RX is : "+ handler.getResponse().toString());
                socket.getOutputStream().write(handler.getResponse().getResponseMessage());
            }
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
