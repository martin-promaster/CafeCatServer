package cn.ybits.server;

public class CCSContext {

    private volatile static CCSContext CCSContext = null;

    private CCSContext() {

    }


    public static CCSContext getInstance() {

        if (CCSContext == null) {
            synchronized (CCSContext.class) {
                if (CCSContext == null) {
                    CCSContext = new CCSContext();
                }
            }
        }

        return CCSContext;
    }

    public String getUserProfile() {
        return System.getProperty("user.dir");
    }
}
