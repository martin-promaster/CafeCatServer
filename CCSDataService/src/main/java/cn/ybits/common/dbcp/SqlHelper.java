/**
 * @description:
 *  This is the common interface of the database operation.
 * @author Martin Dong <djpmp2010@gmail.com>
 */
package cn.ybits.common.dbcp;

import cn.ybits.common.exception.FuncParamNullPointerException;

/**
 * @author Martin
 *
 */
public abstract class SqlHelper {
	
	
	public abstract void initConnectionPool();
	
	/**
	 * Do SQL query.
	 * @param strSql
	 * @return DbResult
	 */
	public abstract SqlResultSet doQuery(String strSql);
	
	/**
	 * Do SQL execution.
	 * @param strSql
	 * @return
	 */
	public abstract int doExec(String strSql);
	
	/**
	 * Only value object which according to mapping rule 
	 * of database field to class field is supported by this method.
	 * The detail of mapping rule is listed below: 
	 * 
	 * <table style="border: 1px solid">
	 * <tr><td>Database field name</td><td>Java property name</td></tr>
	 * <tr><td>oper_id</td><td>operId</td></tr>
	 * </table>
	 * 
	 * @param obj - All simple POJO object.
	 * @return SqlResultSet
	 * @throws FuncParamNullPointerException
	 * @throws NullPointerException
	 * @author MARTIN DONG
	*/  
	public abstract SqlResultSet doPreparedQuery(Object obj) throws FuncParamNullPointerException;

}
