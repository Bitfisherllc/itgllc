export function LinkedText({ text }: { text: string }) {
  const parts = text.split(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g);
  return (
    <>
      {parts.map((part, index) =>
        part.includes("@") ? (
          <a key={`${part}-${index}`} className="underline" href={`mailto:${part}`}>
            {part}
          </a>
        ) : (
          <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>
        ),
      )}
    </>
  );
}
