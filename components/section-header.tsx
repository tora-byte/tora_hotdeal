type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2">
      <h2 className="text-xl font-black">{title}</h2>
    </div>
  );
}
