import {cn} from "@/lib/utils";
// 毛玻璃效果组件
export const Glassmorphism = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div
        className={cn(
            'bg-black/20 backdrop-blur-lg rounded-xl border border-white/10',
            className
        )}
    >
        {children}
    </div>
);
