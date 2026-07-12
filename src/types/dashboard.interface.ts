import { UserRole } from "@/lib/auth-utils";

export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    badge?: string;
    description?: string;
    role: UserRole[];
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}