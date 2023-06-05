package cn.ybits.server;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.TypeElement;
import javax.lang.model.util.Elements;
import java.util.Set;

@SupportedAnnotationTypes({"cn.ybits.server.annotation.ResponseBody"})
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class CCSResponseBodyAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        System.out.println("-------------------ResponseBody---------------------");
        System.out.println("Step 0: Checking TypeElement");
        for (TypeElement typeElement : annotations) {
            System.out.println("QualifiedName: "+typeElement.getQualifiedName());
        }
        boolean isMatch = false;
        Elements elements = processingEnv.getElementUtils();
        return false;
    }
}
