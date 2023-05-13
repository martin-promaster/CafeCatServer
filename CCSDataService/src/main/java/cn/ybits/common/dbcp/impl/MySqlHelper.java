/**
 * @Description:
 *   This class implements the cached database connection pool.
 *   
 * @author Martin Dong <djpmp2010@gmail.com>
 */
package cn.ybits.common.dbcp.impl;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import cn.ybits.common.dbcp.SqlHelper;
import cn.ybits.common.dbcp.SqlHelperFactory;
import cn.ybits.common.dbcp.SqlResultSet;
import cn.ybits.common.exception.FuncParamNullPointerException;
import cn.ybits.common.utils.StringUtils;

public class MySqlHelper extends SqlHelper {
	
	private boolean hasPooled = false;
	private String sConnString = "";
	private BlockingQueue<Connection> idleConnectionPool = new LinkedBlockingQueue<Connection>();
	
	private SqlHelperFactory shf = null;
	
	public MySqlHelper(SqlHelperFactory sqlHelperFactory) {
		if (sqlHelperFactory == null) 
			throw new NullPointerException();
		this.shf = sqlHelperFactory;
	}

	public void initConnectionPool()
	{
		try
		{
			if (!hasPooled)
			{

				Class.forName("com.mysql.cj.jdbc.Driver");
				sConnString = "jdbc:mysql://" + shf.getUrl() + "/"+ shf.getSchema() 
						+ "?user=" + shf.getUsername() 
						+ "&password=" + shf.getPassword()
						+ "&useSSL=" + shf.getUseSsl() 
						+ "&autoReconnect=" + shf.getAutoReconnect() + "&allowPublicKeyRetrieval=true&serverTimezone=GMT%2B8" ;
				
				for (int i = 0; i < shf.getConnectionPoolSize(); i++)
				{
					
					Connection conn = DriverManager.getConnection(sConnString);
					idleConnectionPool.put(conn);
				}
				
				hasPooled = true;
			}
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/**
	 * Detect if the connection is closed by the server as connection is timeout.
	 * @author Martin
	 * @param conn
	 * @return true if the connection is normal, otherwise, return false.
	 */
	private boolean validate(Connection conn)
	{
		boolean isValidated = true;
		try {
			com.mysql.cj.jdbc.ConnectionImpl c = (com.mysql.cj.jdbc.ConnectionImpl)conn;
			c.ping();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			// e.printStackTrace();
			isValidated = false;
		}
		
		return isValidated;
	}
	
	private Connection getConnection() {
	
		initConnectionPool();
		
		Connection c = idleConnectionPool.poll();
		
		if(!validate(c))
		{
			try {
				c = DriverManager.getConnection(sConnString);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return c;
	}
	
	private void returnConnection(Connection c)
	{
		try {
			idleConnectionPool.put(c);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	@Override
	public SqlResultSet doQuery(String strSql) {

		SqlResultSet dbrs = null;
		
		try
		{
			Connection conn = getConnection();
			
			PreparedStatement ps = conn.prepareStatement(strSql, 
					ResultSet.TYPE_SCROLL_INSENSITIVE,
	            	ResultSet.CONCUR_READ_ONLY);
			
			ResultSet rs = ps.executeQuery();
				
			dbrs = new SqlResultSet();
			dbrs.fill(rs);
			
			rs.close();
			ps.close();
			
			returnConnection(conn);
		}
		catch(SQLException sqlex)
		{
			sqlex.printStackTrace();
		}

		return dbrs;
	}

	@Override
	public int doExec(String strSql) {
		// TODO Auto-generated method stub
		
		int retVal = 0;
		
		try {
			Connection conn = getConnection();
			PreparedStatement ps = conn.prepareStatement(strSql, 
					ResultSet.TYPE_SCROLL_INSENSITIVE,
	            	ResultSet.CONCUR_READ_ONLY);
			
			retVal = ps.executeUpdate();
			
			ps.close();
			
			returnConnection(conn);
		}
		catch(SQLException e) {  
			e.printStackTrace();  
		}
		
		return retVal;
		
	}

	@Override
	public SqlResultSet doPreparedQuery(Object object) throws FuncParamNullPointerException
	{
		if(object == null)
		{
			FuncParamNullPointerException e = new FuncParamNullPointerException();
			throw e;
		}
		
		//String databaseTable = object.getClass().getSimpleName().toLowerCase();
		
		String databaseTable = "tbl_plt" + parseTableName(object.getClass().getSimpleName());
		
		String strSql;
		strSql = "SELECT * FROM " + databaseTable;
		
		List<String> whereClause = new ArrayList<String>();
		whereClause.add(" WHERE ");
		
		List<Object> fieldList = new ArrayList<Object>();
		
		Field[] fs = object.getClass().getDeclaredFields();
		for (Field f: fs)
		{
			String fieldName = f.getName();
			String methodName = getMethodName(fieldName);
			String tableFieldName = getTableFieldName(fieldName);
			
			// Class c = f.getType();
			
			try {
				Method m = object.getClass().getDeclaredMethod(methodName);
				Object o = m.invoke(object);
				if (o != null)
				{
					whereClause.add(tableFieldName + "=? ");
					whereClause.add(" AND ");
					
					fieldList.add(o);
				}
				
			} catch (NoSuchMethodException | SecurityException | IllegalAccessException 
					| IllegalArgumentException | InvocationTargetException e) {
				e.printStackTrace();
			}
	
		}
		
		
		if (fieldList.size() > 0)
		{
			for(int i = 0; i<whereClause.size()-1; i++)
			{
				strSql += whereClause.get(i);
			}
		}
		// end of generate SQL
		
		SqlResultSet dbrs = null;
		
		try
		{
			Connection conn = getConnection();
			
			PreparedStatement ps = conn.prepareStatement(strSql,
					ResultSet.TYPE_SCROLL_INSENSITIVE,
	            	ResultSet.CONCUR_READ_ONLY);
			
			int index = 1;
			
			for (Object o : fieldList)
			{
				String typeName = o.getClass().getTypeName();
				
				if(typeName.contains("String"))
				{
					ps.setString(index, (String)o);
				}
				else if (typeName.contains("Integer"))
				{
					ps.setInt(index, (int)o);
				}
				else if(typeName.contains("java.sql.Date"))
				{
					ps.setDate(index, (java.sql.Date)o);
				}
				else if(typeName.contains("Long"))
				{
					ps.setLong(index, (Long)o);
				}

				index++;
			}
			
			ResultSet rs = ps.executeQuery();
			
			// Convert ResultSet to cached SqlResultSet.
			dbrs = new SqlResultSet();
			dbrs.fill(rs);
			
			rs.close();
			ps.close();
			
			returnConnection(conn);
		}
		catch(Exception sqlex)
		{
			sqlex.printStackTrace();
		}
		
		return dbrs;

	}
	
	private String getMethodName(String arg0)
	{
		return "get" + arg0.toUpperCase().charAt(0) + arg0.substring(1);
	}
	
	private String getTableFieldName(String arg0)
	{
		return parseExp(arg0);
	}
	
	private String parseTableName(String arg0)
	{
		return parseExp(arg0);
	}
	
	private String parseExp(String arg0)
	{
		String sRetVal = "";

		for(char c : arg0.toCharArray())
		{
			if(StringUtils.isUpperCase(c)) {
				sRetVal += "_" + String.format("%c", c + 32);
			}
			else {
				sRetVal += c;
			}
		}
		
		return sRetVal;
	}

}
