type SectionHeadingProps = {
  title: string;
  description: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2 px-1">
      <h1 className="text-3xl font-semibold tracking-tight text-text-main">{title}</h1>
      <p className="max-w-xl text-sm leading-6 text-text-muted">{description}</p>
    </div>
  );
}
