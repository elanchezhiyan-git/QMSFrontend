import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Video as LucideIcon} from 'lucide-react';

interface SidebarLink {
    to: string;
    label: string;
    icon: LucideIcon;
}

interface SidebarProps {
    links: SidebarLink[];
}

export const Sidebar: React.FC<SidebarProps> = ({links}) => {
    const location = useLocation();

    return (
        <div className="w-64 bg-gray-50 min-h-screen border-r">
            <div className="p-6">
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.to;

                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Icon className="w-5 h-5"/>
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};