package com.agenda.controller;

import com.agenda.model.Compromisso;
import com.agenda.repository.CompromissoRepository;
import com.agenda.repository.ContatoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/compromissos")
@CrossOrigin(origins = "*")
public class CompromissoController {

    private final CompromissoRepository repository;
    private final ContatoRepository contatoRepository;

    public CompromissoController(CompromissoRepository repository,
                                 ContatoRepository contatoRepository) {
        this.repository = repository;
        this.contatoRepository = contatoRepository;
    }

    // CREATE - Criar novo compromisso
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Compromisso compromisso) {
        if (!resolverContato(compromisso)) {
            return ResponseEntity.notFound().build();
        }
        Compromisso salvo = repository.save(compromisso);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // READ - Listar todos os compromissos ordenados por data e hora
    @GetMapping
    public ResponseEntity<List<Compromisso>> listar() {
        List<Compromisso> compromissos = repository.findAllByOrderByDataAscHoraAsc();
        return ResponseEntity.ok(compromissos);
    }

    // READ - Buscar compromisso por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // UPDATE - Atualizar compromisso existente
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Compromisso dados) {
        Optional<Compromisso> existente = repository.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!resolverContato(dados)) {
            return ResponseEntity.notFound().build();
        }

        Compromisso comp = existente.get();
        comp.setTitulo(dados.getTitulo());
        comp.setData(dados.getData());
        comp.setHora(dados.getHora());
        comp.setDescricao(dados.getDescricao());
        comp.setContato(dados.getContato());
        return ResponseEntity.ok(repository.save(comp));
    }

    // DELETE - Remover compromisso
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(comp -> {
                    repository.delete(comp);
                    return ResponseEntity.ok(Map.of("mensagem", "Compromisso removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Resolve o contato vinculado: valida se existe no banco antes de salvar
    private boolean resolverContato(Compromisso compromisso) {
        if (compromisso.getContato() == null) {
            return true; // sem vínculo é permitido
        }
        Long contatoId = compromisso.getContato().getId();
        if (contatoId == null) {
            compromisso.setContato(null);
            return true;
        }
        Optional<com.agenda.model.Contato> contato = contatoRepository.findById(contatoId);
        contato.ifPresent(compromisso::setContato);
        return contato.isPresent();
    }
}
