
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import LoadingScreen from "@/components/ui/LoadingScreen";

interface ProtectedPageProps {
    children: ReactNode;
}

export default function ProtectedPage({
    children,
}: ProtectedPageProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let active = true;

        async function verifySession() {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/auth/login");
                return;
            }

            try {
                // Validate the stored token with the backend.
                await authService.getCurrentUser();

                if (active) {
                    setIsAuthenticated(true);
                }
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                if (active) {
                    router.replace("/auth/login");
                }
            } finally {
                if (active) {
                    setIsChecking(false);
                }
            }
        }

        void verifySession();

        return () => {
            active = false;
        };
    }, [router]);

    if (isChecking || !isAuthenticated) {
        return <LoadingScreen message="Verifying your session..." />;
    }

    return <>{children}</>;
}
