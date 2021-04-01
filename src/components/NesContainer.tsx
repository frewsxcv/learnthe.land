export const NesContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="nes-container with-title">
      <h1 className="title">{title}</h1>
      {children}
    </div>
  );
};
