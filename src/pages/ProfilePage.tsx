import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Plus, Download, Trash2, Edit, User, Lock, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, createCategory } from '../services/categoryService';
import { updateProfile, changePassword, updateTheme } from '../services/authService';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import type { Category, NewCategory, UpdateProfileData, ChangePasswordData, UpdateThemeData } from '../types';

// Type local pour le formulaire de changement de mot de passe
interface PasswordFormData extends ChangePasswordData {
  confirmPassword: string;
}

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState<UpdateProfileData>({
        firstName: '',
        lastName: ''
    });
    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState<NewCategory>({
        nom: '',
        couleur: '#FF6B6B',
        type: 'depense'
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.prenom || '',
                lastName: user.nom || ''
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

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { utilisateur, message } = await updateProfile(profileData);
            updateUser(utilisateur);
            toast.success(message || "Profil mis à jour avec succès !");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du profil.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);
        try {
            // Extraire seulement les champs nécessaires pour l'API
            const { currentPassword, newPassword } = passwordData;
            const { message } = await changePassword({
                currentPassword,
                newPassword
            });
            toast.success(message || "Mot de passe modifié avec succès !");
            setIsPasswordModalOpen(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error("Erreur lors du changement de mot de passe.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = async (theme: 'light' | 'dark') => {
        try {
            const { utilisateur, message } = await updateTheme({ theme });
            updateUser(utilisateur);
            toast.success(message || "Thème mis à jour avec succès !");
        } catch (error) {
            toast.error("Erreur lors du changement de thème.");
            console.error(error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newCategory.nom) {
            toast.error("Le nom de la catégorie est requis.");
            return;
        }

        try {
            await createCategory(newCategory);
            toast.success("Catégorie ajoutée avec succès !");
            fetchCategories();
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
                    <div className="flex items-center gap-x-3 mb-4">
                        <User size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold text-text-primary">Informations Personnelles</h2>
                    </div>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="flex gap-x-4">
                            <div className="w-1/2">
                                <label className="font-medium text-text-primary">Prénom</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleProfileChange}
                                    className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="font-medium text-text-primary">Nom</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleProfileChange}
                                    className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium text-text-primary">Adresse Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full mt-2 px-3 py-2 text-text-secondary bg-background border border-border rounded-lg cursor-not-allowed"
                            />
                            <p className="text-sm text-text-secondary mt-1">L'email ne peut pas être modifié</p>
                        </div>
                        <div className="pt-2 flex justify-end gap-x-4">
                            <button 
                                type="button" 
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="px-4 py-2 text-text-primary font-medium bg-background-surface border border-border hover:bg-border rounded-lg duration-150 flex items-center gap-x-2"
                            >
                                <Lock size={16} />
                                Changer le mot de passe
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg duration-150 disabled:bg-gray-500"
                            >
                                {loading ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Section Thème */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <div className="flex items-center gap-x-3 mb-4">
                        <Palette size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold text-text-primary">Apparence</h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-text-secondary">Choisissez le thème de votre interface :</p>
                        <div className="flex gap-x-4">
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                    user?.theme === 'light'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border text-text-primary hover:border-primary'
                                }`}
                            >
                                Mode clair
                            </button>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                    user?.theme === 'dark'
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border text-text-primary hover:border-primary'
                                }`}
                            >
                                Mode sombre
                            </button>
                        </div>
                    </div>
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

            {/* Modal Ajout de catégorie */}
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
                            onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'revenu' | 'depense' })}
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

            {/* Modal Changement de mot de passe */}
            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Changer le mot de passe">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="font-medium text-text-primary">Mot de passe actuel</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="font-medium text-text-primary">Nouveau mot de passe</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={6}
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            placeholder="Minimum 6 caractères"
                        />
                    </div>
                    <div>
                        <label className="font-medium text-text-primary">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            className="w-full mt-2 px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-x-4">
                        <button 
                            type="button" 
                            onClick={() => setIsPasswordModalOpen(false)} 
                            className="px-4 py-2 text-text-primary font-medium bg-background-surface border border-border hover:bg-border rounded-lg duration-150"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 text-white font-medium bg-primary hover:bg-primary-hover rounded-lg duration-150 disabled:bg-gray-500"
                        >
                            {loading ? "Modification..." : "Modifier"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
};

export default ProfilePage;