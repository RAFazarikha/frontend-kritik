import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import NoteFormModal from './components/NoteFormModal';
import StickyNote from './components/StickyNote';
import AdminPage from './components/AdminPage';

const API = 'http://localhost:5000/api';

export default function App() {
  const [view, setView] = useState('viewer');
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');

  const loginAdmin = () => {
    if (token.trim()) {
      sessionStorage.setItem('adminToken', token.trim());
      setView('admin');
    } else {
      setLoginError('Isi token dulu.');
    }
  };

  if (view === 'admin') {
    return (
      <AdminPage
        onLogout={() => {
          setView('viewer');
          sessionStorage.removeItem('adminToken');
        }}
      />
    );
  }

  return <Viewer setView={setView} token={token} setToken={setToken} loginAdmin={loginAdmin} loginError={loginError} />;
}

function Viewer({ setView, token, setToken, loginAdmin, loginError }) {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    axios.get(`${API}/notes`).then((res) => setNotes(res.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-amber-900">📋 Papan Kritik & Saran</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold shadow-lg transition"
          >
            + Tulis Catatan
          </button>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="px-4 py-2.5 text-amber-900/60 hover:text-amber-900 text-sm underline"
          >
            Admin
          </button>
        </div>
      </header>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowLogin(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-3">
            <h2 className="text-lg font-bold text-gray-800">Login Admin</h2>
            <input
              type="password"
              placeholder="Admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            <button onClick={loginAdmin} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold">
              Masuk
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <StickyNote note={note} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <p className="text-center text-amber-700/60 mt-20 text-lg">Belum ada catatan. Jadi yang pertama! ✨</p>
      )}

      <NoteFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSaved={(note) => setNotes((n) => [note, ...n])} />
    </div>
  );
}