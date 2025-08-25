import { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import { User, Lock, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import { updateProfile, changePassword, updateTheme } from '../services/authService';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import type { UpdateProfileData, ChangePasswordData, UpdateThemeData } from '../types';

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
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.prenom || '',
                lastName: user.nom || ''
            });
        }
    }, [user]);

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

    const handlePhotoUpdate = (updatedUser: any) => {
        updateUser(updatedUser);
    };



    return (
        <AppLayout title="Profil et Paramètres">
            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Section Photo de Profil */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <div className="flex items-center gap-x-3 mb-6">
                        <User size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold text-text-primary">Photo de Profil</h2>
                    </div>
                    <div className="text-center">
                        <p className="text-text-secondary mb-4">
                            Personnalisez votre profil en ajoutant une photo qui vous représente.
                        </p>
                        <ProfilePhotoUpload user={user} onPhotoUpdate={handlePhotoUpdate} />
                    </div>
                </div>

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


            </div>



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