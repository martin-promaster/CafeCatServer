/**
 * Description:
 *   This class implements the cached database query result set.
 *   
 *   @author Martin Dong
 */
package cn.ybits.common.dbcp;

import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.List;

public class SqlResultSet {
	
	private int rowCount = 0;
	private int colCount = 0;
	
	// Added by: Martin 2015-3-9
	/**
	 * The value of currentRowNum must be -1 
	 * because index of the first record of this result set is begin with 0.
	 */
	private int currentRowNum = -1;
	
	private List<String> colFieldNames = new ArrayList<String>();	
	private List<Integer> colDataTypes = new ArrayList<Integer>();

	private List<List<Object>> rows = new ArrayList<List<Object>>();
	
	/***
	 * @description Get field index by field name
	 * @param fieldName
	 * @return fieldIndex
	 */
	private int getIndexByFieldName(String fieldName)
	{
		int iFieldIndex = 0;
		
		iFieldIndex = colFieldNames.indexOf(fieldName);
		
		return iFieldIndex;
	}

	/*
	private int getRowCount(ResultSet rs)
	{
		int nRowCount = 0;
		
		try
		{
			rs.last();
			nRowCount = rs.getRow()+1;
		}
		catch(SQLException sqlex)
		{
			sqlex.printStackTrace();
		}
		
		return nRowCount;
	}
	*/
	
	private int getColCount(ResultSet rs)
	{
		int nColCount = 0;
		try
		{
			ResultSetMetaData rsmd = rs.getMetaData();
			
			nColCount = rsmd.getColumnCount();
			
			for(int i = 1; i <= nColCount; i++)
			{
				colDataTypes.add(new Integer(rsmd.getColumnType(i)));
				colFieldNames.add(rsmd.getColumnName(i));
			}
		}
		catch(SQLException sqlex)
		{
			sqlex.printStackTrace();
		}
		
		return nColCount;
	}
	
	public void fill(ResultSet rs)
	{
		try {
			rowCount = 0;
			colCount = 0;
			
			currentRowNum = -1;
			
			while(rs.next())
			{
				List<Object> row = new ArrayList<Object>();
				
				if (colCount == 0) 
					colCount = getColCount(rs);

				for (int i = 1; i <= colCount; i++)
				{
					row.add(rs.getObject(i));
				}
				
				rows.add(row);
			}
			
			rowCount = rows.size();
		}
		catch(SQLException sqlex)
		{
			sqlex.printStackTrace();
		}
	}
	
	public int getColDataType(int i)
	{
		int iDataType = 0;
		
		iDataType = colDataTypes.get(i).intValue();
		
		return iDataType;
	}
	
	public String getColDataTypeName(int i)
	{
		int iDataType = 0;
		String sDataType = "";
		
		iDataType = colDataTypes.get(i).intValue();
		
		switch(iDataType) {
		case java.sql.Types.VARCHAR:
			sDataType = "VARCHAR";
			break;
		case java.sql.Types.LONGVARCHAR:
			sDataType = "TEXT";
			break;
		case java.sql.Types.INTEGER:
			sDataType = "INTEGER";
			break;
		case java.sql.Types.DATE:
			sDataType = "DATETIME";
			break;
		case java.sql.Types.TIMESTAMP:
			sDataType = "TIMESTAMP";
			break;
		case java.sql.Types.SMALLINT:
			sDataType = "SMALLINT";
			break;
		case java.sql.Types.TINYINT:
			sDataType = "TINYINT";
			break;
		case java.sql.Types.DECIMAL:
			sDataType = "DECIMAL";
			break;
		case java.sql.Types.BIT:
			sDataType = "BIT";
			break;
		default:
			sDataType = "NA:"+String.valueOf(iDataType);
		}
		
		return sDataType;
	}
	
	public String getColFieldName(int i)
	{
		return colFieldNames.get(i);
	}
	
	public boolean next()
	{
		currentRowNum++;
		if (currentRowNum < rowCount)
		{
			return true;
		}
		else
		{
			currentRowNum = -1;
			return false;
		}
	}
	
	
	////////////////////////////////////////////////////////////////////////////	
	// By field index
	public Object getObject(int i) {
		return rows.get(currentRowNum).get(i);
	}
	
	public String getString(int i)
	{
		return (String)rows.get(currentRowNum).get(i);
	}
	
	public Boolean getBit(int i)
	{
		return (Boolean)rows.get(currentRowNum).get(i);
	}
	
	public int getInt(int i)
	{
		return (int)rows.get(currentRowNum).get(i);
	}
	
	public Date getDate(int i)
	{
		return (Date)rows.get(currentRowNum).get(i);
	}
	
	public java.sql.Timestamp getTimestamp(int i)
	{
		LocalDateTime localDateTime = (LocalDateTime)rows.get(currentRowNum).get(i);
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
		return Timestamp.valueOf(localDateTime.format(dateTimeFormatter));
	}

	/**
	 * Get data value by table field name.
	 * Date: 2015-09-06
	 * @param sFieldName Table field name
	 * @author MARTIN
	 */
	public String getString(String sFieldName)
	{
		return (String)rows.get(currentRowNum).get(getIndexByFieldName(sFieldName));
	}
	
	public int getInt(String sFieldName)
	{
		return (int)rows.get(currentRowNum).get(getIndexByFieldName(sFieldName));
	}
	
	public Long getLong(String sFieldName) {
		return (Long)rows.get(currentRowNum).get(getIndexByFieldName(sFieldName));
	}
	
	public Date getDate(String sFieldName)
	{
		return getDate(getIndexByFieldName(sFieldName));
	}
	
	public java.sql.Timestamp getTimestamp(String sFieldName)
	{
		return getTimestamp(getIndexByFieldName(sFieldName));
	}
	
	// Properties methods.
	public int Rows()
	{
		return rowCount;
	}
	
	public int Cols()
	{
		return colCount;
	}
	
	public void first()
	{
		currentRowNum = -1;
	}

}
