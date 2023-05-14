package cn.ybits.server;

import cn.ybits.server.annotation.RequestPath;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.*;
import javax.lang.model.util.Elements;
import javax.tools.Diagnostic;
import javax.tools.JavaFileObject;
import java.io.IOException;
import java.io.Writer;
import java.util.Set;


@SupportedAnnotationTypes({"cn.ybits.server.annotation.RequestPath"})
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class CCSRequestPathAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // ResponseBody
        System.out.println("Begin to scan annotation class...");
        boolean isMatch = false;
        Elements elements = processingEnv.getElementUtils();
        Messager messager = processingEnv.getMessager();
        StringBuffer sb = new StringBuffer();
        TypeElement baseElement = null;
        for (Element element : roundEnv.getElementsAnnotatedWith(RequestPath.class)) {
            if (element.getKind() == ElementKind.METHOD) {
                isMatch = true;
                // VariableElement variableElement = (VariableElement)element;
                TypeElement typeElement = (TypeElement)element.getEnclosingElement();
                if (baseElement == null) {
                    baseElement = typeElement;
                }
                String fullClassName = typeElement.getQualifiedName().toString();
                PackageElement packageElement = elements.getPackageOf(typeElement);
                String packageName = packageElement.getQualifiedName().toString();
                String newClassName = typeElement.getSimpleName().toString();

                RequestPath requestPath = element.getAnnotation(RequestPath.class);
                String pathValue = requestPath.path();
                //String className = responseBody.className();

                sb.append("        map.put(\""+ pathValue +"\", \""+ fullClassName +"\");\n");

                System.out.printf("Annotation: \nfullClassName is [%s] \npackageName is [%s], \nnewClassName is [%s]\n",
                        fullClassName, packageName, newClassName);
                System.out.printf("Annotation value: \npath is [%s], \nclassName is [%s].\n",
                        pathValue, fullClassName);
                System.out.println("getQualifiedName -- " + ((TypeElement)element.getEnclosingElement()).getQualifiedName());
                System.out.println("Kind is: " + element.getKind().toString());
                messager.printMessage(Diagnostic.Kind.NOTE, "printMessage:" + element.toString());
            }
        }
        System.out.println("Begin to create Java class file...");
        if (isMatch) {
            try {
                JavaFileObject fileObject = processingEnv.getFiler().createSourceFile("CCSRequestMapping", baseElement);
                Writer writer = fileObject.openWriter();
                writer.write("package " + "cn.ybits.server.dispatcher;\n");
                writer.write("import java.util.HashMap;\n");
                writer.write("import java.util.Map;\n");
                writer.write("public class " + "CCSRequestMapping" + " {\n");
                writer.write("    public static Map<String, String> map = new HashMap();\n");
                writer.write("    public CCSRequestMapping() {\n");
                writer.write(sb.toString());
                writer.write("    }\n");
                writer.write("}\n");
                writer.flush();
                writer.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return false;
    }
}
