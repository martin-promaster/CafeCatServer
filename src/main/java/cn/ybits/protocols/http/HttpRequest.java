package cn.ybits.protocols.http;

import cn.ybits.server.CCSConstant;

public class HttpRequest {

    private String method;
    private String path;
    private String httpVersion;

    private String parameters;

    private int contentLength;
    private String contentType;

    private byte[] requestBody;


    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        int index = path.indexOf("?");
        if (index>-1) {
            this.path = path.substring(0, index);
            this.parameters = path.substring(index+1);
        } else {
            this.path = path;
            this.parameters = "";
        }
    }

    public String getHttpVersion() {
        return httpVersion;
    }

    public void setHttpVersion(String httpVersion) {
        this.httpVersion = httpVersion;
    }

    public int getContentLength() {
        return contentLength;
    }

    public void setContentLength(int contentLength) {
        this.contentLength = contentLength;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public byte[] getRequestBody() {
        return requestBody;
    }

    public void setRequestBody(byte[] requestBody) {
        this.requestBody = requestBody;
    }

    public String toString() {

        return CCSConstant.CRLF
                + "Method: "+ getMethod() + CCSConstant.CRLF
                + "Path: " + getPath() + CCSConstant.CRLF
                + "Parameters: "+ getParameters() + CCSConstant.CRLF
                + "Version: " + getHttpVersion() + CCSConstant.CRLF;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }
}
