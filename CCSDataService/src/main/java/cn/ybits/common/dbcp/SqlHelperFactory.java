package cn.ybits.common.dbcp;

public interface SqlHelperFactory {
	
	public int getConnectionPoolSize();
	
	public String getUrl();
	
	public String getSchema();
	
	public String getUsername();
	
	public String getPassword();
	
	public String getUseSsl();
	
	public String getAutoReconnect();

}
