package code;

import code.model.Car;
import code.model.Reservation;
import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.RestQuery;
import org.jboss.resteasy.reactive.RestResponse;

import java.time.LocalDate;
import java.util.Collection;

@Path("/")
public class ReservationsResource {

    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance index(LocalDate startDate, LocalDate endDate, String name);
        public static native TemplateInstance reservations(Collection<Reservation> reservations);
        // Main page
        public static native TemplateInstance availability(Collection<Car> cars, LocalDate startDate, LocalDate endDate);
        // Fragment for HTMX updates (availability.html#carList)
        public static native TemplateInstance availability$carList(Collection<Car> cars, LocalDate startDate, LocalDate endDate);
    }

    @RestClient
    ReservationsClient reservationsClient;

    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("/cars/available")
    public TemplateInstance getAvailableCars(
            @RestQuery LocalDate startDate,
            @RestQuery LocalDate endDate,
            @HeaderParam("HX-Request") boolean isHtmxRequest) {

        // Default dates if null
        if (startDate == null) startDate = LocalDate.now().plusDays(1);
        if (endDate == null) endDate = LocalDate.now().plusDays(7);

        Collection<Car> availableCars = reservationsClient.availability(startDate, endDate);

        if (isHtmxRequest) {
            // Return only the HTML fragment for the list
            return Templates.availability$carList(availableCars, startDate, endDate);
        }
        // Return the full page for direct browser access
        return Templates.availability(availableCars, startDate, endDate);
    }

    @POST
    @Produces(MediaType.TEXT_HTML)
    @Path("/reserve")
    public RestResponse<TemplateInstance> create(@RestForm LocalDate startDate, @RestForm LocalDate endDate, @RestForm Long carId) {
        Reservation reservation = new Reservation();
        reservation.startDay = startDate;
        reservation.endDay = endDate;
        reservation.carId = carId;

        reservationsClient.make(reservation);

        // Return the updated reservations list and trigger a refresh of the availability list via HTMX header
        return RestResponse.ResponseBuilder
                .ok(getReservations())
                .header("HX-Trigger", "update-available-cars-list")
                .build();
    }

    @GET
    @Produces(MediaType.TEXT_HTML)
    @Path("/reservations")
    public TemplateInstance getReservations() {
        return Templates.reservations(reservationsClient.allReservations());
    }
}