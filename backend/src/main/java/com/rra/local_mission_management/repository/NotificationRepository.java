package com.rra.local_mission_management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rra.local_mission_management.entity.Notification;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.employee.employeeId = :employeeId AND (n.isRead = :isRead OR n.date >= :date) ORDER BY n.id DESC")
    List<Notification> findAllByEmployee_EmployeeIdAndIsReadOrDateAfterOrderByIdDesc(
            @Param("employeeId") String employeeId, 
            @Param("isRead") Boolean isRead, 
            @Param("date") LocalDateTime date);

    // Custom query to update isRead status to true for all notifications of an employee
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.employee.employeeId = :employeeId")
    void markAllAsReadForEmployee(String employeeId);

}