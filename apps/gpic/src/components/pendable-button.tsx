import { Ellipsis } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

type PendableButtonProps = {
    pending: boolean
  } & React.ComponentProps<typeof Button>
export  const PendableButton = ({pending, children, className, ...rest}: PendableButtonProps) => {
    return <Button 
    disabled={pending}
    className={cn(
      className
    )}
    {...rest}    
    >
      {!pending && children}
      { pending && <Ellipsis /> }
    </Button>
  }