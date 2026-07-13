import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
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

const EMAILJS_SERVICE_ID = "service_m7lx0c4";
const EMAILJS_TEMPLATE_ID = "19p4btv";
const EMAILJS_PUBLIC_KEY = "J12QyKSq8xnRoDrpr";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = schema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          message: parsed.data.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      toast.success("✅ Thank you! Your message has been sent successfully. We will contact you soon.");
      form.reset();
    } catch {
      toast.error("❌ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
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

        <form ref={formRef} onSubmit={submit} className="glass-strong space-y-4 rounded-3xl border border-border/60 p-8 shadow-elegant">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required maxLength={100} className="mt-1 bg-background/40" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required maxLength={255} className="mt-1 bg-background/40" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required maxLength={20} className="mt-1 bg-background/40" />
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
