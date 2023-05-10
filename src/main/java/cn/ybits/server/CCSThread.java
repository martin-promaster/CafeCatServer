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

            // 1. Begin to process object of HttpRequest.
            HttpRequest request = new HttpRequest();
            BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            while(true) {

                String lineMessage = br.readLine();
                log.debug(lineMessage);

                if (lineMessage.contains("HTTP/1.0") || lineMessage.contains("HTTP/1.1")) {

                    String[] arr = lineMessage.split(" ");

                    request.setMethod(arr[0]);
                    request.setPath(arr[1]);
                    request.setHttpVersion(arr[2]);

                    request.setContentLength(0);
                }

                if (lineMessage.contains("Content-Length")) {
                    request.setContentLength(Integer.parseInt(lineMessage.split(":")[1].trim()));
                }

                if(lineMessage.equals("")) {
                    // Support both POST and GET.
                    if ( (request.getMethod().equals("POST") ||  request.getMethod().equals("GET") ) && request.getContentLength() > 0) {
                        char[] buf = new char[request.getContentLength()];
                        br.read(buf, 0, request.getContentLength());

                        String s = new String(buf);
                        request.setRequestBody(s.getBytes(StandardCharsets.UTF_8));
                    } else {
                        request.setRequestBody(null);
                    }

                    break;
                }
            }

            CCSDefaultDispatcher handler = new CCSDefaultDispatcher();
            log.debug("\nReceived request is : "+request);

            // 2. Begin to process object of HttpResponse.
            HttpResponse response = new HttpResponse();
            handler.dispatch(request, response);

            // response message
            OutputStream out = socket.getOutputStream();
            out.write(response.getResponseMessage());

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
