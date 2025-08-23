import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Plus, Download, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, createCategory } from '../services/categoryService';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal'; // Importer la modale
import type { Category, NewCategory } from '../types'; // Importer les types

const ProfilePage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: ''
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState<NewCategory>({
        nom: '',
        couleur: '#FF6B6B',
        type: 'depense'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                prenom: user.prenom || '',
                nom: user.nom || '',
                email: user.email || ''
            });
        }
    }, [user]);

     const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await getCategories();
            setCategories(data.categories || []);
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories.");
            console.error(error);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Mise à jour du profil avec :', formData);
    };

    const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newCategory.nom) {
            toast.error("Le nom de la catégorie est requis.");
            return;
        }

        // Le payload est déjà correct grâce à notre state `newCategory`
        try {
            await createCategory(newCategory);
            console.log("newCategory", newCategory);
            toast.success("Catégorie ajoutée avec succès !");
            fetchCategories(); // Rafraîchir la liste
            setIsModalOpen(false);
            setNewCategory({ nom: '', couleur: '#FF6B6B', type: 'depense' });
        } catch (error) {
            toast.error("Erreur lors de l'ajout de la catégorie.");
            console.error(error);
        }
    };

    return (
        <AppLayout title="Profil et Paramètres">
            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Section Profil Utilisateur */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Informations Personnelles</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-x-4">
                            <div className="w-1/2">
                                <label className="font-medium text-text-primary">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="font-medium text-text-primary">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium text-text-primary">Adresse Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            />
                        </div>
                        <div className="pt-2 flex justify-end gap-x-4">
                             <button type="button" className="px-4 py-2 text-text-primary font-medium bg-background-surface border border-border hover:bg-border rounded-lg duration-150">
                                Changer le mot de passe
                            </button>
                            <button type="submit" className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg duration-150">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>

                {/* Section Gestion des Catégories */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Gérer les Catégories</h2>
                    <div className="space-y-4">
                       {loadingCategories ? (
                            <p className="text-text-secondary text-center py-4">Chargement...</p>
                        ) : categories.length > 0 ? (
                            categories.map((cat: Category) => (
                                <div key={cat.id} className="flex items-center justify-between bg-background p-3 rounded-lg">
                                    <div className="flex items-center gap-x-3">
                                        <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: cat.couleur }}></span>
                                        <span className="text-text-primary">{cat.nom}</span>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <button className="text-text-secondary hover:text-primary"><Edit size={16} /></button>
                                        <button className="text-text-secondary hover:text-negative"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary text-center py-4">Vous n'avez pas encore de catégories.</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-x-2 border-2 border-dashed border-border hover:border-primary hover:text-primary text-text-secondary p-3 rounded-lg transition-colors">
                            <Plus size={18} />
                            Ajouter une catégorie
                        </button>
                    </div>
                </div>

                {/* Section Export des Données */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Exporter vos Données</h2>
                    <p className="text-text-secondary mb-4">Téléchargez un rapport complet de vos transactions dans le format de votre choix.</p>
                    <div className="flex gap-x-4">
                        <button className="flex items-center justify-center gap-x-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover w-full">
                            <Download size={18} />
                            Exporter en PDF
                        </button>
                         <button className="flex items-center justify-center gap-x-2 bg-background-surface border border-border text-text-primary font-semibold px-4 py-2 rounded-lg hover:bg-border w-full">
                            <Download size={18} />
                            Exporter en CSV
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter une catégorie">
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                        <label className="font-medium text-text-primary">Nom de la catégorie</label>
                        <input
                            type="text"
                            value={newCategory.nom}
                            onChange={(e) => setNewCategory({ ...newCategory, nom: e.target.value })}
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            placeholder="Ex: Restaurant"
                        />
                    </div>
                    <div>
                        <label className="font-medium text-text-primary">Couleur</label>
                        <input
                            type="color"
                            value={newCategory.couleur}
                            onChange={(e) => setNewCategory({ ...newCategory, couleur: e.target.value })}
                            className="w-full mt-2 h-10 px-1 py-1 bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="font-medium text-text-primary">Type</label>
                        <select
                            value={newCategory.type}
                            onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        >
                            <option value="depense">Dépense</option>
                            <option value="revenu">Revenu</option>
                        </select>
                    </div>
                    <div className="pt-2 flex justify-end gap-x-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-primary font-medium bg-background-surface border border-border hover:bg-border rounded-lg duration-150">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg duration-150">
                            Ajouter
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
};

export default ProfilePage;