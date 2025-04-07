// executions

import { Button } from "@/components/ui/button"
import {RotateCcw} from "lucide-react";

export const AttemptMenu = ({...rest}: React.ComponentProps<typeof Button>) => {
  return <Button
    size="sm"
    variant="outline"
    className="h-8 border-white/20 bg-transparent hover:bg-white/10"
    {...rest}
  >
    <RotateCcw className="h-3.5 w-3.5" />
    <span className={'hidden sm:inline'}>Attempt</span>
    <span className={''}>#1</span>
  </Button>
}
