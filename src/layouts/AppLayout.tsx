import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, LogOut, Wallet, Menu, X, Settings } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
}

const NavLink = ({ to, icon, children, onClick }: NavLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li>
            <Link
                to={to}
                onClick={onClick}
                className={`w-full flex items-center gap-x-2 px-4 py-2 text-text-secondary rounded-lg ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-primary/10 hover:text-primary'}`}
            >
                {icon}
                {children}
            </Link>
        </li>
    );
};

interface SidebarContentProps {
    onLinkClick?: () => void;
}

const SidebarContent = ({ onLinkClick }: SidebarContentProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <Link to="/" className="text-2xl font-bold text-text-primary">MoneyWise</Link>
            </div>
            <nav className="mt-4 px-2 flex-1">
                <ul className="space-y-1">
                    <NavLink to="/dashboard" icon={<Home size={20} />} onClick={onLinkClick}>Tableau de bord</NavLink>
                    <NavLink to="/transactions" icon={<Wallet size={20} />} onClick={onLinkClick}>Transactions</NavLink>
                    <NavLink to="/reports" icon={<LineChart size={20} />} onClick={onLinkClick}>Rapports</NavLink>
                    <NavLink to="/profile" icon={<Settings size={20} />} onClick={onLinkClick}>Paramètres</NavLink>
                </ul>
            </nav>
            <div className="p-4 border-t border-border">
                <button onClick={handleLogout} className="flex items-center gap-x-2 text-text-secondary hover:text-negative w-full">
                    <LogOut size={20} />
                    Déconnexion
                </button>
            </div>
        </div>
    )
};


const Sidebar = () => (
    <aside className="hidden md:flex w-64 bg-background-surface border-r border-border flex-shrink-0">
        <SidebarContent />
    </aside>
);

interface MobileSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const MobileSidebar = ({ isOpen, setIsOpen }: MobileSidebarProps) => (
    <>
        <div className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
        <div className={`fixed z-40 inset-y-0 left-0 w-64 bg-background-surface transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <SidebarContent onLinkClick={() => setIsOpen(false)} />
        </div>
    </>
);

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-background border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center gap-x-2">
                <button onClick={onMenuClick} className="md:hidden text-text-secondary">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">{title}</h1>
            </div>
            <div className="flex items-center gap-x-4">
                <ThemeToggle />
                <div className="relative">
                    <button className="flex items-center gap-x-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.prenom?.[0]}{user?.nom?.[0]}
                        </div>
                        <span className="hidden sm:block text-text-primary">{user?.prenom} {user?.nom?.charAt(0)}.</span>
                    </button>
                </div>
                 <button onClick={handleLogout} className="hidden sm:flex text-text-secondary hover:text-negative">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar />
            <MobileSidebar isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={title} onMenuClick={() => setIsMobileNavOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;