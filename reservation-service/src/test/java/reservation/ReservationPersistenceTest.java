package reservation;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

@QuarkusTest
@TestTransaction
class ReservationPersistenceTest {

    @Test
    void testCreateReservation() {
        Reservation reservation = new Reservation();
        reservation.startDay = LocalDate.now().plusDays(5);
        reservation.endDay = LocalDate.now().plusDays(12);
        reservation.carId = 384L;
        reservation.persist();

        Assertions.assertNotNull(reservation.id);
        Assertions.assertTrue(Reservation.listAll().contains(reservation));
    }
}