package cn.ybits.server;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 方法类
 */
public class ReflectionUtils {

    /**
     * 循环向上转型
     * @param object    子类对象
     * @param methodName    父类中的方法名
     * @param parameterTypes    父类中的方法参数类型
     * @return  父类中的方法对象
     */
    public static Method getDeclaredMethod(Object object, String methodName, Class<?>... parameterTypes){
        Method method = null;
        for(Class<?> clazz = object.getClass(); clazz != Object.class; clazz = clazz.getSuperclass()){
            try {
                method = clazz.getDeclaredMethod(methodName, parameterTypes);
                return method;
            } catch (NoSuchMethodException e) {
                //不需要处理
                //不断向父类查询是否有某个方法
            }
        }
        return null;
    }

    /**
     * 直接调用对象方法，而忽略修饰符(private, protected, default)
     * @param object    子类对象
     * @param methodName    父类的方法名
     * @param parameterTypes    父类的方法参数类型
     * @param parameters        父类的方法参数
     * @return      父类中方法的执行结果
     */
    public static Object invokeMethod(Object object, String methodName, Class<?>[] parameterTypes,
                                      Object[] parameters){
        //根据对象、方法名和对应的方法参数，通过取Method对象
        Method method = getDeclaredMethod(object, methodName, parameterTypes);
        //控制Java对方法进行检查，主要针对私有方法而言
        assert method != null;
        method.setAccessible(true);
        try {
            //调用object的method所代表的方法，其方法的参数是parameters
            return method.invoke(object, parameters);
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * 循环向上转型, 获取属性
     * @param object : 子类对象
     * @param fieldName : 父类中
     * @return 父类中
     * */
    public static Field getDeclaredField(Object object, String fieldName){
        Field field = null;
        Class<?> clazz = object.getClass();
        for(;clazz != Object.class; clazz = clazz.getSuperclass()){
            try {
                field = clazz.getDeclaredField(fieldName);
                return field;
            } catch (NoSuchFieldException e) {
                //不需要处理
                //不断向父类查询是否有某个字段
            }
        }
        return null;
    }

    /**
     * 直接设置对象的属性值，忽略private/protected修饰符
     * @param object    子类对象
     * @param fieldName 父类中的字段名
     * @param value     将要设置的值
     */
    public static void setFieldValue(Object object, String fieldName, Object value){
        //根据对象和属性名通过取Field对象
        Field field = getDeclaredField(object, fieldName);
        //控制Java对其的检查
        assert field != null;
        field.setAccessible(true);
        //将object中field所代表的的值设置为value
        try {
            field.set(object, value);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    /**
     * 直接读的属性值, 忽略 private/protected 修饰符, 也
     * @param object : 子类对象
     * @param fieldName : 父类中
     * @return : 父类中     */
    public static Object getFieldValue(Object object, String fieldName){
        //根据对象和属性名通过取Field对象
        Field field = getDeclaredField(object, fieldName);
        assert field != null;
        field.setAccessible(true);
        try {
            return field.get(object);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return  null;
    }
}
