import React from 'react';

interface CardProps {
    children: React.ReactNode,
    className?: string,
    padding?: boolean,
    onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className = '',
                                              padding = true,
                                              onClick
                                          }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg border border-gray-200 shadow-sm ${padding ? 'p-6' : ''} ${className}`}>

            {children}
        </div>
    );
};