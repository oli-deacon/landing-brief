type SectionHeadingProps = {
  title: string;
  description: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3 px-1">
      <p className="eyebrow">Portable country intelligence</p>
      <h1 className="max-w-xl text-4xl leading-[0.96] text-text-main sm:text-[3.35rem]">{title}</h1>
      <p className="max-w-xl text-sm leading-7 text-text-muted">{description}</p>
    </div>
  );
}
