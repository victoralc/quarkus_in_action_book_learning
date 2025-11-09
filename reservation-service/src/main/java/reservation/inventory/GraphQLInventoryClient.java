package reservation.inventory;

import io.smallrye.graphql.client.typesafe.api.GraphQLClientApi;
import org.eclipse.microprofile.graphql.Query;
import reservation.Car;
import reservation.InventoryClient;

import java.util.List;

@GraphQLClientApi(configKey = "inventory")
public interface GraphQLInventoryClient extends InventoryClient {
    @Query("cars")
    List<Car> allCars();
}