import axios from 'axios';

function resolveApiUrl() {
  const raw = process.env.REACT_APP_API_URL;
  if (!raw) return 'http://localhost:8080/api';
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, '');
  if (!/\/api$/i.test(url)) url = `${url}/api`;
  return url;
}

const api = axios.create({
  baseURL: resolveApiUrl(),
  headers: { 'Content-Type': 'application/json' }
});

// ========== CONTATOS ==========
export const contatoService = {
  listar: () => api.get('/contatos'),
  buscar: (id) => api.get(`/contatos/${id}`),
  criar: (contato) => api.post('/contatos', contato),
  atualizar: (id, contato) => api.put(`/contatos/${id}`, contato),
  deletar: (id) => api.delete(`/contatos/${id}`)
};

// ========== COMPROMISSOS ==========
export const compromissoService = {
  listar: () => api.get('/compromissos'),
  buscar: (id) => api.get(`/compromissos/${id}`),
  criar: (compromisso) => api.post('/compromissos', compromisso),
  atualizar: (id, compromisso) => api.put(`/compromissos/${id}`, compromisso),
  deletar: (id) => api.delete(`/compromissos/${id}`)
};

export default api;
