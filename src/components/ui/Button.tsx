interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const variants = {
  primary: 'bg-vinho text-offwhite hover:bg-vinho/90 border border-vinho',
  secondary: 'bg-caramelo text-offwhite hover:bg-caramelo/85 border border-caramelo',
  ghost: 'bg-transparent text-vinho hover:bg-vinho/5 border border-vinho/20',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) => {
  const classes = [
    'inline-flex items-center justify-center font-headline font-semibold uppercase tracking-wider transition-all duration-200',
    variants[variant],
    sizes[size],
    className,
  ].join(' ');

  if (href) {
    return <a href={href} className={classes}>{children}</a>;
  }

  return <button type={type} onClick={onClick} className={classes}>{children}</button>;
};
