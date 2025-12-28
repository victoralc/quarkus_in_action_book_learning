package reservation;

import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.quarkus.logging.Log;
import io.smallrye.graphql.client.GraphQLClient;
import io.smallrye.mutiny.Uni;
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
    private final InventoryClient inventoryClient;
    private final RentalClient rentalClient;

    @Inject
    SecurityContext context;

    public ReservationResource(
            @GraphQLClient("inventory") GraphQLInventoryClient inventoryClient,
            @RestClient RentalClient rentalClient) {
        this.inventoryClient = inventoryClient;
        this.rentalClient = rentalClient;
    }

    @GET
    @Path("availability")
    public Uni<Collection<Car>> availability(@RestQuery LocalDate startDate, @RestQuery LocalDate endDate) {
        // obtain all cars from inventory
        Uni<List<Car>> availableCarsUni = inventoryClient.allCars();
        // get all current reservations
        Uni<List<Reservation>> reservationsUni = Reservation.listAll();

        return Uni.combine().all().unis(availableCarsUni, reservationsUni)
                .with((availableCars, reservations) -> {
                    // create a map from id to car
                    Map<Long, Car> carsById = new HashMap<>();
                    for (Car car : availableCars) {
                        carsById.put(car.id(), car);
                    }
                    // for each reservation, remove the car from the map
                    for (Reservation reservation : reservations) {
                        if (reservation.isReserved(startDate, endDate)) {
                            carsById.remove(reservation.carId);
                        }
                    }
                    return carsById.values();
                });
    }

    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    @WithTransaction
    public Uni<Reservation> make(Reservation reservation) {
        reservation.userId = context.getUserPrincipal() != null ? context.getUserPrincipal().getName() : "anonymous";
        return reservation.<Reservation>persist()
                .onItem()
                .call(persistedReservation -> {
                    Log.info("Successfully reserved reservation " + persistedReservation);
                    if (persistedReservation.startDay.equals(LocalDate.now())) {
                        return rentalClient.start(persistedReservation.userId, persistedReservation.id)
                                .onItem().invoke(rental -> Log.info("Successfully started rental " + rental))
                                .replaceWith(persistedReservation);
                    }
                    return Uni.createFrom().item(persistedReservation);
                });
    }

    @GET
    @Path("all")
    public Uni<List<Reservation>> allReservations() {
        String userId = context.getUserPrincipal() != null ? context.getUserPrincipal().getName() : null;
        return Reservation.<Reservation>listAll()
                .onItem()
                .transform(reservations -> reservations.stream()
                        .filter(reservation -> userId == null || userId.equals(reservation.userId))
                        .toList());
    }
}
