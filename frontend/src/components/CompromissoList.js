import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { compromissoService } from '../services/api';

function CompromissoList() {
  const [compromissos, setCompromissos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Carrega a lista ao abrir a tela
  useEffect(() => {
    carregarCompromissos();
  }, []);

  const carregarCompromissos = async () => {
    try {
      setLoading(true);
      const response = await compromissoService.listar();
      setCompromissos(response.data);
    } catch (error) {
      setErro('Erro ao carregar compromissos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const deletarCompromisso = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este compromisso?')) return;
    try {
      await compromissoService.deletar(id);
      carregarCompromissos(); // recarrega a lista após deletar
    } catch (error) {
      setErro('Erro ao excluir compromisso.');
    }
  };

  // Formata "2024-12-20" → "20/12/2024"
  const formatarData = (data) => {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <div className="header">
        <h2>📅 Compromissos</h2>
        <Link to="/compromissos/novo" className="btn btn-primary">+ Novo Compromisso</Link>
      </div>

      {erro && <p style={{ color: 'red', marginBottom: 12 }}>{erro}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Contato</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {compromissos.map(comp => (
            <tr key={comp.id}>
              <td>{comp.titulo}</td>
              <td>{formatarData(comp.data)}</td>
              <td>{comp.hora ? comp.hora.substring(0, 5) : '-'}</td>
              <td>{comp.contato?.nome || '-'}</td>
              <td>
                <Link to={`/compromissos/editar/${comp.id}`} className="btn btn-sm">
                  Editar
                </Link>
                <button
                  onClick={() => deletarCompromisso(comp.id)}
                  className="btn btn-danger btn-sm"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {compromissos.length === 0 && !erro && (
        <p className="empty">Nenhum compromisso cadastrado ainda.</p>
      )}
    </div>
  );
}

export default CompromissoList;
