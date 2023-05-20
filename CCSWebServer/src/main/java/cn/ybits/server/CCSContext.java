package cn.ybits.server;

import cn.ybits.common.dbcp.SqlStore;

public class CCSContext {

    private volatile static CCSContext CCSContext = null;
    private SqlStore sqlStore;

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

    public SqlStore getSqlStore() {
        return this.sqlStore;
    }

    public void setSqlStore(SqlStore sqlStore) {
        this.sqlStore = sqlStore;
    }
}
