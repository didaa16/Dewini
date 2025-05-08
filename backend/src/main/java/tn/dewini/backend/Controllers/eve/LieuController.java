package tn.dewini.backend.Controllers.eve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.dewini.backend.Repositories.eve.LieuRepository;
import tn.dewini.backend.Entities.eve.Lieu;

import java.util.List;

@RestController
@RequestMapping("/api/lieux")
public class LieuController {

    @Autowired
    private LieuRepository lieuRepository;

    @GetMapping
    public List<Lieu> getAllLieux() {
        return lieuRepository.findAll();
    }
}
