import { readdir } from "fs/promises"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export async function ProblemHints({ slug }: { slug: string }) {
  const files = await readdir(`./problems/${slug}/hints`)
  console.log(files)
  const hints = await Promise.all(
    files.map(async (file) => {
      const { default: Markdown } = (await import(
        `~/problems/${slug}/hints/${file}`
      )) as { default: React.ComponentType }
      return {
        file: file,
        node: <Markdown />,
      }
    }),
  )

  hints.sort((a, b) => a.file.localeCompare(b.file))

  return (
    <div className="mt-6 border-t">
      <h2 className="mt-6 text-xl font-bold">Hints</h2>

      <Accordion type="single" collapsible>
        {hints.map(({ file: _, node }, i) => (
          <AccordionItem value={`${i + 1}`} key={i + 1}>
            <AccordionTrigger className="text-md font-semibold">{`Hint #${i + 1}`}</AccordionTrigger>
            <AccordionContent>{node}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
