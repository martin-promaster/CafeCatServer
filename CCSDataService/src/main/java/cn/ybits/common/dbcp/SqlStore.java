/**
 * 
 */
package cn.ybits.common.dbcp;

import java.util.HashMap;

import cn.ybits.common.dbcp.impl.MySqlHelper;
import cn.ybits.common.dbcp.impl.MySqlHelperFactory;

/**
 * @author Martin
 *
 */
public class SqlStore {
	
	private HashMap<String, SqlHelper> sqlMap = new HashMap<String, SqlHelper>();
	
	/**
	 * Create SqlHelper and put the SqlHelper to the SqlStore.
	 * 
	 * @param sqlHelperType - Always be the type: mysql, oracle, sqlserver, and etc.
	 * @param sqlHelperName - User-defined name, in order to get from SqlStore.
	 * @param databaseConfigFile - The path and filename of the configure file.
	 */
	public void createSqlHelper(String sqlHelperType, String sqlHelperName, String databaseConfigFile) {
		
		SqlHelper sh = null;
		
		if (sqlHelperType.equals("mysql")) {
			
			MySqlHelperFactory factory = new MySqlHelperFactory(databaseConfigFile);
			
			sh = new MySqlHelper(factory);
			
			sqlMap.put(sqlHelperName, sh);
		}
		
		
	}
	
	public SqlHelper get(String sqlHelperName) {
		return sqlMap.get(sqlHelperName);
	}
	
	//	public SqlHelper find(String sqlHelperName) {
	//		String key = "";
	//		SqlHelper value = null;
	//		
	//		Iterator<Entry<String, SqlHelper>> it = sqlMap.entrySet().iterator();
	//		while(it.hasNext()) {
	//			Map.Entry<String, SqlHelper> entry = (Map.Entry<String, SqlHelper>)it.next();
	//			key = entry.getKey();
	//			if(key.equals(sqlHelperName)) {
	//				value = entry.getValue();
	//				break;
	//			}
	//		}
	//		
	//		return value;
	//	}

}
