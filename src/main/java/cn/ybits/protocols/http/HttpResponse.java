package cn.ybits.protocols.http;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class HttpResponse {

    private String contentType;
    private int contentLength;
    private String statusCode;

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
    public byte[] getSuccessMessage() {
        return getResponseMessage(200);
    }

    public byte[] getFileNotFoundMessage() {
        return getResponseMessage(404);
    }

    public byte[] getResponseMessage(int statusCode) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

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

        return out.toByteArray();
    }

}
