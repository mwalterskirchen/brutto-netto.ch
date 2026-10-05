import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Props {
  /** Answers are trusted HTML written in Faq.astro. */
  items: { question: string; answer: string }[];
}

export default function FaqAccordion({ items }: Props) {
  return (
    <Accordion className="flex flex-col gap-4">
      {items.map(({ question, answer }) => (
        <AccordionItem key={question} value={question}>
          <AccordionTrigger className="bg-secondary-background text-foreground hover:bg-background">
            {question}
          </AccordionTrigger>
          {/* Closed answers stay in the HTML so search engines and find-in-page see them. */}
          <AccordionContent
            keepMounted
            hiddenUntilFound
            className="max-w-[68ch] text-base leading-relaxed"
          >
            <p dangerouslySetInnerHTML={{ __html: answer }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
