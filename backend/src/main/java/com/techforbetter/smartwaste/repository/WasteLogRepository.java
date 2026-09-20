package com.techforbetter.smartwaste.repository;
import com.techforbetter.smartwaste.entity.WasteLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WasteLogRepository extends JpaRepository<WasteLog, Long> {
    List<WasteLog> findByUser_IdOrderByLogDateDesc(Long userId);

    @Query("SELECT w.cityZone, SUM(w.quantityKg) FROM WasteLog w GROUP BY w.cityZone")
    List<Object[]> getTotalWasteByCityZone();

    @Query("SELECT w.wasteType, SUM(w.quantityKg) FROM WasteLog w GROUP BY w.wasteType")
    List<Object[]> getTotalWasteByType();
    
    @Query("SELECT w.user.name, w.user.userType, w.cityZone, SUM(w.quantityKg) FROM WasteLog w GROUP BY w.user.id, w.user.name, w.user.userType, w.cityZone ORDER BY SUM(w.quantityKg) ASC")
    List<Object[]> getLeaderboard();
}