package grpc;

import io.quarkus.grpc.GrpcService;
import io.quarkus.logging.Log;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import model.Car;
import org.acme.inventory.model.CarResponse;
import org.acme.inventory.model.InsertCarRequest;
import org.acme.inventory.model.InventoryService;
import org.acme.inventory.model.RemoveCarRequest;
import repository.CarRepository;

import java.util.Optional;

@GrpcService
public class GrpcInventoryService implements InventoryService {

    @Inject
    CarRepository inventory;

    @Override
    @Blocking
    public Uni<CarResponse> add(InsertCarRequest request) {
        Car car = new Car();
        car.setLicensePlateNumber(request.getLicensePlateNumber());
        car.setManufacturer(request.getManufacturer());
        car.setModel(request.getModel());

        Log.info("Persisting " + car);

        return Uni.createFrom().item(CarResponse.newBuilder()
                .setLicensePlateNumber(car.getLicensePlateNumber())
                .setManufacturer(car.getManufacturer())
                .setModel(car.getModel())
                .setId(car.getId())
                .build());
    }

    @Override
    @Blocking
    @Transactional
    public Uni<CarResponse> remove(RemoveCarRequest request) {
        Optional<Car> optionalCar = inventory.streamAll()
                .filter(car -> request.getLicensePlateNumber()
                        .equals(car.getLicensePlateNumber()))
                .findFirst();

        if (optionalCar.isPresent()) {
            Car removedCar = optionalCar.get();
            inventory.delete(removedCar);
            return Uni.createFrom().item(CarResponse.newBuilder()
                    .setLicensePlateNumber(removedCar.getLicensePlateNumber())
                    .setManufacturer(removedCar.getManufacturer())
                    .setModel(removedCar.getModel())
                    .setId(removedCar.getId())
                    .build());
        }

        return Uni.createFrom().nullItem();
    }
}
