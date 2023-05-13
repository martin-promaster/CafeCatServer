package cn.ybits.common.utils;
/**
 * @author Martin Dong <djpmp2010@gmail.com>
 *
 */
public class StringUtils {

	/**
	 * 
	 */
	public StringUtils() {
		// TODO Auto-generated constructor stub
	}
	
	public static boolean isUpperCase(char c) {
		/*
		 * According to the ASCII code table
		 * 'A' to 'Z' (65 to 90) return true.
		 * 'a' to 'z' (97 to 122) return false.
		 */
		return (c > 64 && c < 91)?true:false;
	}
	
}
