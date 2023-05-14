package cn.ybits.server.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Retention(RetentionPolicy.SOURCE)
@Target({ElementType.METHOD})
public @interface RequestPath {
    String value() default "value";
    String path() default "PathValue";
}
