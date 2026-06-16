import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { compromissoService, contatoService } from '../services/api';

function CompromissoForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined = modo criar; número = modo editar

  const [compromisso, setCompromisso] = useState({
    titulo: '',
    data: '',
    hora: '',
    descricao: '',
    contato: null
  });
  const [contatos, setContatos] = useState([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // Sempre carrega a lista de contatos para o <select>
    contatoService.listar()
      .then(res => setContatos(res.data))
      .catch(() => setErro('Não foi possível carregar os contatos.'));

    // Se tiver id na URL, busca os dados do compromisso para edição
    if (id) {
      compromissoService.buscar(id)
        .then(res => setCompromisso(res.data))
        .catch(() => setErro('Compromisso não encontrado.'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      if (id) {
        await compromissoService.atualizar(id, compromisso);
      } else {
        await compromissoService.criar(compromisso);
      }
      navigate('/compromissos'); // redireciona para lista após salvar
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar compromisso.';
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  };

  const handleContatoChange = (e) => {
    const valor = e.target.value;
    // Se selecionou "nenhum", define como null; senão cria objeto com id
    setCompromisso({ ...compromisso, contato: valor ? { id: parseInt(valor) } : null });
  };

  return (
    <div>
      <h2>{id ? 'Editar Compromisso' : 'Novo Compromisso'}</h2>

      <form onSubmit={handleSubmit} className="form">

        {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            value={compromisso.titulo}
            required
            maxLength={200}
            placeholder="Ex: Reunião com cliente"
            onChange={e => setCompromisso({ ...compromisso, titulo: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Data *</label>
          <input
            type="date"
            value={compromisso.data}
            required
            onChange={e => setCompromisso({ ...compromisso, data: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Hora</label>
          <input
            type="time"
            value={compromisso.hora || ''}
            onChange={e => setCompromisso({ ...compromisso, hora: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            value={compromisso.descricao || ''}
            rows={3}
            placeholder="Detalhes do compromisso..."
            onChange={e => setCompromisso({ ...compromisso, descricao: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Contato vinculado</label>
          <select
            value={compromisso.contato?.id || ''}
            onChange={handleContatoChange}
          >
            <option value="">— Nenhum contato —</option>
            {contatos.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/compromissos')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompromissoForm;
