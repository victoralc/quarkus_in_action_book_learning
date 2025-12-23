package reservation;

import io.quarkus.logging.Log;
import io.smallrye.graphql.client.GraphQLClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.reactive.RestQuery;
import reservation.inventory.GraphQLInventoryClient;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("reservation")
@Produces(MediaType.APPLICATION_JSON)
public class ReservationResource {
    private final ReservationRepository reservationRepository;
    private final InventoryClient inventoryCLient;
    private final RentalClient rentalClient;

    @Inject
    SecurityContext context;

    public ReservationResource(
            ReservationRepository reservationRepository,
            @GraphQLClient("inventory") GraphQLInventoryClient inventoryClient,
            @RestClient RentalClient rentalClient) {
        this.reservationRepository = reservationRepository;
        this.inventoryCLient = inventoryClient;
        this.rentalClient = rentalClient;
    }

    @GET
    @Path("availability")
    public Collection<Car> availability(@RestQuery LocalDate startDate, @RestQuery LocalDate endDate) {
        List<Car> availableCars = inventoryCLient.allCars();
        Map<Long, Car> carsById = new HashMap<>();
        for (Car car : availableCars) {
            carsById.put(car.id(), car);
        }

        //get all current reservations
        List<Reservation> reservations = reservationRepository.findAll();
        for (Reservation reservation : reservations) {
            if (reservation.isReserved(startDate, endDate)) {
                carsById.remove(reservation.carId);
            }
        }
        return carsById.values();
    }

    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public Reservation make(Reservation reservation) {
        reservation.userId = context.getUserPrincipal() != null ? context.getUserPrincipal().getName() : "anonymous";
        Reservation result = reservationRepository.save(reservation);
        if (reservation.startDay.equals(LocalDate.now())) {
            Rental rental = rentalClient.start(reservation.userId, result.id);
            Log.info("Successfully started rental " + rental);
        }
        return result;
    }

    @GET
    @Path("all")
    public Collection<Reservation> allReservations() {
        String userId = context.getUserPrincipal() != null ? context.getUserPrincipal().getName() : null;
        return reservationRepository.findAll()
                .stream()
                .filter(reservation -> userId == null || userId.equals(reservation.userId))
                .toList();
    }
}
