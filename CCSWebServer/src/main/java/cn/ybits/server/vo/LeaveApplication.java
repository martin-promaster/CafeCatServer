package cn.ybits.server.vo;

import lombok.Data;

import java.util.Date;

@Data
public class LeaveApplication {
    String id;
    String name;
    String leaveType;
    Date leaveDate;
    String status;
}
