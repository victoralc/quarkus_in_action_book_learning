package service;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import model.Car;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import repository.CarRepository;

import java.util.List;
import java.util.Optional;

@GraphQLApi
public class GraphQLInventoryService {
    @Inject
    CarRepository inventory;

    @Query
    public List<Car> cars() {
        return inventory.listAll();
    }

    @Mutation
    @Transactional
    public Car register(Car car) {
        inventory.persist(car);
        Log.info("Car persisted: " + car);
        return car;
    }

    @Mutation
    @Transactional
    public boolean remove(String licensePlateNumber) {
        Optional<Car> toBeRemoved = inventory
                .findByLicensePlateNumberOptional(licensePlateNumber);
        if (toBeRemoved.isPresent()) {
            inventory.delete(toBeRemoved.get());
            return true;
        } else {
            return false;
        }
    }
}