package cn.ybits.common.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.binary.Base64;

public class SHA1Toolkit {

	private static int saltSize = 40;
	private static int iterations = 1000;
	private static int subKeySize = 32;

	/**
	 * 获取 Salt
	 * @return
	 */
	public static String getSalt() {
		return Rfc2898DeriveBytes.generateSalt(saltSize);
	}
	
	public static String toHexString(byte[] bHex)
	{
		StringBuffer sb = new StringBuffer();
		
		for(byte b : bHex)
		{
			int usbyte = b>0?b:b+256;
			
			if(usbyte<16)
				sb.append("0"+String.format("%x", usbyte));
			else
				sb.append(String.format("%x", usbyte));
		}
		
		return sb.toString();
	}

	/**
	 * 获取hash后的密码
	 * @param password
	 * @param salt
	 * @return
	 */
	public static String getHash(String password, String salt) {
		Rfc2898DeriveBytes keyGenerator = null;
		try {
			keyGenerator = new Rfc2898DeriveBytes(password + salt, saltSize, iterations);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		byte[] subKey = keyGenerator.getBytes(subKeySize);
		byte[] bSalt = keyGenerator.getSalt();
		byte[] hashPassword = new byte[1 + saltSize + subKeySize];
		System.arraycopy(bSalt, 0, hashPassword, 1, saltSize);
		System.arraycopy(subKey, 0, hashPassword, saltSize + 1, subKeySize);
		System.out.println("getHash()>>>"+toHexString(hashPassword));
		return Base64.encodeBase64String(hashPassword);
	}

	/**
	 * 验证密码
	 * @param hashedPassword
	 * @param password
	 * @param salt
	 * @return
	 */
	public static boolean verify(String hashedPassword, String password, String salt) {
		byte[] hashedPasswordBytes = Base64.decodeBase64(hashedPassword);
		if (hashedPasswordBytes.length != (1 + saltSize + subKeySize) || hashedPasswordBytes[0] != 0x00) {
			return false;
		}

		byte[] bSalt = new byte[saltSize];
		System.arraycopy(hashedPasswordBytes, 1, bSalt, 0, saltSize);
		byte[] storedSubkey = new byte[subKeySize];
		System.arraycopy(hashedPasswordBytes, 1 + saltSize, storedSubkey, 0, subKeySize);
		Rfc2898DeriveBytes deriveBytes = null;
		try {
			deriveBytes = new Rfc2898DeriveBytes(password + salt, bSalt, iterations);
		} catch (Exception e) {
			e.printStackTrace();
		}
		byte[] generatedSubkey = deriveBytes.getBytes(subKeySize);
		return byteArraysEqual(storedSubkey, generatedSubkey);
	}

	private static boolean byteArraysEqual(byte[] storedSubkey, byte[] generatedSubkey) {
		int size = storedSubkey.length;
		if (size != generatedSubkey.length) {
			return false;
		}

		for (int i = 0; i < size; i++) {
			if (storedSubkey[i] != generatedSubkey[i]) {
				return false;
			}
		}
		return true;
	}
	
	public static String getSha1(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA1");
        byte[] result = md.digest(input.getBytes());
        
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < result.length; i++) {
            sb.append(Integer.toString((result[i] & 0xff) + 0x100, 16).substring(1));
        }
         
        return sb.toString();
    }
	
	public static void main(String[] args) throws NoSuchAlgorithmException {
		
		String password = "password";
		String salt = SHA1Toolkit.getSalt();
		
		System.out.println("salt:" + salt);
		System.out.println("password:" + password);
		
		String hashPassword = SHA1Toolkit.getHash(password, salt);
		System.out.println("hashPassword:" + hashPassword);
		
		// verify
		boolean result = SHA1Toolkit.verify(hashPassword, password, salt);
		System.out.println("Verify:" + result);
		
		String pw2 = "d900585";
		System.out.println(getSha1("16b4941459af196eaa8a83c8422fcec3"+getSha1(pw2)));

	}

}
