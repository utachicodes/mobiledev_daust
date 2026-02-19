import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled = false,
    uppercase = true,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer';

    const variants = {
        primary: 'bg-brand-navy text-white hover:bg-brand-orange shadow-sm hover:shadow-lg hover:shadow-brand-orange/20',
        secondary: 'bg-transparent border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white',
        outline: 'bg-transparent border border-gray-200 text-gray-700 hover:border-brand-navy hover:text-brand-navy',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-50',
    };

    const sizes = {
        sm: 'px-4 h-10 text-xs gap-2',
        md: 'px-6 h-12 text-sm gap-2',
        lg: 'px-8 h-14 text-sm gap-3',
    };

    const textTransform = uppercase ? 'uppercase tracking-wider font-bold' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${textTransform} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;