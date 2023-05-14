package cn.ybits.busi.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class LeaveApplication {
    String id;
    String name;
    String leaveType;
    Timestamp leaveDate;
    String status;
}
