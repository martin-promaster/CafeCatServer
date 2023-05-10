package cn.ybits.server;

public abstract class CCSDefaultAction {

    public String formatJSON(String s) {
        return s.replace("\\", "\\\\").replace("\r", "\\r")
                .replace("\n","\\n");
    }
}
