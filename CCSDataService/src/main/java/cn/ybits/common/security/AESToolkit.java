package cn.ybits.common.security;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

public class AESToolkit {

	public AESToolkit() {
		// TODO Auto-generated constructor stub
	}
	
	public static byte[] doEncrypt(String content, String aesSeed)
	{
		try {
			KeyGenerator keyGen = KeyGenerator.getInstance("AES");  
			
			keyGen.init(128, new SecureRandom(aesSeed.getBytes()));  
			
			SecretKey secretKey = keyGen.generateKey();  
			
			byte[] enCodeFormat = secretKey.getEncoded();  
			
			SecretKeySpec key = new SecretKeySpec(enCodeFormat, "AES");  
			
			Cipher cipher = Cipher.getInstance("AES");
			
			byte[] byteContent;
			byteContent = content.getBytes("UTF-8");

			cipher.init(Cipher.ENCRYPT_MODE, key);
			
			byte[] result = cipher.doFinal(byteContent);  

			return result; // 加密  


		} catch (UnsupportedEncodingException | NoSuchAlgorithmException | NoSuchPaddingException
				| InvalidKeyException | IllegalBlockSizeException | BadPaddingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;  
	}
	
	public static byte[] doDecrypt(byte[] content, String aesSeed)
	{
		try {
			KeyGenerator keyGen = KeyGenerator.getInstance("AES");  

			keyGen.init(128, new SecureRandom(aesSeed.getBytes()));  
			
			SecretKey secretKey = keyGen.generateKey();  
			
			byte[] encodeFormat = secretKey.getEncoded();  
			
			SecretKeySpec key = new SecretKeySpec(encodeFormat, "AES");  
			
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.DECRYPT_MODE, key);
			
			byte[] result = cipher.doFinal(content);
			
			return result; // 加密   

		} catch (NoSuchAlgorithmException e) {  
	         e.printStackTrace();  
		} catch (NoSuchPaddingException e) {  
	         e.printStackTrace();  
		} catch (InvalidKeyException e) {  
	         e.printStackTrace();  
		} catch (IllegalBlockSizeException e) {  
	         e.printStackTrace();  
		} catch (BadPaddingException e) {  
	         e.printStackTrace();  
		}
		
		return null;  
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

}
