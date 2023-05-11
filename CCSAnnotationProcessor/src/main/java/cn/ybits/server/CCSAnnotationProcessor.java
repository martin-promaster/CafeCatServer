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
public class CCSAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // ResponseBody
        Messager messager = processingEnv.getMessager();
        for (TypeElement typeElement : annotations) {
            System.out.println("getQualifiedName--" + typeElement.getQualifiedName());
            System.out.println("Kind is: " + typeElement.getKind().toString());
            if (typeElement.getKind() == ElementKind.ANNOTATION_TYPE) {
                System.out.println("METHOD:Annotation Invoking.");
                messager.printMessage(Diagnostic.Kind.NOTE, "printMessage:" + typeElement.toString());
            }
        }
        return false;
    }
}
