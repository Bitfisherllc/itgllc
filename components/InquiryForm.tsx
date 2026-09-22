"use client";

import { useState } from "react";
import { inquiryOptions, prepareInquiry, type InquiryIntent } from "@/lib/inquiry";
import { coverageStates } from "@/lib/site";

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

export function InquiryForm({ intent }: { intent: InquiryIntent }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState<{ to: string; department: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      intent,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      company: String(form.get("company") ?? ""),
      role: String(form.get("role") ?? ""),
      help: String(form.get("help") ?? ""),
      transaction: String(form.get("transaction") ?? ""),
      propertyState: String(form.get("propertyState") ?? ""),
      message: String(form.get("message") ?? ""),
      sensitiveAck: form.get("sensitiveAck") === "yes",
      honeypot: String(form.get("company_website") ?? ""),
    };
    const result = prepareInquiry(payload);

    if (result.status === "error") {
      setReady(null);
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      const node = event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`);
      node?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        department?: string;
        to?: string;
        errors?: Record<string, string>;
      };
      if (!response.ok || !body.ok) {
        setErrors(body.errors ?? { form: "The message could not be sent. Call the office instead." });
        return;
      }
      setErrors({});
      setReady({ to: body.to || result.to, department: body.department || result.department });
    } catch {
      setErrors({ form: "The message could not be sent. Call the office instead." });
    } finally {
      setSending(false);
    }
  }

  if (ready) {
    return (
      <div role="status" className="border border-line bg-white p-8">
        <p className="eyebrow text-brass">Received</p>
        <h2 className="display mt-4 text-4xl">ITG has your message.</h2>
        <p className="mt-4 leading-relaxed text-ink-soft">
          It is with {ready.department.toLowerCase()} at{" "}
          <a className="underline" href={`mailto:${ready.to}`}>
            {ready.to}
          </a>
          . Someone at that desk can follow up using the phone and email you entered.
        </p>
        {intent === "order" ? (
          <p className="mt-4 leading-relaxed text-ink-soft">
            This form cannot take attachments. Email the sale agreement to {ready.to} so a purchase file can be opened.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {errors.form ? (
        <p role="alert" className="border border-brass bg-paper-deep px-4 py-3 text-sm">
          {errors.form}
        </p>
      ) : null}

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" error={errors.phone} autoComplete="tel" />
        <Field label="Company" name="company" error={errors.company} autoComplete="organization" optional />
      </div>

      <Select label="I am a" name="role" error={errors.role} options={inquiryOptions.roles} />

      {intent === "contact" ? (
        <Select label="How can we help?" name="help" error={errors.help} options={inquiryOptions.helpOptions} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Transaction"
            name="transaction"
            error={errors.transaction}
            options={["Purchase", "Refinance", "Not sure yet"]}
          />
          <Select
            label="Property state"
            name="propertyState"
            error={errors.propertyState}
            options={[...coverageStates, "Another state", "Not sure yet"]}
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClass}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-brass-deep">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="sensitiveAck"
            value="yes"
            className="mt-1"
            aria-invalid={errors.sensitiveAck ? true : undefined}
            aria-describedby={errors.sensitiveAck ? "ack-error" : undefined}
          />
          <span>
            I will not include Social Security numbers, bank account numbers, or wire instructions.
          </span>
        </label>
        {errors.sensitiveAck ? (
          <p id="ack-error" className="mt-2 text-sm text-brass-deep">
            {errors.sensitiveAck}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-12 items-center justify-center bg-ink px-6 text-sm font-semibold text-paper hover:bg-brass-deep disabled:opacity-60 sm:justify-self-start"
      >
        {sending ? "Sending" : intent === "order" ? "Send order request" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  autoComplete,
  optional = false,
}: {
  label: string;
  name: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  const id = name;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-brass-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  label,
  name,
  error,
  options,
}: {
  label: string;
  name: string;
  error?: string;
  options: readonly string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldClass}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-brass-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}
