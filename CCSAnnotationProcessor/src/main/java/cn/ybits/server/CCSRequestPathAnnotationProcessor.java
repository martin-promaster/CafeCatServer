package cn.ybits.server;

import cn.ybits.server.annotation.RequestPath;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.*;
import javax.lang.model.util.Elements;
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
        System.out.println("----------------------------------------");
        System.out.println("Step1: Begin to scan annotation class...");
        boolean isMatch = false;
        Elements elements = processingEnv.getElementUtils();
        StringBuilder sb = new StringBuilder();
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
                String newClassName = typeElement.getSimpleName().toString();
                PackageElement packageElement = elements.getPackageOf(typeElement);
                String packageName = packageElement.getQualifiedName().toString();

                RequestPath requestPath = element.getAnnotation(RequestPath.class);
                String pathValue = requestPath.path();
                //String className = responseBody.className();

                sb.append("        map.put(\""+ pathValue +"\", \""+ fullClassName +"\");\n");

                System.out.printf("\tAnnotated:\n\t-- packageName is   [%s],\n\t-- newClassName is  [%s],\n\t-- fullClassName is [%s],\n",
                        packageName, newClassName, fullClassName);
                System.out.printf("\tInjected:\n\t-- path is      [%s],\n\t-- className is [%s].\n",
                        pathValue, fullClassName);
                // System.out.println("\tKind is: " + element.getKind().toString());
                // messager.printMessage(Diagnostic.Kind.NOTE, "printMessage:" + element.toString());
            }
        }

        if (isMatch) {
            System.out.println("Step2: Begin to create Java class file ...");
            try {
                JavaFileObject fileObject = processingEnv.getFiler().createSourceFile("CCSRequestMapping", baseElement);
                Writer writer = fileObject.openWriter();
                writer.write("package cn.ybits.server.dispatcher;\n");
                writer.write("import java.util.HashMap;\n");
                writer.write("import java.util.Map;\n");
                writer.write("public class CCSRequestMapping" + " {\n");
                writer.write("    public static Map<String, String> map = new HashMap<String, String>();\n");
                writer.write("    public CCSRequestMapping() {\n");
                writer.write(sb.toString());
                writer.write("    }\n");
                writer.write("}\n");
                writer.flush();
                writer.close();
                System.out.println("Java class file successfully created ...");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            System.out.println("No matched class, skip ...");
        }

        return false;
    }
}
