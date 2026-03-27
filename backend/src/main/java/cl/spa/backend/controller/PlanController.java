
package cl.spa.backend.controller;

import cl.spa.backend.model.Plan;
import cl.spa.backend.repository.PlanRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author gubi
 */

@RestController
@RequestMapping("/api/planes")
@CrossOrigin("*")
public class PlanController {
    
    private final PlanRepository repository;

    public PlanController(PlanRepository repository) {
        this.repository = repository;
    }
    
    @GetMapping
    public List<Plan> gtPlanes(){
        return repository.findAll();
    }
    
    
}
