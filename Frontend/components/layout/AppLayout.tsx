"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AppLayout({
    children,
}: {
    children: ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            <div className="lg:pl-[252px]">
                <Header onMenuClick={() => setMobileMenuOpen(true)} />

                <div className="min-h-[calc(100vh-76px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}