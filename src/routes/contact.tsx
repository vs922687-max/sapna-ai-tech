import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bharat AI Sathi" },
      { name: "description", content: "Get in touch with the Bharat AI Sathi team. We reply within one working day." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Message received! We'll reply within one working day.");
      (e.target as HTMLFormElement).reset();
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Let's <span className="text-gradient-tricolor">talk.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Questions, partnerships, or press? Drop us a note and we'll get back within one working day.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><Mail className="h-4 w-4" /></div>
              hello@bharataisathi.in
            </li>
            <li className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><MessageSquare className="h-4 w-4" /></div>
              WhatsApp: +91 98765 43210
            </li>
            <li className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><MapPin className="h-4 w-4" /></div>
              Bengaluru, Karnataka · India
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="glass-strong space-y-4 rounded-3xl border border-border/60 p-8 shadow-elegant">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required maxLength={100} className="mt-1 bg-background/40" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required maxLength={255} className="mt-1 bg-background/40" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required maxLength={1000} rows={5} className="mt-1 bg-background/40" />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
          >
            {loading ? "Sending..." : "Send message"}
          </Button>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
