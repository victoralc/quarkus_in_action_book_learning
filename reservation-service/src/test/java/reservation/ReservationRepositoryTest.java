package reservation;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ReservationRepositoryTest {

    @Inject ReservationRepository repository;

    @Test
    void testCreateReservation() {
        Reservation reservation = new Reservation();
        reservation.startDay = LocalDate.now().plusDays(5);
        reservation.endDay = LocalDate.now().plusDays(12);
        reservation.carId = 384L;
        repository.save(reservation);

        Assertions.assertNotNull(reservation.id);
        Assertions.assertTrue(repository.findAll().contains(reservation));
    }
}