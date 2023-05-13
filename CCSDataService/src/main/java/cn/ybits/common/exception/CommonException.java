package cn.ybits.common.exception;
/**
 * @author Martin Dong <djpmp2010@gmail.com>
 *
 */
public class CommonException extends Exception {

	private static final long serialVersionUID = 3661757905755394406L;

	/**
	 * 
	 */
	public CommonException() {
		super();
	}

	/**
	 * @param s
	 */
	public CommonException(String s) {
		super(s);
	}

	/**
	 * @param t
	 */
	public CommonException(Throwable t) {
		super(t);
	}

	/**
	 * @param s
	 * @param t
	 */
	public CommonException(String s, Throwable t) {
		super(s, t);
		// TODO Auto-generated constructor stub
	}

	/*
	public PlatformException(String arg0, Throwable arg1, boolean arg2,
			boolean arg3) {
		super(arg0, arg1, arg2, arg3);
		// TODO Auto-generated constructor stub
	}
	*/

}
