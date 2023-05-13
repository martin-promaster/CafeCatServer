package cn.ybits.common.security;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

public class SecurityUtils {
	public final static String getMD5As64(String str) {
		return Base64.encodeBase64String(DigestUtils.md5Hex(str).getBytes());
    }
	
	public final static String getMD5(String str) {
		return DigestUtils.md5Hex(str);
    }

}
