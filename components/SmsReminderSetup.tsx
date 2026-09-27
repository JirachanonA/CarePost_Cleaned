"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import type { MedScheduleItem } from "@/lib/types/care-plan";
import { Button } from "@/components/ui";
import { wait } from "@/lib/demo";

type Status = "idle" | "loading" | "error";
type TestStatus = "idle" | "sending" | "sent" | "error";

/** Twilio SMS reminders: sign-up form, or the registered state with a test send. */
export function SmsReminders({ schedule }: { schedule: MedScheduleItem[] }) {
  const [registeredPhone, setRegisteredPhone] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");

  useEffect(() => {
    if (localStorage.getItem("sms_registered")) setRegisteredPhone(localStorage.getItem("sms_phone") ?? "");
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    // Demo mode: simulate Twilio instead of sending real texts
    await wait(900);
    localStorage.setItem("sms_registered", "true");
    localStorage.setItem("sms_phone", phone);
    setRegisteredPhone(phone);
    setStatus("idle");
  }

  function reset() {
    localStorage.removeItem("sms_registered");
    localStorage.removeItem("sms_phone");
    localStorage.removeItem("reminder_sids");
    setRegisteredPhone(null);
    setTestStatus("idle");
  }

  async function sendTest() {
    setTestStatus("sending");
    await wait(700);
    setTestStatus("sent");
  }

  if (registeredPhone !== null) {
    return (
      <div className="rounded-[28px] bg-brand-wash p-5">
        <div className="flex items-start gap-4">
          <MessageSquareText className="mt-0.5 size-6 shrink-0 text-brand-ink" />
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold">Text reminders are on <span className="text-[13px] font-medium text-label-3">(demo)</span></p>
            <p className="text-[15px] text-label-2">
              We&apos;ll text {registeredPhone || "you"} at each medicine time today.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={sendTest} disabled={testStatus === "sending"} className="min-h-12 flex-1 px-4 text-[15px]">
            {testStatus === "sending" ? "Sending…" : testStatus === "sent" ? "Test sent ✓" : testStatus === "error" ? "Failed — try again" : "Send a test text"}
          </Button>
          <Button variant="ghost" onClick={reset} className="min-h-12 px-4 text-[15px]">
            Change number
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] bg-surface p-5">
      <div className="flex items-start gap-4">
        <MessageSquareText className="mt-0.5 size-6 shrink-0 text-brand-ink" />
        <div>
          <p className="text-[17px] font-semibold">Get text reminders</p>
          <p className="text-[15px] text-label-2">We&apos;ll text you when it&apos;s time for each medicine. Demo only — no texts are actually sent.</p>
        </div>
      </div>
      <label htmlFor="sms-phone" className="mt-4 block text-[15px] font-semibold text-label-2">
        Mobile number
      </label>
      <input
        id="sms-phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        placeholder="+1 555 000 0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-1.5 min-h-14 w-full rounded-[18px] bg-white px-4 text-[17px] outline-none ring-1 ring-hairline placeholder:text-label-3 focus:ring-2 focus:ring-brand"
      />
      <Button type="submit" variant="primary" disabled={status === "loading"} className="mt-3 w-full">
        {status === "loading" && <Loader2 className="size-5 animate-spin" />}
        {status === "loading" ? "Setting up…" : "Turn on reminders"}
      </Button>
      {status === "error" && (
        <p role="alert" className="mt-3 text-[15px] text-danger-ink">{errorMsg}</p>
      )}
    </form>
  );
}
