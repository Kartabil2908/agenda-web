package com.agenda.repository;

import com.agenda.model.Compromisso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CompromissoRepository extends JpaRepository<Compromisso, Long> {

    // Retorna todos ordenados por data e depois por hora (mais cedo primeiro)
    List<Compromisso> findAllByOrderByDataAscHoraAsc();

    // Busca compromissos de uma data específica
    List<Compromisso> findByDataOrderByHoraAsc(LocalDate data);

    // Busca todos os compromissos vinculados a um contato
    List<Compromisso> findByContatoId(Long contatoId);
}
