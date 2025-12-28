package rental;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@MongoEntity(collection = "Rentals")
public class Rental extends PanacheMongoEntity {
    public String userId;
    public Long reservationId;
    public LocalDate startDate;
    public LocalDate endDate;
    public boolean active;

    public Rental() {}

    public Rental(String userId,
                  Long reservationId,
                  LocalDate startDate,
                  LocalDate endDate,
                  boolean active) {
        this.userId = userId;
        this.reservationId = reservationId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    public static Optional<Rental> findByUserAndReservationOptional(String userId, Long reservationId) {
        return find("userId = ?1 and reservationId = ?2", userId, reservationId)
                .firstResultOptional();
    }
    public static List<Rental> listActive() {
        return list("active", true);
    }

    @Override
    public String toString() {
        return "Rental{" +
                "id=" + id +
                ", active=" + active +
                ", endDate=" + endDate +
                ", startDate=" + startDate +
                ", reservationId=" + reservationId +
                ", userId='" + userId + '\'' +
                '}';
    }
}
