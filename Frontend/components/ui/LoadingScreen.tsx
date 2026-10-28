
import { LoaderCircle } from "lucide-react";

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({
    message = "Loading your workspace...",
}: LoadingScreenProps) {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50"
            role="status"
            aria-live="polite"
        >
            <LoaderCircle size={32} className="animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>
    );
}
