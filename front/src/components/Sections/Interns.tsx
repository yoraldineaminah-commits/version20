import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { encadreurService } from '../../services/encadreurService';
import { internService } from '../../services/internService';
import { useApiError } from '../../hooks/useApiError';

interface InternFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultEncadreurId?: number | null; // Ajout de la prop
}

export default function InternFormModal({
  isOpen,
  onClose,
  onSubmit,
  defaultEncadreurId,
}: InternFormModalProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    department: '',
    school: '',
    startDate: '',
    endDate: '',
    encadreurId: defaultEncadreurId || '',
  });

  const [encadreurs, setEncadreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleApiError = useApiError();

  useEffect(() => {
    if (isOpen) {
      loadEncadreurs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultEncadreurId) {
      setFormData((prev) => ({ ...prev, encadreurId: defaultEncadreurId }));
    }
  }, [defaultEncadreurId]);

  const loadEncadreurs = async () => {
    try {
      const data = await encadreurService.getAllEncadreurs();
      setEncadreurs(data);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du chargement des encadreurs');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await internService.createIntern(formData);
      onSubmit(formData);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création du stagiaire');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Ajouter un stagiaire
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Département"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />

          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            placeholder="École"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Date de début</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Date de fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">Encadreur</label>
            <select
              name="encadreurId"
              value={formData.encadreurId}
              onChange={handleChange}
              disabled={!!defaultEncadreurId} // 🔒 verrouillé si encadreur connecté
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            >
              <option value="">Sélectionnez un encadreur</option>
              {encadreurs.map((enc) => (
                <option key={enc.id} value={enc.id}>
                  {enc.prenom} {enc.nom}
                </option>
              ))}
            </select>

            {defaultEncadreurId && (
              <p className="text-xs text-gray-500 mt-1">
                (Sélection automatique : votre profil encadreur)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Ajout...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
