import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MenuItem({ item, sidebarCollapsed, canAccess }: any) {
    const [isExpanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setExpanded(!isExpanded);
        setIsOpen(!isOpen);
    };

    if (!canAccess(item.access)) return null;

    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
        <div>
            {hasSubmenu ? (
                <button
                    onClick={toggleMenu}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors group"
                >
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
                    {!sidebarCollapsed && (
                        <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                        </>
                    )}
                </button>
            ) : (
                <Link
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors group"
                >
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
                    {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
            )}

            {hasSubmenu && isOpen && !sidebarCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map((subItem: any) => {
                        if (subItem.access && !canAccess(subItem.access)) return null;

                        const SubIcon = subItem.icon;
                        return (
                            <Link
                                key={subItem.title}
                                to={subItem.to}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
                            >
                                <SubIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                                <span>{subItem.title}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}