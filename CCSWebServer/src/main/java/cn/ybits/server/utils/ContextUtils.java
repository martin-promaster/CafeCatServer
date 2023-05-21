package cn.ybits.server.utils;

import cn.ybits.common.dbcp.SqlStore;

public class ContextUtils {

    private volatile static ContextUtils ContextUtils = null;
    private SqlStore sqlStore;

    private ContextUtils() {
    }

    public static ContextUtils getInstance() {
        if (ContextUtils == null) {
            synchronized (ContextUtils.class) {
                if (ContextUtils == null) {
                    ContextUtils = new ContextUtils();
                }
            }
        }
        return ContextUtils;
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
