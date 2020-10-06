package cn.ybits.server;

public abstract class ActionBase {

    public String formatJSON(String s) {

        return s.replace("\\", "\\\\").replace("\r", "\\r")
                .replace("\n","\\n");
    }
}
