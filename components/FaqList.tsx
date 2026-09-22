import { faqs } from "@/lib/resources";

export function FaqList() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl marker:content-none [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span aria-hidden="true" className="text-brass transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-ink-soft">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
