import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
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
      <div className={panelClass}>
        <ContactForm />
      </div>
    </PageContainer>
  );
}
