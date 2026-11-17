import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/content/business";
import { PageContainer, PageHeader, panelClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a piece or an order? Send us a message.",
};

export default function ContactPage() {
  return (
    <PageContainer narrow>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        intro="Questions about a piece, an order or a custom request? Send us a message."
      />
      <p className="mb-6 text-[15px] text-muted">
        Or call us on{" "}
        <a href={`tel:${CONTACT_PHONE}`} className="text-ivory underline underline-offset-4 hover:text-gold">
          {CONTACT_PHONE_DISPLAY}
        </a>
      </p>
      <div className={panelClass}>
        <ContactForm />
      </div>
    </PageContainer>
  );
}
