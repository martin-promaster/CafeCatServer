package cn.ybits.common.dbcp.impl;

import cn.ybits.common.dbcp.SqlHelperFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.Properties;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

public class MySqlHelperFactory implements SqlHelperFactory {
	Logger logger = LogManager.getLogger(MySqlHelperFactory.class);
	
	private static final String SQL_TYPE = "sql.type";
	private static final String KEY_CONNECTION_POOL_SIZE = "sql.connectiopool.size";
	private static final String KEY_URL = "sql.mysql.url"; 
	private static final String KEY_SCHEMA = "sql.mysql.schema"; 
	private static final String KEY_USERNAME = "sql.mysql.username"; 
	private static final String KEY_PASSWORD = "sql.mysql.password"; 
	private static final String KEY_USE_SSL = "sql.mysql.usessl";
	private static final String KEY_AUTO_RECONNECT = "sql.mysql.autoreconnect";

	private int connection_pool_size = 10;
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
			Properties p = getResourceFile(defaultConfigurationFile);

			String sql_type = p.getProperty(SQL_TYPE);
			connection_pool_size = Integer.parseInt(p.getProperty(KEY_CONNECTION_POOL_SIZE));
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

	private Properties getResourceFile(String resource) throws URISyntaxException, IOException {
		Properties properties = new Properties();

		// +
		// Author: Martin Dong <martin.dong@139.com>
		// Date: 2023-05-21
		// Comment: Get the project configuration file, skip jar file configuration file.
		URL resURL = null;
		Enumeration<URL> es = this.getClass().getClassLoader().getResources(resource);
		while ( es.hasMoreElements() ) {
			resURL = es.nextElement();
			logger.debug("this.getClass url: " + resURL);
		}
		// -

		assert resURL != null;
		logger.debug("Resource URL is "+resURL.toString());
		if (resURL.getProtocol().equals("jar")) {
			logger.debug("File protocol: jar:file:");
			String jarFilePath = resURL.getPath().split("!")[0].replace("file:/", "");
			logger.debug("File path:"+jarFilePath);
			try ( JarFile jarFile = new JarFile(jarFilePath) ) {
				JarEntry jarEntry = jarFile.getJarEntry("database.xml");
				logger.debug("File size:"+jarEntry.getSize());
				properties.loadFromXML(jarFile.getInputStream(jarEntry));
				return properties;
			}
		} else {
			properties.loadFromXML( Files.newInputStream( Paths.get(resURL.toURI())) );
			return properties;
		}
	}

	@Override
	public int getConnectionPoolSize() {
		// TODO Auto-generated method stub
		return connection_pool_size;
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
