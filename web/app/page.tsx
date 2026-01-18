import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-24 text-center">
                <Badge className="mb-4" variant="secondary">
                    Demo SaaS Dashboard
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Dashify
                </h1>

                <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
                    A modern demo SaaS dashboard built with Next.js, NestJS, and TypeScript.
                    Designed to showcase real-world authentication, role-based access, and
                    scalable architecture.
                </p>

                <div className="flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/signin">View Demo</Link>
                    </Button>

                    <Button size="lg" variant="outline" asChild>
                        <Link href="https://dashify-demo.vercel.app" target="_blank">
                            Live Preview
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Authentication & Roles"
                        description="JWT-based authentication with Admin and User roles,
            ready for real SaaS use cases."
                    />

                    <FeatureCard
                        title="Modular Architecture"
                        description="Clean modular monolith structure that can evolve
            into microservices when scaling is required."
                    />

                    <FeatureCard
                        title="Production-Ready Stack"
                        description="Built with Next.js App Router, NestJS, Prisma, PostgreSQL,
            and shadcn/ui."
                    />
                </div>
            </section>

            {/* Demo Accounts */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-semibold mb-10">
                    Demo Accounts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <Card>
                        <CardContent className="p-6 text-left space-y-2">
                            <h3 className="font-semibold text-lg">Admin User</h3>
                            <p className="text-sm text-muted-foreground">
                                Email: admin@dashify.demo
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Password: Admin123!
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-left space-y-2">
                            <h3 className="font-semibold text-lg">Normal User</h3>
                            <p className="text-sm text-muted-foreground">
                                Email: user@dashify.demo
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Password: User123!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t">
                <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Dashify — Demo SaaS Dashboard
                </div>
            </footer>
        </main>
    );
}

/* ------------------------------ */
/* Feature Card Component */
/* ------------------------------ */

function FeatureCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <Card className="h-full">
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
