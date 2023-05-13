package cn.ybits.server;

import cn.ybits.server.annotation.ResponseBody;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.ElementKind;
import javax.lang.model.element.TypeElement;
import javax.tools.Diagnostic;
import java.util.Set;


@SupportedAnnotationTypes( {"cn.ybits.server.annotation.ResponseBody"})
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class CCSResponseBodyAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // ResponseBody
        Messager messager = processingEnv.getMessager();
        for (Element element : roundEnv.getElementsAnnotatedWith(ResponseBody.class)) {
            if (element.getKind() == ElementKind.METHOD) {
                System.out.println("getQualifiedName--" + ((TypeElement)element.getEnclosingElement()).getQualifiedName());
                System.out.println("Kind is: " + element.getKind().toString());
                System.out.println("METHOD:process Invoking.");
                messager.printMessage(Diagnostic.Kind.NOTE, "printMessage:" + element.toString());
            }
        }
        return false;
    }
}
