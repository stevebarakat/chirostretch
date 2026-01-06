export default function RawHtml({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: children ?? "" }}
    />
  );
}
