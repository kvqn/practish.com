import { PastSubmissions } from "./past-submissions"
import { SubmitPrompt } from "./submit-prompt"

export function Submissions() {
  return (
    <div>
      <SubmitPrompt />
      <PastSubmissions />
    </div>
  )
}
