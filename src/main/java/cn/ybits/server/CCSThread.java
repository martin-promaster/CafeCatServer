package cn.ybits.server;

import cn.ybits.protocols.http.HttpRequest;
import cn.ybits.protocols.http.HttpResponse;
import cn.ybits.server.dispatcher.DefaultDispatcher;
import org.apache.logging.log4j.*;

import java.io.*;
import java.net.Socket;

public class CCSThread implements  Runnable  {

    private final static Logger log = LogManager.getLogger(CCSThread.class);

    private final Socket socket;

    public CCSThread(Socket socket) {
        this.socket = socket;
    }

    public void run() {

        try {

            HttpRequest request = new HttpRequest();
            HttpResponse response = new HttpResponse();

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
                        request.setRequestBody(s.getBytes("UTF-8"));
                    } else {
                        request.setRequestBody(null);
                    }

                    break;
                }
            }

            DefaultDispatcher handler = new DefaultDispatcher();

            log.debug("\nReceived request is : "+request);

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
