package code;

import jakarta.inject.Inject;
import jakarta.inject.Named;
import jakarta.inject.Singleton;
import jakarta.ws.rs.core.SecurityContext;

@Singleton
@Named
public class CurrentUser {
    @Inject
    SecurityContext securityContext;

    public String getUsername() {
        return securityContext.getUserPrincipal().getName();
    }
}
