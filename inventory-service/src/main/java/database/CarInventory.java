package database;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import model.Car;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@ApplicationScoped
public class CarInventory {

    public static final AtomicLong ID_GENERATOR = new AtomicLong(0);
    private List<Car> cars;

    @PostConstruct
    public void init() {
        cars = new CopyOnWriteArrayList<>();
        initialData();
    }

    public List<Car> getCars() {
        return cars;
    }

    private void initialData() {
        Car mazda = new Car();
        mazda.id = ID_GENERATOR.incrementAndGet();
        mazda.manufacturer = "Mazda";
        mazda.model = "6";
        mazda.licensePlateNumber = "ABC123";
        cars.add(mazda);

        Car ford = new Car();
        ford.id = ID_GENERATOR.incrementAndGet();
        ford.manufacturer = "Ford";
        ford.model = "Mustang";
        ford.licensePlateNumber = "XYZ987";
        cars.add(ford);
    }

}
