
import type { ReactNode } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedPage from "@/components/layout/ProtectedPage";

export default function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ProtectedPage>
            <AppLayout>{children}</AppLayout>
        </ProtectedPage>
    );
}
