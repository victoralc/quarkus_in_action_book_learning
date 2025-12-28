package rental;

import io.quarkus.logging.Log;
import jakarta.ws.rs.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Path("/rental")
public class RentalResource {
    @POST
    @Path("/start/{userId}/{reservationId}")
    public Rental start(String userId, Long reservationId) {
        Log.infof("Starting rental for %s with reservation %s", userId, reservationId);
        var rental = new Rental(userId, reservationId, LocalDate.now(), null, true);
        rental.persist();
        return rental;
    }

    @PUT
    @Path("/end/{userId}/{reservationId}")
    public Rental end(String userId, Long reservationId) {
        Log.infof("Ending rental for %s with reservation %s",
                userId, reservationId);
        Optional<Rental> optionalRental = Rental
                .findByUserAndReservationOptional(userId, reservationId);
        if (optionalRental.isPresent()) {
            Rental rental = optionalRental.get();
            rental.endDate = LocalDate.now();
            rental.active = false;
            rental.update();
            return rental;
        } else {
            throw new NotFoundException("Rental not found");
        }
    }

    @GET
    public List<Rental> list() {
        return Rental.listAll();
    }

    @GET
    @Path("/active")
    public List<Rental> listActive() {
        return Rental.listActive();
    }
}
