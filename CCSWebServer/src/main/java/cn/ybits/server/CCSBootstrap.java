package cn.ybits.server;

import cn.ybits.common.dbcp.SqlStore;
import org.apache.logging.log4j.*;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


public class CCSBootstrap {

    private final static Logger log = LogManager.getLogger(CCSBootstrap.class);

    final static ArrayBlockingQueue<Runnable> arrayBlockingQueue = new ArrayBlockingQueue<Runnable>(50);
    final int corePoolSize = 100;
    final int maximumPoolSize = 100;
    final long keepAliveTime = 200;
    final int port = 8081;
    final int backlog = 200;
    private final ThreadPoolExecutor tpe;

    public CCSBootstrap() {
        tpe = new ThreadPoolExecutor(corePoolSize, maximumPoolSize, keepAliveTime,
                TimeUnit.MINUTES, arrayBlockingQueue);
    }

    public void startServer() {
        Class<?> clazzCCSRequestMapping = null;
        Map<String, String> actionMap;
        try {
            clazzCCSRequestMapping = Class.forName("cn.ybits.server.dispatcher.CCSRequestMapping");
            cn.ybits.server.dispatcher.CCSRequestMapping ccsRequestMapping = (cn.ybits.server.dispatcher.CCSRequestMapping) clazzCCSRequestMapping.newInstance();
            actionMap = new HashMap<String, String>(cn.ybits.server.dispatcher.CCSRequestMapping.map);
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }

        SqlStore sqlStore = new SqlStore();
        sqlStore.createSqlHelper("mysql", "pms_db", "database.xml");
        CCSContext.getInstance().setSqlStore(sqlStore);

        try {
            try (ServerSocket serverSocket = new ServerSocket(port, backlog)) {
                log.debug("CafeCat Server started successfully.");
                while (true) {
                    log.debug("Waiting for connections.");
                    final Socket socket = serverSocket.accept();
                    log.debug("Connection is established at: {},  Processing client request from: {}",
                            socket.getInetAddress(), socket.getRemoteSocketAddress());
                    tpe.execute(new CCSThread(socket, actionMap));
                }
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
