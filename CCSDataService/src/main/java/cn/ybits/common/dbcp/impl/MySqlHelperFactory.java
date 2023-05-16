package cn.ybits.common.dbcp.impl;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import cn.ybits.common.dbcp.SqlHelperFactory;

public class MySqlHelperFactory implements SqlHelperFactory {
	
	private static final String SQL_TYPE = "sql.type";
	private static final String KEY_CONNECTION_POOL_SIZE = "sql.connectiopool.size";
	private static final String KEY_URL = "sql.mysql.url"; 
	private static final String KEY_SCHEMA = "sql.mysql.schema"; 
	private static final String KEY_USERNAME = "sql.mysql.username"; 
	private static final String KEY_PASSWORD = "sql.mysql.password"; 
	private static final String KEY_USE_SSL = "sql.mysql.usessl";
	private static final String KEY_AUTO_RECONNECT = "sql.mysql.autoreconnect";

	private int connectionpool_size = 10;
	private String url = "";
	private String schema = "";
	private String username = "";
	private String password = "";
	private String use_ssl = "";
	private String auto_reconnect = ""; 

	public MySqlHelperFactory(String defaultConfigurationFile) {
		init(defaultConfigurationFile);
	}
	
	private void init(String defaultConfigurationFile) {
		try {
			Properties p = new Properties();

			InputStream is = Files.newInputStream(getResourcePath(defaultConfigurationFile));
			p.loadFromXML(is);

			String sql_type = p.getProperty(SQL_TYPE);
			connectionpool_size = Integer.parseInt(p.getProperty(KEY_CONNECTION_POOL_SIZE));
			url = p.getProperty(KEY_URL);
			schema = p.getProperty(KEY_SCHEMA);
			username = p.getProperty(KEY_USERNAME);
			password = p.getProperty(KEY_PASSWORD);
			use_ssl = p.getProperty(KEY_USE_SSL);
			auto_reconnect = p.getProperty(KEY_AUTO_RECONNECT);

		} catch(IOException | NullPointerException | URISyntaxException e) {
			e.printStackTrace();
		}
	}

	private Path getResourcePath(String resource) throws URISyntaxException {
		URL resourceURL = Thread.currentThread().getContextClassLoader().getResource(resource);
		assert resourceURL != null;
		System.out.println(resourceURL.toString());
		return Paths.get(resourceURL.toURI());
	}

	@Override
	public int getConnectionPoolSize() {
		// TODO Auto-generated method stub
		return connectionpool_size;
	}

	@Override
	public String getUrl() {
		// TODO Auto-generated method stub
		return url;
	}

	@Override
	public String getSchema() {
		// TODO Auto-generated method stub
		return schema;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return username;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return password;
	}

	@Override
	public String getUseSsl() {
		// TODO Auto-generated method stub
		return use_ssl;
	}

	@Override
	public String getAutoReconnect() {
		// TODO Auto-generated method stub
		return auto_reconnect;
	}

}
