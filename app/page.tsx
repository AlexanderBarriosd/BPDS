'use client';

import { useState, KeyboardEvent } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface DeletedTodo extends Todo {
  deletedAt: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletedTodos, setDeletedTodos] = useState<DeletedTodo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showTrash, setShowTrash] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id: number) => {
    if (editingText.trim() === '') {
      deleteTodo(id);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editingText.trim() } : todo
        )
      );
    }
    setEditingId(null);
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (todoToDelete) {
      setDeletedTodos([
        ...deletedTodos,
        { ...todoToDelete, deletedAt: Date.now() },
      ]);
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const restoreTodo = (id: number) => {
    const todoToRestore = deletedTodos.find((todo) => todo.id === id);
    if (todoToRestore) {
      const { deletedAt, ...restoredTodo } = todoToRestore;
      setTodos([...todos, restoredTodo]);
      setDeletedTodos(deletedTodos.filter((todo) => todo.id !== id));
    }
  };

  const permanentlyDeleteTodo = (id: number) => {
    setDeletedTodos(deletedTodos.filter((todo) => todo.id !== id));
  };

  const emptyTrash = () => {
    if (confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      setDeletedTodos([]);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200 dark:border-slate-700">
        
        {!showTrash ? (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Mi lista de tareas
              </h1>
              <button
                onClick={() => setShowTrash(true)}
                className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-semibold"
              >
                🗑️ {deletedTodos.length}
              </button>
            </div>

            {/* INPUT */}
            <input
              type="text"
              className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 mb-6"
              placeholder="+ Escribe lo que debes hacer hoy y marca cada tarea cuando la completes."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* CONTADOR DE TAREAS */}
            <div className="text-gray-600 dark:text-gray-400 font-semibold mb-4">
              {todos.length} tareas
            </div>

            {/* LISTA DE TAREAS */}
            <ul className="space-y-3 mb-6">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* CHECKBOX */}
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="w-5 h-5 cursor-pointer accent-indigo-600"
                    />

                    {/* TEXTO EDITABLE */}
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        className="flex-1 border-2 border-indigo-500 rounded px-2 py-1 text-gray-800 dark:text-white bg-white dark:bg-slate-600 focus:outline-none"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => startEditing(todo)}
                        className={`cursor-pointer flex-1 text-gray-800 dark:text-gray-100 transition-all ${
                          todo.completed 
                            ? 'line-through text-gray-400 dark:text-gray-500' 
                            : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* BOTÓN ELIMINAR */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-3 py-1 rounded-lg transition-colors font-semibold ml-3"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            {todos.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                No hay tareas pendientes
              </p>
            )}

            {/* FOOTER STATS */}
            <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
              {completedCount > 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {completedCount} completadas
                </p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hola este es el total de tareas: <span className="font-bold text-gray-800 dark:text-white">{todos.length}</span>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* TRASH VIEW */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                🗑️ PAPELERA
              </h2>
              <button
                onClick={() => setShowTrash(false)}
                className="bg-indigo-600 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors font-semibold"
              >
                ← Volver
              </button>
            </div>

            <div className="text-gray-600 dark:text-gray-400 font-semibold mb-4">
              {deletedTodos.length} tareas eliminadas
            </div>

            {deletedTodos.length > 0 ? (
              <>
                <ul className="space-y-3 mb-6">
                  {deletedTodos.map((todo) => (
                    <li
                      key={todo.id}
                      className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <p className="text-gray-600 dark:text-gray-300 line-through font-medium">
                            {todo.text}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Eliminado hace {formatTimeDifference(Date.now() - todo.deletedAt)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => restoreTodo(todo.id)}
                            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 px-3 py-1 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                          >
                            ↩️ Restaurar
                          </button>
                          <button
                            onClick={() => permanentlyDeleteTodo(todo.id)}
                            className="bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-900/70 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={emptyTrash}
                  className="w-full bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white py-3 rounded-lg font-bold transition-colors"
                >
                  Vaciar papelera completamente
                </button>
              </>
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-12">
                La papelera está vacía
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function formatTimeDifference(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}