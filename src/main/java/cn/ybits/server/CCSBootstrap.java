package cn.ybits.server;

import org.apache.logging.log4j.*;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


public class CCSBootstrap {

    protected static final Logger log = LogManager.getLogger();

    final static ArrayBlockingQueue<Runnable> arrayBlockingQueue = new ArrayBlockingQueue<Runnable>(50);

    private final ThreadPoolExecutor tpe;

    public CCSBootstrap() {
        tpe = new ThreadPoolExecutor(100, 100, 200,
                TimeUnit.MINUTES, arrayBlockingQueue);
    }

    public void startServer() {

        int port = 8081;

        try {
            ServerSocket serverSocket = new ServerSocket(port, 200);
            log.debug("CafeCat Server started successfully.");

            while (true) {

                log.debug("Waiting for connections.");

                final Socket socket = serverSocket.accept();

                log.debug("Connection is established at: " + socket.getInetAddress());
                log.debug("Processing client request from: "+ socket.getRemoteSocketAddress());

                tpe.execute(new CCSThread(socket));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] argv) {
        CCSBootstrap ccs = new CCSBootstrap();
        ccs.startServer();
    }
}
