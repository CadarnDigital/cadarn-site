interface WordJoiaProps {
  children: React.ReactNode;
}

const WordJoia = ({ children }: WordJoiaProps) => {
  return (
    <span className="font-accent-italic text-cadarn-vinho">{children}</span>
  );
};

export default WordJoia;
