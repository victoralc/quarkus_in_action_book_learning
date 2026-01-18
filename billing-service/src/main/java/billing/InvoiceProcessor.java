package billing;

import billing.data.ReservationInvoice;
import io.quarkus.logging.Log;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import billing.model.Invoice;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;
import org.eclipse.microprofile.reactive.messaging.Outgoing;

@ApplicationScoped
public class InvoiceProcessor {

    @Incoming("invoices")
    @Outgoing("invoices-requests")
    public Message<Invoice> processInvoice(Message<JsonObject> message) {
        ReservationInvoice invoiceMessage = message
                .getPayload().mapTo(ReservationInvoice.class);
        Invoice.Reservation reservation = invoiceMessage.reservation;
        Invoice invoice = new Invoice(invoiceMessage.price, false, reservation);
        invoice.persist();
        Log.info("Processing invoice: " + invoice);
        return message.withPayload(invoice);
    }
}
