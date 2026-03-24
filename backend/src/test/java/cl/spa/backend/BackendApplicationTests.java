package cl.spa.backend;

import cl.spa.backend.controller.PlanController;
import cl.spa.backend.model.Plan;
import cl.spa.backend.repository.PlanRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlanController.class)
class PlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlanRepository planRepository;

    @Test
    void getPlanes_retornaListaDeplanesEnJSON() throws Exception {
        Plan plan = new Plan("Relajación Total", "Masajes y aromaterapia", 49990.0);
        when(planRepository.findAll()).thenReturn(List.of(plan));

        mockMvc.perform(get("/api/planes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$[0].nombre").value("Relajación Total"))
                .andExpect(jsonPath("$[0].descripcion").value("Masajes y aromaterapia"))
                .andExpect(jsonPath("$[0].precio").value(49990.0));
    }
}
