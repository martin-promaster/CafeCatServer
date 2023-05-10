package cn.ybits.protocols.http;

public enum Status {
    OK(200, "200 OK\r\n"),
    NOT_FOUND(404, "404 Not Found\r\n"),
    INTERNAL_SERVER_ERROR(500, "500 Internal Server Error\r\n");

    private static final Status[] VALUES = values();
    private final Integer id;
    private final String value;


    Status(Integer id, String value) {
        this.id = id;
        this.value = value;
    }

    public String status() {
        return this.value;
    }
    public Integer id() {
        return this.id;
    }

    public static Status valueOf(int statusCode) {
        Status status = resolve(statusCode);
        if (status == null) {
            // throw new IllegalArgumentException("No matching constant for [" + statusCode + "]");
            return Status.INTERNAL_SERVER_ERROR;
        } else {
            return status;
        }
    }

    public static Status resolve(int statusCode) {
        for (Status status : VALUES) {
            if (status.id == statusCode) {
                return status;
            }
        }
        return null;
    }
}
