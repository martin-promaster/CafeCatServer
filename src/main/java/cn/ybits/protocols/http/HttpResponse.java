package cn.ybits.protocols.http;

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

    public byte[] getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(byte[] messageBody) {
        this.messageBody = messageBody;
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
            setContentLength(getMessageBody().length);
            setStatusCode(statusCode);

            String responseHeader = "HTTP/1.1 "+ getStatusCode() +" OK\r\n" +
                    "Server: Cafe Cat Server 0.9\r\n" +
                    "Content-Type: "+ getContentType() +"\r\n" +
                    "Content-Length: "+ getContentLength() +"\r\n\r\n";

            out.write(responseHeader.getBytes("UTF-8"));

            out.write(getMessageBody());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public byte[] getResponseMessage() {
        return out.toByteArray();
    }

}
