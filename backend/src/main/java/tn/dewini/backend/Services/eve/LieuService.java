package tn.dewini.backend.Services.eve;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Repositories.eve.LieuRepository;
import tn.dewini.backend.Entities.eve.Lieu;

import java.util.List;

@Service
public class LieuService {

    @Autowired
    private LieuRepository lieuRepository;


    public List<Lieu> getAllLieux() {
        return lieuRepository.findAll();
    }}