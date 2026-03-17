interface GoldLineProps {
  className?: string;
}

const GoldLine = ({ className = '' }: GoldLineProps) => {
  return <hr className={`gold-line ${className}`} />;
};

export default GoldLine;
