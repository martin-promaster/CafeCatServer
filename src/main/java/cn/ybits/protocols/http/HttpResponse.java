package cn.ybits.protocols.http;

import com.sun.istack.internal.NotNull;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class HttpResponse {

    private String contentType;
    private int contentLength;
    private String statusCode;
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    private byte[] messageBody;

    public String getStatusCode() {
        return statusCode;
    }
    public void setStatusCode(int statusCode) {
        this.statusCode = String.valueOf(statusCode);
    }

    public String getContentType() {
        return contentType;
    }
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public int getContentLength() {
        return contentLength;
    }
    public void setContentLength(int contentLength) {
        this.contentLength = contentLength;
    }

    public byte[] getPayload() {
        return messageBody;
    }
    public void setPayload(@NotNull byte[] b) {
        this.messageBody = b;
    }

    // Return byte array of response message.
    public void setSuccessMessage() {
        setResponseMessage(200);
    }
    public void setFileNotFoundMessage() {
        setResponseMessage(404);
    }

    public void setResponseMessage(int statusCode) {
        try {
            setContentLength(getPayload().length);
            setStatusCode(statusCode);

            String responseHeader = "HTTP/1.1 "+ getStatusCode() +" OK\r\n" +
                    "Server: Cafe Cat Server 0.9\r\n" +
                    "Content-Type: "+ getContentType() +"\r\n" +
                    "Content-Length: "+ getContentLength() +"\r\n\r\n";

            out.write(responseHeader.getBytes("UTF-8"));
            out.write(getPayload());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public byte[] getResponseMessage() {
        return out.toByteArray();
    }

}
