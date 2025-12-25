import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColDef } from "ag-grid-community";
import {
  Bell,
  Bot,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Cog,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Menu,
  Moon,
  Palette,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import backdrop4k from "@/assets/backdrop-user-wave-4k.webp";

import { GridEngineToggle, type GridEngine } from "@/components/grids/GridEngineToggle";
import { TanstackVirtualGrid } from "@/components/grids/TanstackVirtualGrid";
import { AgGridPanel } from "@/components/grids/AgGridPanel";
import {
  makeQueryRows,
  makeReportRunRows,
  type CustomerRow,
  type InvoiceRow,
  type OrderRow,
  type ReportRunRow,
  type UserRow,
} from "@/lib/dummy";

const NOISE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.22 0"/>
  </filter>
  <rect width="260" height="260" filter="url(#n)" />
</svg>
`;

const NOISE_BG = `data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG)}`;


const i18n = {
  EN: {
    appName: "GlassSuite",
    appTagline: "Enterprise Console",
    skip: "Skip to content",
    openNav: "Open navigation",
    searchGlobal: "Search everything",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    notificationsTitle: "Notifications",
    notificationsAll: "All",
    notificationsMentions: "Mentions",
    notificationsSystem: "System",
    notificationsMarkAll: "Mark all as read",
    notificationsViewAll: "View all",
    notificationsEmpty: "You're all caught up.",
    openUserMenu: "Open user menu",
    modules: "Modules",
    browseModules: "Browse modules",
    browseModulesDesc: "A larger, commercial-style menu for your product areas.",
    viewAll: "View all",
    tip: "Tip:",
    tipText: "Keep this menu data-driven so it scales across teams.",
    docs: "Docs",
    changelog: "Changelog",
    navDashboard: "Dashboard",
    navQueries: "Queries",
    navReports: "Reports",
    navOverview: "Overview",
    navSettings: "Settings",
    navAdmin: "Admin",
    workspace: "Workspace",
    securityPosture: "Security posture",
    ssoEnabled: "SSO enabled • 2FA enforced",
    review: "Review",
    create: "Create",
    export: "Export",
    heroSubtitle: "A professional, glassy enterprise layout: fast, accessible, and scalable.",
    cardHealth: "Health",
    cardHealthSub: "All systems operational",
    cardUsage: "Usage",
    cardUsageSub: "Last 24 hours",
    cardSecurity: "Security",
    cardSecuritySub: "Policy alignment",
    uptime: "Uptime 99.99% • Latency p95 180ms",
    usageMetrics: "1.2M requests • 84k active users",
    securityMetrics: "No critical alerts • 3 suggestions",
    activity: "Activity",
    activitySub: "Recent changes",
    activity1: "Access policy updated for Finance group",
    activity2: "New integration connected: Slack",
    activity3: "Billing report exported by Jordan",
    quickActions: "Quick actions",
    quickActionsSub: "Common tasks",
    inviteMembers: "Invite members",
    configureSSO: "Configure SSO",
    setPolicies: "Set policies",
    alerts: "Alerts",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    sidebarCollapse: "Collapse sidebar",
    sidebarExpand: "Expand sidebar",
    themesTitle: "Themes",
    themesSubtitle: "Pick a look inspired by modern developer products.",
    light: "Light",
    dark: "Dark",
    ai: "AI",
    aiAssistant: "AI Assistant",
    aiPrompt: "Ask anything…",
    aiHint: "UI placeholder — connect to your AI backend later.",
    aiSend: "Send",
    close: "Close",
    remove: "Remove",
    load: "Load",
    delete: "Delete",
    unread: "unread",
    category: "Category",
    openReportHint: "Open a report to preview it.",
    placeholderPreview: "This is a placeholder preview area. Replace with charts, tables, or embedded report content.",
    n1Title: "Security",
    n1Body: "New sign-in from a recognized device.",
    n2Title: "Reports",
    n2Body: "Weekly usage report is ready to export.",
    n3Title: "Integrations",
    n3Body: "Slack connection updated permissions.",
    n4Title: "Billing",
    n4Body: "Invoice #1821 was paid successfully.",
    queriesTitle: "Query Builder",
    queriesSubtitle: "Create reusable queries from your database entities.",
    queryName: "Query name",
    entity: "Entity",
    filters: "Filters",
    addFilter: "Add filter",
    field: "Field",
    operator: "Operator",
    value: "Value",
    runQuery: "Run",
    saveQuery: "Save",
    savedQueries: "Saved queries",
    noSavedQueries: "No saved queries yet.",
    queryPreview: "Preview",
    querySqlPreview: "Generated SQL",
    queryJsonPreview: "Filter JSON",
    resultsCount: "Result count",
    reportsTitle: "Reports",
    reportsSubtitle: "Browse and open reports for your organization.",
    reportSearch: "Search reports",
    reportUpdated: "Updated",
    openReport: "Open",
    back: "Back",
    reportPreview: "Report preview",
    footer: "Built for enterprise UI patterns",
    moduleAnalytics: "Analytics",
    moduleProjects: "Projects",
    moduleBilling: "Billing",
    moduleSecurity: "Security",
    moduleIntegrations: "Integrations",
    moduleSupport: "Support",
    gridEngine: "Grid engine",
    gridTanstack: "TanStack (virtual)",
    gridAgGrid: "AG Grid",
    gridSearchRows: "Search rows",
    selected: "selected",
    agOptions: "Options",
    agOptionsTooltip: "Grid options",
    agMenuGrid: "Grid",
    agMenuPageSize: "Page size",
    agDensity: "Density",
    agComfortable: "Comfortable",
    agCompact: "Compact",
    agAutoSize: "Auto-size columns",
    agExportCsv: "Export CSV",
    agReset: "Reset grid",
    agNoRows: "No rows",
    queryResultsTitle: "Query results",
    queryResultsSubtitle: "Preview the results in a high-performance data grid.",
    reportDataTitle: "Report data",
    reportDataSubtitle: "Example rows (runs/history) rendered with the same grid engines.",
    rows: "rows",
    yes: "Yes",
    no: "No",
    colId: "ID",
    colName: "Name",
    colEmail: "Email",
    colCountry: "Country",
    colCreated: "Created",
    colCustomerId: "Customer ID",
    colStatus: "Status",
    colTotal: "Total",
    colOrderId: "Order ID",
    colAmount: "Amount",
    colPaid: "Paid",
    colIssued: "Issued",
    colRole: "Role",
    colActive: "Active",
    colRunId: "Run ID",
    colReport: "Report",
    colOwner: "Owner",
    colUpdated: "Updated",
    colDuration: "Duration (ms)",
  },
  DE: {
    appName: "GlassSuite",
    appTagline: "Enterprise-Konsole",
    skip: "Zum Inhalt springen",
    openNav: "Navigation öffnen",
    searchGlobal: "Alles durchsuchen",
    language: "Sprache",
    theme: "Theme",
    notifications: "Benachrichtigungen",
    notificationsTitle: "Benachrichtigungen",
    notificationsAll: "Alle",
    notificationsMentions: "Erwähnungen",
    notificationsSystem: "System",
    notificationsMarkAll: "Alles als gelesen markieren",
    notificationsViewAll: "Alle anzeigen",
    notificationsEmpty: "Alles erledigt.",
    openUserMenu: "Benutzermenü öffnen",
    modules: "Module",
    browseModules: "Module durchsuchen",
    browseModulesDesc: "Ein großes Menü für Ihre Produktbereiche.",
    viewAll: "Alle anzeigen",
    tip: "Tipp:",
    tipText: "Halten Sie dieses Menü datengetrieben, damit es skalierbar bleibt.",
    docs: "Doku",
    changelog: "Änderungen",
    navDashboard: "Dashboard",
    navQueries: "Abfragen",
    navReports: "Berichte",
    navOverview: "Übersicht",
    navSettings: "Einstellungen",
    navAdmin: "Admin",
    workspace: "Arbeitsbereich",
    securityPosture: "Sicherheitsstatus",
    ssoEnabled: "SSO aktiv • 2FA erzwungen",
    review: "Prüfen",
    create: "Erstellen",
    export: "Exportieren",
    heroSubtitle: "Ein professionelles Glass-Layout: schnell, barrierefrei und skalierbar.",
    cardHealth: "Status",
    cardHealthSub: "Alle Systeme verfügbar",
    cardUsage: "Nutzung",
    cardUsageSub: "Letzte 24 Stunden",
    cardSecurity: "Sicherheit",
    cardSecuritySub: "Richtlinienabgleich",
    uptime: "Uptime 99,99% • Latenz p95 180ms",
    usageMetrics: "1,2 Mio. Requests • 84k aktive Nutzer",
    securityMetrics: "Keine kritischen Warnungen • 3 Vorschläge",
    activity: "Aktivität",
    activitySub: "Letzte Änderungen",
    activity1: "Zugriffsrichtlinie für Finance aktualisiert",
    activity2: "Neue Integration verbunden: Slack",
    activity3: "Abrechnungsbericht exportiert von Jordan",
    quickActions: "Schnellaktionen",
    quickActionsSub: "Häufige Aufgaben",
    inviteMembers: "Mitglieder einladen",
    configureSSO: "SSO konfigurieren",
    setPolicies: "Richtlinien setzen",
    alerts: "Alarme",
    profile: "Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    sidebarCollapse: "Seitenleiste einklappen",
    sidebarExpand: "Seitenleiste ausklappen",
    themesTitle: "Themes",
    themesSubtitle: "Looks inspiriert von modernen Developer-Produkten.",
    light: "Hell",
    dark: "Dunkel",
    ai: "KI",
    aiAssistant: "KI-Assistent",
    aiPrompt: "Fragen Sie etwas…",
    aiHint: "UI-Platzhalter — später mit KI verbinden.",
    aiSend: "Senden",
    close: "Schließen",
    remove: "Entfernen",
    load: "Laden",
    delete: "Löschen",
    unread: "ungelesen",
    category: "Kategorie",
    openReportHint: "Öffnen Sie einen Bericht, um ihn anzusehen.",
    placeholderPreview: "Dies ist ein Platzhalter. Ersetzen Sie ihn durch Diagramme, Tabellen oder eingebettete Inhalte.",
    n1Title: "Sicherheit",
    n1Body: "Neuer Login von einem bekannten Gerät.",
    n2Title: "Berichte",
    n2Body: "Der wöchentliche Nutzungsbericht ist bereit.",
    n3Title: "Integrationen",
    n3Body: "Slack-Berechtigungen wurden aktualisiert.",
    n4Title: "Abrechnung",
    n4Body: "Rechnung #1821 wurde erfolgreich bezahlt.",
    queriesTitle: "Abfrage-Builder",
    queriesSubtitle: "Erstellen Sie wiederverwendbare Abfragen aus Ihren Datenbank-Entitäten.",
    queryName: "Abfragename",
    entity: "Entität",
    filters: "Filter",
    addFilter: "Filter hinzufügen",
    field: "Feld",
    operator: "Operator",
    value: "Wert",
    runQuery: "Ausführen",
    saveQuery: "Speichern",
    savedQueries: "Gespeicherte Abfragen",
    noSavedQueries: "Noch keine gespeicherten Abfragen.",
    queryPreview: "Vorschau",
    querySqlPreview: "Generiertes SQL",
    queryJsonPreview: "Filter JSON",
    resultsCount: "Ergebnisanzahl",
    reportsTitle: "Berichte",
    reportsSubtitle: "Berichte für Ihre Organisation durchsuchen und öffnen.",
    reportSearch: "Berichte suchen",
    reportUpdated: "Aktualisiert",
    openReport: "Öffnen",
    back: "Zurück",
    reportPreview: "Berichtvorschau",
    footer: "Für Enterprise-UI-Muster gebaut",
    moduleAnalytics: "Analysen",
    moduleProjects: "Projekte",
    moduleBilling: "Abrechnung",
    moduleSecurity: "Sicherheit",
    moduleIntegrations: "Integrationen",
    moduleSupport: "Support",
    gridEngine: "Grid-Engine",
    gridTanstack: "TanStack (virtual)",
    gridAgGrid: "AG Grid",
    gridSearchRows: "Zeilen durchsuchen",
    selected: "ausgewählt",
    agOptions: "Optionen",
    agOptionsTooltip: "Rasteroptionen",
    agMenuGrid: "Raster",
    agMenuPageSize: "Seitengröße",
    agDensity: "Dichte",
    agComfortable: "Komfortabel",
    agCompact: "Kompakt",
    agAutoSize: "Spalten automatisch anpassen",
    agExportCsv: "CSV exportieren",
    agReset: "Raster zurücksetzen",
    agNoRows: "Keine Zeilen",
    queryResultsTitle: "Abfrageergebnisse",
    queryResultsSubtitle: "Vorschau der Ergebnisse in einem performanten Datenraster.",
    reportDataTitle: "Berichtsdaten",
    reportDataSubtitle: "Beispieldaten (Runs/Verlauf) mit denselben Grid-Engines.",
    rows: "Zeilen",
    yes: "Ja",
    no: "Nein",
    colId: "ID",
    colName: "Name",
    colEmail: "E-Mail",
    colCountry: "Land",
    colCreated: "Erstellt",
    colCustomerId: "Kunden-ID",
    colStatus: "Status",
    colTotal: "Summe",
    colOrderId: "Bestell-ID",
    colAmount: "Betrag",
    colPaid: "Bezahlt",
    colIssued: "Ausgestellt",
    colRole: "Rolle",
    colActive: "Aktiv",
    colRunId: "Run-ID",
    colReport: "Bericht",
    colOwner: "Owner",
    colUpdated: "Aktualisiert",
    colDuration: "Dauer (ms)",
  },
  FR: {
    appName: "GlassSuite",
    appTagline: "Console Entreprise",
    skip: "Aller au contenu",
    openNav: "Ouvrir la navigation",
    searchGlobal: "Rechercher partout",
    language: "Langue",
    theme: "Thème",
    notifications: "Notifications",
    notificationsTitle: "Notifications",
    notificationsAll: "Toutes",
    notificationsMentions: "Mentions",
    notificationsSystem: "Système",
    notificationsMarkAll: "Tout marquer comme lu",
    notificationsViewAll: "Tout voir",
    notificationsEmpty: "Vous êtes à jour.",
    openUserMenu: "Ouvrir le menu utilisateur",
    modules: "Modules",
    browseModules: "Parcourir les modules",
    browseModulesDesc: "Un grand menu pour vos domaines produit.",
    viewAll: "Tout voir",
    tip: "Astuce :",
    tipText: "Gardez ce menu piloté par les données pour qu’il reste scalable.",
    docs: "Docs",
    changelog: "Changelog",
    navDashboard: "Tableau de bord",
    navQueries: "Requêtes",
    navReports: "Rapports",
    navOverview: "Aperçu",
    navSettings: "Paramètres",
    navAdmin: "Admin",
    workspace: "Espace de travail",
    securityPosture: "Posture de sécurité",
    ssoEnabled: "SSO activé • 2FA imposée",
    review: "Vérifier",
    create: "Créer",
    export: "Exporter",
    heroSubtitle: "Une mise en page verre pro : rapide, accessible et scalable.",
    cardHealth: "Santé",
    cardHealthSub: "Tous les systèmes opérationnels",
    cardUsage: "Usage",
    cardUsageSub: "Dernières 24 heures",
    cardSecurity: "Sécurité",
    cardSecuritySub: "Alignement des politiques",
    uptime: "Disponibilité 99,99% • Latence p95 180ms",
    usageMetrics: "1,2M requêtes • 84k utilisateurs actifs",
    securityMetrics: "Aucune alerte critique • 3 suggestions",
    activity: "Activité",
    activitySub: "Changements récents",
    activity1: "Politique d’accès mise à jour pour Finance",
    activity2: "Nouvelle intégration connectée : Slack",
    activity3: "Rapport de facturation exporté par Jordan",
    quickActions: "Actions rapides",
    quickActionsSub: "Tâches courantes",
    inviteMembers: "Inviter des membres",
    configureSSO: "Configurer SSO",
    setPolicies: "Définir des politiques",
    alerts: "Alertes",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    sidebarCollapse: "Réduire la barre latérale",
    sidebarExpand: "Déployer la barre latérale",
    themesTitle: "Thèmes",
    themesSubtitle: "Looks inspirés des produits développeurs modernes.",
    light: "Clair",
    dark: "Sombre",
    ai: "IA",
    aiAssistant: "Assistant IA",
    aiPrompt: "Posez une question…",
    aiHint: "Placeholder UI — connectez l’IA plus tard.",
    aiSend: "Envoyer",
    close: "Fermer",
    remove: "Retirer",
    load: "Charger",
    delete: "Supprimer",
    unread: "non lues",
    category: "Catégorie",
    openReportHint: "Ouvrez un rapport pour le prévisualiser.",
    placeholderPreview: "Zone d’aperçu fictive. Remplacez-la par des graphiques, tableaux ou contenus intégrés.",
    n1Title: "Sécurité",
    n1Body: "Nouvelle connexion depuis un appareil reconnu.",
    n2Title: "Rapports",
    n2Body: "Le rapport hebdomadaire est prêt à exporter.",
    n3Title: "Intégrations",
    n3Body: "Les permissions Slack ont été mises à jour.",
    n4Title: "Facturation",
    n4Body: "La facture #1821 a été payée.",
    queriesTitle: "Générateur de requêtes",
    queriesSubtitle: "Créez des requêtes réutilisables à partir de vos entités.",
    queryName: "Nom de la requête",
    entity: "Entité",
    filters: "Filtres",
    addFilter: "Ajouter un filtre",
    field: "Champ",
    operator: "Opérateur",
    value: "Valeur",
    runQuery: "Exécuter",
    saveQuery: "Enregistrer",
    savedQueries: "Requêtes enregistrées",
    noSavedQueries: "Aucune requête enregistrée.",
    queryPreview: "Aperçu",
    querySqlPreview: "SQL généré",
    queryJsonPreview: "JSON des filtres",
    resultsCount: "Nombre de résultats",
    reportsTitle: "Rapports",
    reportsSubtitle: "Parcourez et ouvrez des rapports pour votre organisation.",
    reportSearch: "Rechercher des rapports",
    reportUpdated: "Mis à jour",
    openReport: "Ouvrir",
    back: "Retour",
    reportPreview: "Aperçu du rapport",
    footer: "Conçu pour des patterns UI entreprise",
    moduleAnalytics: "Analytique",
    moduleProjects: "Projets",
    moduleBilling: "Facturation",
    moduleSecurity: "Sécurité",
    moduleIntegrations: "Intégrations",
    moduleSupport: "Support",
    gridEngine: "Moteur de grille",
    gridTanstack: "TanStack (virtual)",
    gridAgGrid: "AG Grid",
    gridSearchRows: "Rechercher des lignes",
    selected: "sélectionnés",
    agOptions: "Options",
    agOptionsTooltip: "Options du tableau",
    agMenuGrid: "Tableau",
    agMenuPageSize: "Taille de page",
    agDensity: "Densité",
    agComfortable: "Confortable",
    agCompact: "Compact",
    agAutoSize: "Ajuster les colonnes",
    agExportCsv: "Exporter CSV",
    agReset: "Réinitialiser le tableau",
    agNoRows: "Aucune ligne",
    queryResultsTitle: "Résultats de requête",
    queryResultsSubtitle: "Aperçu des résultats dans une grille de données performante.",
    reportDataTitle: "Données du rapport",
    reportDataSubtitle: "Exemple de lignes (exécutions/historique) rendues avec les mêmes moteurs.",
    rows: "lignes",
    yes: "Oui",
    no: "Non",
    colId: "ID",
    colName: "Nom",
    colEmail: "E-mail",
    colCountry: "Pays",
    colCreated: "Créé",
    colCustomerId: "ID client",
    colStatus: "Statut",
    colTotal: "Total",
    colOrderId: "ID commande",
    colAmount: "Montant",
    colPaid: "Payé",
    colIssued: "Émis",
    colRole: "Rôle",
    colActive: "Actif",
    colRunId: "ID exécution",
    colReport: "Rapport",
    colOwner: "Propriétaire",
    colUpdated: "Mis à jour",
    colDuration: "Durée (ms)",
  },
} as const;

type Lang = keyof typeof i18n;
type I18nKey = keyof (typeof i18n)["EN"];
type Mode = "light" | "dark";

type ThemeId = "Discord" | "Turbo" | "GitHub" | "Next" | "Tailwind";

type Theme = {
  id: ThemeId;
  title: string;
  description: string;
  accent1: string;
  accent2: string;
  light: { bgA: string; bgB: string; glow1: string; glow2: string };
  dark: { bgA: string; bgB: string; glow1: string; glow2: string };
};

const THEMES: Theme[] = [
  {
    id: "Discord",
    title: "Discord",
    description: "Deep blue + soft purple glow",
    accent1: "#5865F2",
    accent2: "#A78BFA",
    light: {
      bgA: "#EAF0FF",
      bgB: "#F7F5FF",
      glow1: "rgba(88,101,242,0.24)",
      glow2: "rgba(167,139,250,0.20)",
    },
    dark: {
      bgA: "#0B1020",
      bgB: "#141B2F",
      glow1: "rgba(88,101,242,0.45)",
      glow2: "rgba(167,139,250,0.40)",
    },
  },
  {
    id: "Turbo",
    title: "Turbo",
    description: "Clean dark with neon accents",
    accent1: "#22D3EE",
    accent2: "#60A5FA",
    light: {
      bgA: "#ECFAFF",
      bgB: "#F1F7FF",
      glow1: "rgba(34,211,238,0.20)",
      glow2: "rgba(96,165,250,0.20)",
    },
    dark: {
      bgA: "#070B14",
      bgB: "#111827",
      glow1: "rgba(34,211,238,0.40)",
      glow2: "rgba(96,165,250,0.35)",
    },
  },
  {
    id: "GitHub",
    title: "GitHub",
    description: "Graphite + crisp contrast",
    accent1: "#2F81F7",
    accent2: "#7EE787",
    light: {
      bgA: "#EFF6FF",
      bgB: "#ECFDF5",
      glow1: "rgba(47,129,247,0.18)",
      glow2: "rgba(126,231,135,0.16)",
    },
    dark: {
      bgA: "#0D1117",
      bgB: "#161B22",
      glow1: "rgba(47,129,247,0.35)",
      glow2: "rgba(126,231,135,0.22)",
    },
  },
  {
    id: "Next",
    title: "Next.js",
    description: "Slate-black with subtle light",
    accent1: "#111827",
    accent2: "#60A5FA",
    light: {
      bgA: "#F6F7FB",
      bgB: "#ECF3FF",
      glow1: "rgba(226,232,240,0.26)",
      glow2: "rgba(96,165,250,0.18)",
    },
    dark: {
      bgA: "#090A0F",
      bgB: "#0F172A",
      glow1: "rgba(226,232,240,0.22)",
      glow2: "rgba(96,165,250,0.26)",
    },
  },
  {
    id: "Tailwind",
    title: "Tailwind",
    description: "Gray-blue with modern cyan",
    accent1: "#38BDF8",
    accent2: "#22C55E",
    light: {
      bgA: "#EAFBFF",
      bgB: "#F4FFF8",
      glow1: "rgba(56,189,248,0.20)",
      glow2: "rgba(34,197,94,0.14)",
    },
    dark: {
      bgA: "#0B1220",
      bgB: "#111A2E",
      glow1: "rgba(56,189,248,0.35)",
      glow2: "rgba(34,197,94,0.20)",
    },
  },
];

type NotificationType = "all" | "mentions" | "system";

type NotificationItem = {
  id: string;
  type: Exclude<NotificationType, "all">;
  titleKey: I18nKey;
  bodyKey: I18nKey;
  time: string;
  unread: boolean;
};

type ActiveView = "dashboard" | "queries" | "reports" | "overview" | "settings" | "admin";

type EntityName = "Customers" | "Orders" | "Invoices" | "Users";

type EntityField = { id: string; label: string; type: "string" | "number" | "date" | "boolean" };

type ClauseOp = "eq" | "contains" | "gt" | "lt";

type Clause = { fieldId: string; op: ClauseOp; value: string };

type SavedQuery = { id: string; name: string; entity: EntityName; clauses: Clause[]; createdAt: number };

type Report = {
  id: string;
  title: string;
  description: string;
  updated: string;
  category: "Finance" | "Security" | "Usage";
};

const ENTITY_META: Record<EntityName, { label: string; fields: EntityField[] }> = {
  Customers: {
    label: "Customers",
    fields: [
      { id: "id", label: "ID", type: "number" },
      { id: "name", label: "Name", type: "string" },
      { id: "email", label: "Email", type: "string" },
      { id: "country", label: "Country", type: "string" },
      { id: "created_at", label: "Created", type: "date" },
    ],
  },
  Orders: {
    label: "Orders",
    fields: [
      { id: "id", label: "ID", type: "number" },
      { id: "customer_id", label: "Customer ID", type: "number" },
      { id: "status", label: "Status", type: "string" },
      { id: "total", label: "Total", type: "number" },
      { id: "created_at", label: "Created", type: "date" },
    ],
  },
  Invoices: {
    label: "Invoices",
    fields: [
      { id: "id", label: "ID", type: "number" },
      { id: "order_id", label: "Order ID", type: "number" },
      { id: "amount", label: "Amount", type: "number" },
      { id: "paid", label: "Paid", type: "boolean" },
      { id: "issued_at", label: "Issued", type: "date" },
    ],
  },
  Users: {
    label: "Users",
    fields: [
      { id: "id", label: "ID", type: "number" },
      { id: "name", label: "Name", type: "string" },
      { id: "role", label: "Role", type: "string" },
      { id: "active", label: "Active", type: "boolean" },
      { id: "created_at", label: "Created", type: "date" },
    ],
  },
};

const REPORTS: Report[] = [
  {
    id: "r1",
    title: "Monthly Spend Overview",
    description: "Org-level spend grouped by cost center and environment.",
    updated: "2 days ago",
    category: "Finance",
  },
  {
    id: "r2",
    title: "SSO & MFA Adoption",
    description: "Track authentication rollout and enforcement over time.",
    updated: "6 hours ago",
    category: "Security",
  },
  {
    id: "r3",
    title: "API Usage by Module",
    description: "Requests, errors, and latency p95 across product modules.",
    updated: "1 day ago",
    category: "Usage",
  },
  {
    id: "r4",
    title: "Audit Log Exports",
    description: "Exports and downloads with actor and scope.",
    updated: "3 hours ago",
    category: "Security",
  },
];

function safeGet<T extends string>(key: string, allow: readonly T[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return (allow as readonly string[]).includes(v ?? "") ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function safeSetJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function escapeSql(input: string) {
  return input.replace(/'/g, "''");
}

function buildSql(entity: EntityName, clauses: Clause[]) {
  const table = entity.toLowerCase();
  const where = clauses
    .filter((c) => c.value.trim().length > 0)
    .map((c) => {
      const v = c.value.trim();
      if (c.op === "contains") return `${c.fieldId} ILIKE '%${escapeSql(v)}%'`;
      if (c.op === "eq") return `${c.fieldId} = '${escapeSql(v)}'`;
      if (c.op === "gt") return `${c.fieldId} > '${escapeSql(v)}'`;
      return `${c.fieldId} < '${escapeSql(v)}'`;
    })
    .join(" AND ");
  return `SELECT * FROM ${table}${where ? ` WHERE ${where}` : ""};`;
}

function buildFilterJson(entity: EntityName, clauses: Clause[]) {
  return {
    entity,
    where: clauses
      .filter((c) => c.value.trim().length > 0)
      .map((c) => ({ field: c.fieldId, op: c.op, value: c.value.trim() })),
  };
}

const __env = (globalThis as any)?.process?.env?.NODE_ENV;
if (__env === "test") {
  const sql1 = buildSql("Customers", [{ fieldId: "name", op: "contains", value: "acme" }]);
  if (!sql1.includes("FROM customers") || !sql1.includes("ILIKE")) throw new Error("buildSql test failed");
  const j1 = buildFilterJson("Orders", [{ fieldId: "status", op: "eq", value: "open" }]);
  if ((j1 as any).entity !== "Orders" || (j1 as any).where?.length !== 1) throw new Error("buildFilterJson test failed");
}

export default function App() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [mode, setMode] = useState<Mode>(() => safeGet("gs.mode", ["light", "dark"] as const, "light"));
  const [lang, setLang] = useState<Lang>(() => safeGet("gs.lang", ["EN", "DE", "FR"] as const, "EN"));
  const [active, setActive] = useState<ActiveView>(() =>
    safeGet("gs.active", ["dashboard", "queries", "reports", "overview", "settings", "admin"] as const, "dashboard")
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => safeGet("gs.sidebarCollapsed", ["0", "1"] as const, "0") === "1");
  const [themeId, setThemeId] = useState<ThemeId>(() => safeGet("gs.themeId", THEMES.map((t) => t.id) as ThemeId[], "Discord"));
  const [gridEngine, setGridEngine] = useState<GridEngine>(() => safeGet("gs.gridEngine", ["tanstack", "aggrid"] as const, "tanstack"));

  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(() => safeGetJSON<SavedQuery[]>("gs.savedQueries", []));
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeGetJSON<NotificationItem[]>("gs.notifications", [
      { id: "n1", type: "system", titleKey: "n1Title", bodyKey: "n1Body", time: "2m", unread: true },
      { id: "n2", type: "mentions", titleKey: "n2Title", bodyKey: "n2Body", time: "1h", unread: true },
      { id: "n3", type: "system", titleKey: "n3Title", bodyKey: "n3Body", time: "6h", unread: false },
      { id: "n4", type: "mentions", titleKey: "n4Title", bodyKey: "n4Body", time: "1d", unread: false },
    ])
  );

  const [aiOpen, setAiOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ id: string; role: "user" | "assistant"; text: string }>>([
    { id: uid("m"), role: "assistant", text: "Hi — I'm a UI placeholder AI. Connect me to your backend when ready." },
  ]);

  const isDark = mode === "dark";

  const t = useMemo(() => {
    return (key: I18nKey) => i18n[lang][key] ?? i18n.EN[key];
  }, [lang]);

  const theme = useMemo(() => THEMES.find((x) => x.id === themeId) ?? THEMES[0], [themeId]);
  const themeVisual = useMemo(() => (isDark ? theme.dark : theme.light), [isDark, theme]);

  const textBase = isDark ? "text-slate-50" : "text-slate-950";
  const textMuted = isDark ? "text-slate-200/70" : "text-slate-800/70";
  const textMuted2 = isDark ? "text-slate-200/55" : "text-slate-800/55";
  const placeholder = isDark ? "placeholder:text-slate-50/40" : "placeholder:text-slate-950/45";

  // Avoid a full-page tinted rectangle. The backdrop (image + vignette) sits behind,
  // while individual surfaces (header/sidebar/cards) provide the glass treatment.
  const chromeBg = "bg-transparent";
  // Keep the global shell transparent so the backdrop image remains vivid.
  // Surfaces (header/sidebar/cards) carry the glass material instead.
  const surfaceBg = "bg-transparent";

  const ring = isDark ? "ring-white/10" : "ring-black/10";
  const glass = cn("backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset", ring);

  const shellStyle = useMemo(
    () =>
      ({
        "--accent1": theme.accent1,
        "--accent2": theme.accent2,
        "--bgA": themeVisual.bgA,
        "--bgB": themeVisual.bgB,
        "--glow1": themeVisual.glow1,
        "--glow2": themeVisual.glow2,
      }) as React.CSSProperties,
    [theme, themeVisual]
  );

  const primaryNav = useMemo(
    () =>
      [
        { id: "dashboard" as const, labelKey: "navDashboard" as const, icon: LayoutDashboard },
        { id: "queries" as const, labelKey: "navQueries" as const, icon: ListFilter },
        { id: "reports" as const, labelKey: "navReports" as const, icon: FileText },
      ] as const,
    []
  );

  const secondaryNav = useMemo(
    () =>
      [
        { id: "overview" as const, labelKey: "navOverview" as const, icon: Home },
        { id: "settings" as const, labelKey: "navSettings" as const, icon: Settings },
        { id: "admin" as const, labelKey: "navAdmin" as const, icon: Cog },
      ] as const,
    []
  );

  const modules = useMemo(
    () => [
      { key: "moduleAnalytics" as const, description: "Metrics, funnels, cohorts, and real-time insights.", href: "#" },
      { key: "moduleProjects" as const, description: "Program management, roadmaps, and deliverables.", href: "#" },
      { key: "moduleBilling" as const, description: "Invoices, plans, usage, and organization spend.", href: "#" },
      { key: "moduleSecurity" as const, description: "SSO, audit logs, access policies, and compliance.", href: "#" },
      { key: "moduleIntegrations" as const, description: "Connect your tools with enterprise-grade controls.", href: "#" },
      { key: "moduleSupport" as const, description: "Runbooks, status, tickets, and SLA reporting.", href: "#" },
    ],
    []
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
    document.documentElement.lang = lang.toLowerCase();
    document.documentElement.classList.toggle("dark", isDark);

    safeSetItem("gs.mode", mode);
    safeSetItem("gs.lang", lang);
    safeSetItem("gs.sidebarCollapsed", sidebarCollapsed ? "1" : "0");
    safeSetItem("gs.themeId", themeId);
    safeSetItem("gs.gridEngine", gridEngine);
    safeSetItem("gs.active", active);
    safeSetJSON("gs.savedQueries", savedQueries);
    safeSetJSON("gs.notifications", notifications);
  }, [mode, lang, sidebarCollapsed, themeId, gridEngine, active, savedQueries, notifications, isDark]);

  const cycleLanguage = () => setLang((p) => (p === "EN" ? "DE" : p === "DE" ? "FR" : "EN"));

  const onAiSend = () => {
    const msg = aiText.trim();
    if (!msg) return;
    setAiText("");
    setAiMessages((prev) => [
      ...prev,
      { id: uid("m"), role: "user", text: msg },
      { id: uid("m"), role: "assistant", text: "(Placeholder) I can help draft a query or summarize a report." },
    ]);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("relative min-h-screen", textBase)} style={shellStyle}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `radial-gradient(1100px 700px at 18% 22%, var(--glow1), rgba(0,0,0,0) 62%), radial-gradient(900px 650px at 82% 28%, var(--glow2), rgba(0,0,0,0) 64%), url(${backdrop4k})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: isDark ? "saturate(1.05) brightness(0.95)" : "saturate(1.12) brightness(1.02)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-55 mix-blend-overlay"
          style={{ backgroundImage: `url(${NOISE_BG})`, backgroundSize: "260px 260px" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: isDark
              ? "linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.18), rgba(0,0,0,0.78))"
              : "linear-gradient(to bottom, rgba(255,255,255,0.62), rgba(255,255,255,0.20), rgba(255,255,255,0.70))",
          }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[350] focus:rounded-xl focus:bg-white/90 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow"
        >
          {t("skip")}
        </a>

        {/* Global shell: keep it light so the backdrop stays vivid; apply glass on surfaces instead. */}
        <div className={cn("relative min-h-screen w-full flex flex-col", chromeBg)}>
          <div className="relative z-[1] overflow-visible">
            <Header
              t={t}
              lang={lang}
              cycleLanguage={cycleLanguage}
              mode={mode}
              setMode={setMode}
              themeId={themeId}
              setThemeId={setThemeId}
              notifications={notifications}
              setNotifications={setNotifications}
              modules={modules}
              prefersReducedMotion={prefersReducedMotion}
              isDark={isDark}
              placeholderClass={placeholder}
            >
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl sm:hidden" aria-label={t("openNav")}>
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className={cn(
                      "w-[320px] border-none backdrop-blur-2xl",
                      isDark ? "bg-black/55 text-slate-50" : "bg-white/85 text-slate-950"
                    )}
                  >
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <LogoMark />
                        <span>{t("appName")}</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <MobileNav
                        active={active}
                        setActive={(v) => {
                          setActive(v);
                          setSelectedReportId(null);
                        }}
                        primary={primaryNav}
                        secondary={secondaryNav}
                        t={t}
                        isDark={isDark}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
            </Header>
          </div>

          <div className="relative flex-1 min-h-0 overflow-hidden">
                <div className="flex flex-1 min-h-0">
                  <motion.aside
                    className={cn("hidden sm:flex flex-col flex-shrink-0")}
                    initial={false}
                    animate={{ width: sidebarCollapsed ? 84 : 280 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 260, damping: 28, mass: 0.9 }
                    }
                    style={{ willChange: "width" }}
                  >
                    <Sidebar
                      t={t}
                      isDark={isDark}
                      textMuted2={textMuted2}
                      collapsed={sidebarCollapsed}
                      setCollapsed={setSidebarCollapsed}
                      active={active}
                      setActive={(v) => {
                        setActive(v);
                        setSelectedReportId(null);
                      }}
                      primary={primaryNav}
                      secondary={secondaryNav}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  </motion.aside>

                <main id="main" className="relative flex-1 min-h-0">
                  <div className={cn("flex h-full min-h-0 flex-col p-3 sm:p-5", surfaceBg)}>
                    <div className={cn("flex min-h-0 flex-1 flex-col rounded-3xl", isDark ? "bg-black/18" : "bg-white/70", glass)}>
                      <div className="flex-1 min-h-0 p-4 sm:p-6">
                        {active === "dashboard" && <Dashboard t={t} isDark={isDark} textMuted={textMuted} />}
                        {active === "queries" && (
                          <Queries
                            t={t}
                            isDark={isDark}
                            textMuted={textMuted}
                            placeholderClass={placeholder}
                            gridEngine={gridEngine}
                            setGridEngine={setGridEngine}
                            savedQueries={savedQueries}
                            setSavedQueries={setSavedQueries}
                          />
                        )}
                        {active === "reports" && (
                          <Reports
                            t={t}
                            isDark={isDark}
                            textMuted={textMuted}
                            placeholderClass={placeholder}
                            gridEngine={gridEngine}
                            setGridEngine={setGridEngine}
                            reports={REPORTS}
                            selectedReportId={selectedReportId}
                            setSelectedReportId={setSelectedReportId}
                          />
                        )}
                        {active === "overview" && (
                          <SimplePanel title={t("navOverview")} subtitle={t("heroSubtitle")} isDark={isDark} textMuted={textMuted} />
                        )}
                        {active === "settings" && (
                          <SimplePanel title={t("navSettings")} subtitle={t("themesSubtitle")} isDark={isDark} textMuted={textMuted} />
                        )}
                        {active === "admin" && (
                          <SimplePanel title={t("navAdmin")} subtitle={t("securityPosture")} isDark={isDark} textMuted={textMuted} />
                        )}
                      </div>
                      <footer className={cn("px-6 pb-6 pt-0 text-xs", textMuted2)}>{t("footer")}</footer>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>

        <AiAssistant
          t={t}
          isDark={isDark}
          glass={glass}
          aiOpen={aiOpen}
          setAiOpen={setAiOpen}
          aiText={aiText}
          setAiText={setAiText}
          aiMessages={aiMessages}
          onSend={onAiSend}
          placeholder={placeholder}
        />
      </div>
    </TooltipProvider>
  );
}

function LogoMark() {
  return (
    <div
      className="grid h-9 w-9 place-items-center rounded-2xl text-white"
      style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}
      aria-hidden
    >
      <Sparkles className="h-4 w-4" />
    </div>
  );
}

function Header(props: {
  t: (k: I18nKey) => string;
  lang: Lang;
  cycleLanguage: () => void;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeId: ThemeId;
  setThemeId: React.Dispatch<React.SetStateAction<ThemeId>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  modules: Array<{ key: I18nKey; description: string; href: string }>;
  prefersReducedMotion: boolean;
  isDark: boolean;
  placeholderClass: string;
  children?: React.ReactNode;
}) {
  const {
    t,
    lang,
    cycleLanguage,
    mode,
    setMode,
    themeId,
    setThemeId,
    notifications,
    setNotifications,
    modules,
    prefersReducedMotion,
    isDark,
    placeholderClass,
    children,
  } = props;

  const [notifTab, setNotifTab] = useState<NotificationType>("all");
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const controlsGroup = cn(
    "flex items-center gap-1 rounded-3xl px-2 py-2 ring-1 ring-inset backdrop-blur-2xl",
    isDark ? "bg-white/8 ring-white/12" : "bg-white/75 ring-black/10"
  );

  const iconBtn = cn(
    "h-10 w-10 rounded-2xl p-0 bg-transparent transition-colors",
    isDark ? "text-slate-50 hover:bg-white/12" : "text-slate-950 hover:bg-black/5"
  );

  const userBtn = cn(
    "h-10 rounded-2xl px-2 bg-transparent transition-colors",
    isDark ? "text-slate-50 hover:bg-white/12" : "text-slate-950 hover:bg-black/5"
  );

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <header className="sticky top-0 z-[200] px-3 py-3 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          {children}
          <div className="flex items-center gap-2">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-sm font-semibold">{t("appName")}</div>
              <div className={cn("text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{t("appTagline")}</div>
            </div>
          </div>
        </div>

        <div className="mx-auto hidden max-w-[760px] flex-1 sm:block">
          <div
            className={cn(
              "flex items-center gap-2 rounded-3xl px-3 py-2 ring-1 ring-inset",
              isDark ? "bg-white/8 ring-white/12" : "bg-white/75 ring-black/10",
              "backdrop-blur-2xl"
            )}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-10 rounded-2xl px-3 ring-1 ring-inset transition",
                    isDark
                      ? "bg-white/6 ring-white/12 hover:bg-white/10 text-slate-50"
                      : "bg-black/5 ring-black/10 hover:bg-black/10 text-slate-950"
                  )}
                  aria-label={t("modules")}
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {t("modules")}
                    <ChevronDown className="ml-1 h-4 w-4 opacity-70" aria-hidden />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className={cn(
                  "z-[260] w-[760px] max-w-[92vw] p-4 backdrop-blur-2xl ring-1 ring-inset",
                  isDark ? "ring-white/12" : "ring-black/10"
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-sm font-semibold">{t("browseModules")}</div>
                    <div className={cn("mt-1 text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{t("browseModulesDesc")}</div>
                  </div>
                  <Button variant="secondary" className="rounded-2xl">
                    {t("viewAll")}
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {modules.map((m) => (
                    <a
                      key={m.key}
                      href={m.href}
                      className={cn(
                        "group rounded-2xl p-4 ring-1 ring-inset transition",
                        isDark ? "bg-white/6 ring-white/12 hover:bg-white/10" : "bg-black/5 ring-black/10 hover:bg-black/10"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold">{t(m.key)}</div>
                          <div className={cn("mt-1 text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{m.description}</div>
                        </div>
                        <span
                          className={cn("mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl", isDark ? "bg-white/10" : "bg-white/70")}
                          aria-hidden
                        >
                          <ChevronDown className="h-4 w-4 rotate-[-90deg] opacity-70 transition group-hover:opacity-100" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <QuickLink icon={<FileText className="h-4 w-4" />} label={t("docs")} isDark={isDark} />
                  <QuickLink icon={<Sparkles className="h-4 w-4" />} label={t("changelog")} isDark={isDark} />
                  <div className={cn("rounded-2xl p-4 ring-1 ring-inset", isDark ? "bg-white/6 ring-white/12" : "bg-black/5 ring-black/10")}>
                    <div className="text-xs font-semibold">{t("tip")}</div>
                    <div className={cn("mt-1 text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{t("tipText")}</div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className={cn("mx-1 h-7 w-px", isDark ? "bg-white/12" : "bg-black/10")} aria-hidden />

            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 opacity-70" aria-hidden />
              <Input
                className={cn("h-10 flex-1 border-none bg-transparent px-2 ring-0 focus-visible:ring-0", placeholderClass)}
                placeholder={t("searchGlobal")}
                aria-label={t("searchGlobal")}
              />
            </div>
          </div>
        </div>

        <div className={cn("ml-auto", controlsGroup)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={cn(iconBtn, "rounded-full")} onClick={cycleLanguage} aria-label={t("language")}>
                <Globe className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t("language")}: {lang}
            </TooltipContent>
          </Tooltip>

          <div className={cn("mx-1 h-6 w-px", isDark ? "bg-white/12" : "bg-black/10")} aria-hidden />

          <ThemeMenu
            t={t}
            isDark={isDark}
            mode={mode}
            setMode={setMode}
            themeId={themeId}
            setThemeId={setThemeId}
            triggerClassName={iconBtn}
          />

          <NotificationsMenu
            t={t}
            isDark={isDark}
            chromeBtn={iconBtn}
            unreadCount={unreadCount}
            notifTab={notifTab}
            setNotifTab={setNotifTab}
            notifications={notifications}
            markAllRead={markAllRead}
          />

          <div className={cn("mx-1 h-6 w-px", isDark ? "bg-white/12" : "bg-black/10")} aria-hidden />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(userBtn, "gap-2")} aria-label={t("openUserMenu")}>
                <Avatar className="h-7 w-7">
                  <AvatarImage src="https://i.pravatar.cc/64?img=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "w-48 border-none backdrop-blur-2xl",
                isDark ? "bg-black/60 text-slate-50" : "bg-white/92 text-slate-950"
              )}
            >
              <DropdownMenuLabel className="text-xs">{t("profile")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 block sm:hidden">
        <div
          className={cn(
            "flex items-center gap-2 rounded-3xl px-3 py-2 ring-1 ring-inset",
            isDark ? "bg-white/8 ring-white/12" : "bg-white/75 ring-black/10",
            "backdrop-blur-2xl"
          )}
        >
          <Search className="h-4 w-4 opacity-70" aria-hidden />
          <Input
            className={cn("h-10 flex-1 border-none bg-transparent px-2 ring-0 focus-visible:ring-0", placeholderClass)}
            placeholder={t("searchGlobal")}
            aria-label={t("searchGlobal")}
          />
          <span className={cn("h-8 w-px", isDark ? "bg-white/12" : "bg-black/10")} aria-hidden />
          <span className={cn("text-xs font-semibold", isDark ? "text-slate-100" : "text-slate-950")}>{t("modules")}</span>
        </div>
      </div>

      {!prefersReducedMotion && (
        <motion.div
          className="mt-4 h-px w-full"
          style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0, scaleX: 0.9 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.35 }}
        />
      )}
    </header>
  );
}

function ThemeMenu(props: {
  t: (k: I18nKey) => string;
  isDark: boolean;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeId: ThemeId;
  setThemeId: React.Dispatch<React.SetStateAction<ThemeId>>;
  triggerClassName?: string;
}) {
  const { t, isDark, mode, setMode, themeId, setThemeId, triggerClassName } = props;

  const chromeBtn =
    triggerClassName ??
    cn(
      "h-10 w-10 rounded-2xl p-0 border-none ring-1 ring-inset transition-colors",
      isDark
        ? "bg-white/10 ring-white/15 hover:bg-white/15 text-slate-50"
        : "bg-white/75 ring-black/10 hover:bg-white/85 text-slate-950"
    );

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button className={chromeBtn} aria-label={t("theme")}>
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("theme")}</TooltipContent>
      </Tooltip>
      <PopoverContent
        align="end"
        className={cn(
        "w-[380px] border-none p-4 backdrop-blur-2xl ring-1 ring-inset",
          isDark ? "bg-black/60 ring-white/12 text-slate-50" : "bg-white/92 ring-black/10 text-slate-950"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{t("themesTitle")}</div>
            <div className={cn("mt-1 text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{t("themesSubtitle")}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={mode === "light" ? "secondary" : "ghost"} className="h-9 rounded-2xl" onClick={() => setMode("light")}>
              <Sun className="mr-2 h-4 w-4" />
              {t("light")}
            </Button>
            <Button variant={mode === "dark" ? "secondary" : "ghost"} className="h-9 rounded-2xl" onClick={() => setMode("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              {t("dark")}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => setThemeId(th.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl p-3 text-left ring-1 ring-inset transition",
                themeId === th.id
                  ? isDark
                    ? "bg-white/12 ring-white/18"
                    : "bg-black/10 ring-black/15"
                  : isDark
                    ? "bg-white/6 ring-white/12 hover:bg-white/10"
                    : "bg-black/5 ring-black/10 hover:bg-black/10"
              )}
              aria-pressed={themeId === th.id}
            >
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-xl" style={{ background: `linear-gradient(135deg, ${th.accent1}, ${th.accent2})` }} aria-hidden />
                <div>
                  <div className="text-sm font-semibold">{th.title}</div>
                  <div className={cn("text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{th.description}</div>
                </div>
              </div>
              {themeId === th.id && <span className={cn("text-xs", isDark ? "text-slate-200/70" : "text-slate-800/70")}>✓</span>}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationsMenu(props: {
  t: (k: I18nKey) => string;
  isDark: boolean;
  chromeBtn: string;
  unreadCount: number;
  notifTab: NotificationType;
  setNotifTab: React.Dispatch<React.SetStateAction<NotificationType>>;
  notifications: NotificationItem[];
  markAllRead: () => void;
}) {
  const { t, isDark, chromeBtn, unreadCount, notifTab, setNotifTab, notifications, markAllRead } = props;

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button className={cn(chromeBtn, "relative h-10 w-10 rounded-2xl p-0")} aria-label={t("notifications")}>
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}
                >
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("notifications")}</TooltipContent>
      </Tooltip>
      <PopoverContent
        align="end"
        className={cn(
        "w-[420px] border-none p-4 backdrop-blur-2xl ring-1 ring-inset",
          isDark ? "bg-black/60 ring-white/12 text-slate-50" : "bg-white/92 ring-black/10 text-slate-950"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">{t("notificationsTitle")}</div>
            <div className={cn("mt-1 text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>
              {unreadCount ? `${unreadCount} ${t("unread")}` : t("notificationsEmpty")}
            </div>
          </div>
          <Button variant="secondary" className="h-9 rounded-2xl" onClick={markAllRead}>
            {t("notificationsMarkAll")}
          </Button>
        </div>

        <div className="mt-3 flex gap-2">
          <SegmentButton active={notifTab === "all"} onClick={() => setNotifTab("all")} label={t("notificationsAll")} isDark={isDark} />
          <SegmentButton active={notifTab === "mentions"} onClick={() => setNotifTab("mentions")} label={t("notificationsMentions")} isDark={isDark} />
          <SegmentButton active={notifTab === "system"} onClick={() => setNotifTab("system")} label={t("notificationsSystem")} isDark={isDark} />
        </div>

        <div className="mt-3 grid gap-2">
          {notifications
            .filter((n) => (notifTab === "all" ? true : n.type === notifTab))
            .map((n) => (
              <div
                key={n.id}
                className={cn("rounded-2xl p-3 ring-1 ring-inset", isDark ? "bg-white/6 ring-white/12" : "bg-black/5 ring-black/10")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">{t(n.titleKey)}</div>
                      {n.unread && (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className={cn("mt-1 text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{t(n.bodyKey)}</div>
                  </div>
                  <div className={cn("text-xs", isDark ? "text-slate-200/55" : "text-slate-800/55")}>{n.time}</div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-3 flex justify-end">
          <Button variant="ghost" className="rounded-2xl">
            {t("notificationsViewAll")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function QuickLink({ icon, label, isDark }: { icon: React.ReactNode; label: string; isDark: boolean }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-2 rounded-2xl p-4 ring-1 ring-inset",
        isDark ? "bg-white/6 ring-white/12 hover:bg-white/10" : "bg-black/5 ring-black/10 hover:bg-black/10"
      )}
    >
      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl", isDark ? "bg-white/10" : "bg-white/70")}>{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </a>
  );
}

function SegmentButton({ active, onClick, label, isDark }: { active: boolean; onClick: () => void; label: string; isDark: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 flex-1 rounded-2xl px-3 text-sm font-medium ring-1 ring-inset transition",
        active
          ? isDark
            ? "bg-white/14 ring-white/18"
            : "bg-black/10 ring-black/15"
          : isDark
            ? "bg-white/6 ring-white/12 hover:bg-white/10"
            : "bg-black/5 ring-black/10 hover:bg-black/10"
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function Sidebar(props: {
  t: (k: I18nKey) => string;
  isDark: boolean;
  textMuted2: string;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  active: ActiveView;
  setActive: (v: ActiveView) => void;
  primary: readonly { id: ActiveView; labelKey: I18nKey; icon: React.ComponentType<{ className?: string }> }[];
  secondary: readonly { id: ActiveView; labelKey: I18nKey; icon: React.ComponentType<{ className?: string }> }[];
  prefersReducedMotion: boolean;
}) {
  const { t, isDark, textMuted2, collapsed, setCollapsed, active, setActive, primary, secondary } = props;

  return (
    <div className={cn("h-full min-h-0 pb-4 pt-2", collapsed ? "px-2" : "px-3")}>
      <div
        className={cn(
          "flex h-full min-h-0 flex-col rounded-3xl p-2 overflow-hidden",
          isDark ? "bg-white/8" : "bg-white/38",
          "backdrop-blur-2xl ring-1 ring-inset",
          isDark ? "ring-white/10" : "ring-black/10"
        )}
      >
        <div className={cn("flex items-center justify-between px-2 py-2", collapsed && "px-1")}>
          <div className={cn("text-xs font-semibold uppercase tracking-wide", textMuted2, collapsed && "sr-only")}>{t("workspace")}</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9 hover:bg-white/20", isDark ? "bg-white/10" : "bg-white/70", collapsed ? "rounded-xl" : "rounded-2xl")}
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? t("sidebarExpand") : t("sidebarCollapse")}
                aria-pressed={collapsed}
              >
                {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{collapsed ? t("sidebarExpand") : t("sidebarCollapse")}</TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className={cn("flex-1 min-h-0", collapsed ? "pr-0" : "pr-2")}>
          <div className={cn("space-y-1 px-1 pb-2", collapsed && "px-0")}>
            {primary.map((it) => (
              <SidebarButton
                key={it.id}
                label={t(it.labelKey)}
                active={active === it.id}
                onClick={() => setActive(it.id)}
                icon={it.icon}
                collapsed={collapsed}
                isDark={isDark}
              />
            ))}

            <div className={cn("my-2", collapsed ? "px-2" : "px-3")}>
              <div className={cn("h-px", isDark ? "bg-white/10" : "bg-black/10")} />
            </div>

            {secondary.map((it) => (
              <SidebarButton
                key={it.id}
                label={t(it.labelKey)}
                active={active === it.id}
                onClick={() => setActive(it.id)}
                icon={it.icon}
                collapsed={collapsed}
                isDark={isDark}
              />
            ))}
          </div>
        </ScrollArea>

        <div className={cn("mt-3 px-2", collapsed && "px-1")}>
          <div className={cn("rounded-3xl p-3 backdrop-blur-xl", isDark ? "bg-white/10" : "bg-white/70")}>
            <div className="flex items-start justify-between gap-3">
              <div className={cn(collapsed && "sr-only")}>
                <div className="text-sm font-semibold">{t("securityPosture")}</div>
                <div className={cn("text-xs", textMuted2)}>{t("ssoEnabled")}</div>
              </div>
              {collapsed ? (
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}
                  aria-hidden
                >
                  <Globe className="h-4 w-4" />
                </div>
              ) : (
                <Globe className="h-5 w-5 opacity-80" aria-hidden />
              )}
            </div>

            <div className={cn("mt-3 flex gap-2", collapsed && "mt-2")}>
              {!collapsed && (
                <Button variant="secondary" className="h-9 flex-1 rounded-2xl">
                  {t("review")}
                </Button>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn("h-9 hover:bg-white/20", isDark ? "bg-white/10" : "bg-white/70", collapsed ? "w-full rounded-xl" : "rounded-2xl")}
                    aria-label={t("settings")}
                  >
                    <Cog className="h-4 w-4" />
                    <span className="sr-only">{t("settings")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("settings")}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function SidebarButton(props: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  isDark: boolean;
}) {
  const { label, active, onClick, icon: Icon, collapsed, isDark } = props;

  const base = cn(
    "flex w-full items-center gap-3 rounded-2xl text-left text-sm font-medium ring-1 ring-inset transition",
    isDark ? "ring-white/10" : "ring-black/10",
    active ? (isDark ? "bg-white/12" : "bg-black/10") : isDark ? "bg-white/6 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          onClick={onClick}
          aria-label={collapsed ? label : undefined}
          aria-current={active ? "page" : undefined}
          className={cn(
            base,
            "h-11",
            collapsed ? "justify-center px-0" : "px-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent1)]/60"
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 520, damping: 32, mass: 0.6 }}
          style={{ willChange: "transform" }}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <AnimatePresence initial={false} mode="popLayout">
            {!collapsed && (
              <motion.span
                key="label"
                className="truncate"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.14 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>
      {collapsed ? <TooltipContent>{label}</TooltipContent> : null}
    </Tooltip>
  );
}

function MobileNav(props: {
  active: ActiveView;
  setActive: (v: ActiveView) => void;
  primary: readonly { id: ActiveView; labelKey: I18nKey; icon: React.ComponentType<{ className?: string }> }[];
  secondary: readonly { id: ActiveView; labelKey: I18nKey; icon: React.ComponentType<{ className?: string }> }[];
  t: (k: I18nKey) => string;
  isDark: boolean;
}) {
  const { active, setActive, primary, secondary, t, isDark } = props;
  return (
    <div className="space-y-2">
      {[...primary, ...secondary].map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => setActive(it.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ring-1",
              isDark ? "ring-white/10" : "ring-black/10",
              isActive ? (isDark ? "bg-white/12" : "bg-black/10") : isDark ? "bg-white/6" : "bg-black/5"
            )}
          >
            <Icon className="h-5 w-5" />
            {t(it.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

function SimplePanel(props: { title: string; subtitle: string; isDark: boolean; textMuted: string }) {
  const { title, subtitle, isDark, textMuted } = props;
  return (
    <div>
      <div className="text-2xl font-semibold">{title}</div>
      <div className={cn("mt-1", textMuted)}>{subtitle}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          <div className="text-sm font-semibold">{title}</div>
          <div className={cn("mt-2 text-sm", textMuted)}>Placeholder content panel.</div>
        </div>
        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          <div className="text-sm font-semibold">{title}</div>
          <div className={cn("mt-2 text-sm", textMuted)}>Another panel for future settings.</div>
        </div>
      </div>

    </div>
  );
}

function Dashboard(props: { t: (k: I18nKey) => string; isDark: boolean; textMuted: string }) {
  const { t, isDark, textMuted } = props;

  const Card = ({ title, subtitle, body }: { title: string; subtitle: string; body: string }) => (
    <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
      <div className="text-sm font-semibold">{title}</div>
      <div className={cn("mt-1 text-xs", textMuted)}>{subtitle}</div>
      <div className="mt-4 text-sm">{body}</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold">{t("navDashboard")}</div>
          <div className={cn("mt-1", textMuted)}>{t("heroSubtitle")}</div>
        </div>
        <div className="mt-3 flex gap-2 sm:mt-0">
          <Button variant="secondary" className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" />
            {t("create")}
          </Button>
          <Button className="rounded-2xl" style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}>
            {t("export")}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <Card title={t("cardHealth")} subtitle={t("cardHealthSub")} body={t("uptime")} />
        <Card title={t("cardUsage")} subtitle={t("cardUsageSub")} body={t("usageMetrics")} />
        <Card title={t("cardSecurity")} subtitle={t("cardSecuritySub")} body={t("securityMetrics")} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          <div className="text-sm font-semibold">{t("activity")}</div>
          <div className={cn("mt-1 text-xs", textMuted)}>{t("activitySub")}</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li className={cn("rounded-2xl p-3", isDark ? "bg-white/6" : "bg-white/70")}>{t("activity1")}</li>
            <li className={cn("rounded-2xl p-3", isDark ? "bg-white/6" : "bg-white/70")}>{t("activity2")}</li>
            <li className={cn("rounded-2xl p-3", isDark ? "bg-white/6" : "bg-white/70")}>{t("activity3")}</li>
          </ul>
        </div>

        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          <div className="text-sm font-semibold">{t("quickActions")}</div>
          <div className={cn("mt-1 text-xs", textMuted)}>{t("quickActionsSub")}</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" className="justify-start rounded-2xl">
              {t("inviteMembers")}
            </Button>
            <Button variant="secondary" className="justify-start rounded-2xl">
              {t("configureSSO")}
            </Button>
            <Button variant="secondary" className="justify-start rounded-2xl">
              {t("setPolicies")}
            </Button>
            <Button variant="secondary" className="justify-start rounded-2xl">
              {t("alerts")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Queries(props: {
  t: (k: I18nKey) => string;
  isDark: boolean;
  textMuted: string;
  placeholderClass: string;
  gridEngine: GridEngine;
  setGridEngine: React.Dispatch<React.SetStateAction<GridEngine>>;
  savedQueries: SavedQuery[];
  setSavedQueries: React.Dispatch<React.SetStateAction<SavedQuery[]>>;
}) {
  const { t, isDark, textMuted, placeholderClass, gridEngine, setGridEngine, savedQueries, setSavedQueries } = props;

  const [name, setName] = useState("");
  const [entity, setEntity] = useState<EntityName>("Customers");
  const [clauses, setClauses] = useState<Clause[]>([{ fieldId: "name", op: "contains", value: "" }]);
  const [resultsCount, setResultsCount] = useState<number | null>(null);

  const fields = ENTITY_META[entity].fields;

  const sql = useMemo(() => buildSql(entity, clauses), [entity, clauses]);
  const json = useMemo(() => buildFilterJson(entity, clauses), [entity, clauses]);

  const resultRows = useMemo(() => {
    const n = Math.max(200, resultsCount ?? 1200);
    return makeQueryRows(entity as any, n, `${entity}:${sql}`) as Array<CustomerRow | OrderRow | InvoiceRow | UserRow>;
  }, [entity, resultsCount, sql]);

  const boolChip = (on: boolean) =>
    cn(
      "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1",
      on
        ? isDark
          ? "bg-emerald-500/20 text-emerald-100 ring-emerald-400/20"
          : "bg-emerald-500/15 text-emerald-900 ring-emerald-600/20"
        : isDark
          ? "bg-white/10 text-slate-200/80 ring-white/10"
          : "bg-black/5 text-slate-700 ring-black/10"
    );

  const queryColumns = useMemo<ColumnDef<any>[]>(() => {
    if (entity === "Customers") {
      return [
        { accessorKey: "id", header: t("colId"), size: 90 },
        { accessorKey: "name", header: t("colName"), size: 220 },
        { accessorKey: "email", header: t("colEmail"), size: 260 },
        { accessorKey: "country", header: t("colCountry"), size: 160 },
        { accessorKey: "created_at", header: t("colCreated"), size: 150 },
      ];
    }
    if (entity === "Orders") {
      return [
        { accessorKey: "id", header: t("colId"), size: 90 },
        { accessorKey: "customer_id", header: t("colCustomerId"), size: 150 },
        { accessorKey: "status", header: t("colStatus"), size: 150 },
        {
          accessorKey: "total",
          header: t("colTotal"),
          size: 140,
          cell: ({ getValue }) => {
            const v = Number(getValue() ?? 0);
            return <span className="font-semibold">${v.toFixed(2)}</span>;
          },
        },
        { accessorKey: "created_at", header: t("colCreated"), size: 150 },
      ];
    }
    if (entity === "Invoices") {
      return [
        { accessorKey: "id", header: t("colId"), size: 90 },
        { accessorKey: "order_id", header: t("colOrderId"), size: 150 },
        {
          accessorKey: "amount",
          header: t("colAmount"),
          size: 140,
          cell: ({ getValue }) => {
            const v = Number(getValue() ?? 0);
            return <span className="font-semibold">${v.toFixed(2)}</span>;
          },
        },
        {
          accessorKey: "paid",
          header: t("colPaid"),
          size: 130,
          cell: ({ getValue }) => {
            const on = Boolean(getValue());
            return <span className={boolChip(on)}>{on ? t("yes") : t("no")}</span>;
          },
        },
        { accessorKey: "issued_at", header: t("colIssued"), size: 150 },
      ];
    }
    return [
      { accessorKey: "id", header: t("colId"), size: 90 },
      { accessorKey: "name", header: t("colName"), size: 220 },
      { accessorKey: "role", header: t("colRole"), size: 170 },
      {
        accessorKey: "active",
        header: t("colActive"),
        size: 140,
        cell: ({ getValue }) => {
          const on = Boolean(getValue());
          return <span className={boolChip(on)}>{on ? t("yes") : t("no")}</span>;
        },
      },
      { accessorKey: "created_at", header: t("colCreated"), size: 150 },
    ];
  }, [entity, isDark, t]);

  const queryAgCols = useMemo<ColDef<any>[]>(() => {
    if (entity === "Customers") {
      return [
        { field: "id", headerName: t("colId"), width: 110 },
        { field: "name", headerName: t("colName"), minWidth: 200 },
        { field: "email", headerName: t("colEmail"), minWidth: 260 },
        { field: "country", headerName: t("colCountry"), minWidth: 160 },
        { field: "created_at", headerName: t("colCreated"), minWidth: 160 },
      ];
    }
    if (entity === "Orders") {
      return [
        { field: "id", headerName: t("colId"), width: 110 },
        { field: "customer_id", headerName: t("colCustomerId"), minWidth: 160 },
        { field: "status", headerName: t("colStatus"), minWidth: 160 },
        { field: "total", headerName: t("colTotal"), minWidth: 160, valueFormatter: (p) => `$${Number(p.value ?? 0).toFixed(2)}` },
        { field: "created_at", headerName: t("colCreated"), minWidth: 160 },
      ];
    }
    if (entity === "Invoices") {
      return [
        { field: "id", headerName: t("colId"), width: 110 },
        { field: "order_id", headerName: t("colOrderId"), minWidth: 160 },
        { field: "amount", headerName: t("colAmount"), minWidth: 160, valueFormatter: (p) => `$${Number(p.value ?? 0).toFixed(2)}` },
        {
          field: "paid",
          headerName: t("colPaid"),
          minWidth: 140,
          valueFormatter: (p) => (p.value ? t("yes") : t("no")),
        },
        { field: "issued_at", headerName: t("colIssued"), minWidth: 160 },
      ];
    }
    return [
      { field: "id", headerName: t("colId"), width: 110 },
      { field: "name", headerName: t("colName"), minWidth: 220 },
      { field: "role", headerName: t("colRole"), minWidth: 180 },
      { field: "active", headerName: t("colActive"), minWidth: 140, valueFormatter: (p) => (p.value ? t("yes") : t("no")) },
      { field: "created_at", headerName: t("colCreated"), minWidth: 160 },
    ];
  }, [entity, t]);

  const addFilter = () => {
    const firstField = fields[0]?.id ?? "id";
    setClauses((p) => [...p, { fieldId: firstField, op: "eq", value: "" }]);
  };

  const removeFilter = (idx: number) => setClauses((p) => p.filter((_, i) => i !== idx));

  const run = () => {
    const seed = clauses.reduce((acc, c) => acc + c.value.length, 0);
    const count = Math.max(0, (seed * 17) % 137);
    setResultsCount(count);
  };

  const save = () => {
    const trimmed = name.trim();
    const q: SavedQuery = {
      id: uid("q"),
      name: trimmed || `${ENTITY_META[entity].label} query`,
      entity,
      clauses,
      createdAt: Date.now(),
    };
    setSavedQueries((p) => [q, ...p].slice(0, 25));
    setName("");
  };

  const load = (q: SavedQuery) => {
    setName(q.name);
    setEntity(q.entity);
    setClauses(q.clauses);
    setResultsCount(null);
  };

  const del = (id: string) => setSavedQueries((p) => p.filter((x) => x.id !== id));

  const gridToggle = (
    <GridEngineToggle
      engine={gridEngine}
      setEngine={(v) => setGridEngine(v)}
      isDark={isDark}
      label={t("gridEngine")}
      tanstackLabel={t("gridTanstack")}
      agLabel={t("gridAgGrid")}
    />
  );

  const selectClass = cn("h-10 w-full rounded-2xl border-none px-3 text-sm ring-1", isDark ? "bg-white/10 ring-white/12" : "bg-white/85 ring-black/10");

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold">{t("queriesTitle")}</div>
          <div className={cn("mt-1", textMuted)}>{t("queriesSubtitle")}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr,0.9fr]">
        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className={cn("text-xs font-semibold", textMuted)}>{t("queryName")}</div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn("mt-1 h-10 rounded-2xl border-none ring-1", isDark ? "bg-white/10 ring-white/10" : "bg-white/85 ring-black/10", placeholderClass)}
                placeholder={t("queryName")}
                aria-label={t("queryName")}
              />
            </div>
            <div>
              <div className={cn("text-xs font-semibold", textMuted)}>{t("entity")}</div>
              <select className={cn(selectClass, "mt-1")} value={entity} onChange={(e) => setEntity(e.target.value as EntityName)} aria-label={t("entity")}>
                {Object.keys(ENTITY_META).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-semibold">{t("filters")}</div>
            <Button variant="secondary" className="rounded-2xl" onClick={addFilter}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addFilter")}
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {clauses.map((c, idx) => (
              <div
                key={`${idx}-${c.fieldId}`}
                className={cn("grid gap-2 rounded-2xl p-3 ring-1", isDark ? "bg-white/6 ring-white/10" : "bg-white/75 ring-black/10", "sm:grid-cols-[1fr,0.9fr,1fr,44px]")}
              >
                <div>
                  <div className={cn("text-xs font-semibold", textMuted)}>{t("field")}</div>
                  <select
                    className={cn(selectClass, "mt-1")}
                    value={c.fieldId}
                    onChange={(e) => setClauses((p) => p.map((x, i) => (i === idx ? { ...x, fieldId: e.target.value } : x)))}
                    aria-label={t("field")}
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className={cn("text-xs font-semibold", textMuted)}>{t("operator")}</div>
                  <select
                    className={cn(selectClass, "mt-1")}
                    value={c.op}
                    onChange={(e) => setClauses((p) => p.map((x, i) => (i === idx ? { ...x, op: e.target.value as ClauseOp } : x)))}
                    aria-label={t("operator")}
                  >
                    <option value="eq">=</option>
                    <option value="contains">contains</option>
                    <option value="gt">&gt;</option>
                    <option value="lt">&lt;</option>
                  </select>
                </div>

                <div>
                  <div className={cn("text-xs font-semibold", textMuted)}>{t("value")}</div>
                  <Input
                    value={c.value}
                    onChange={(e) => setClauses((p) => p.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)))}
                    className={cn("mt-1 h-10 rounded-2xl border-none ring-1", isDark ? "bg-white/10 ring-white/10" : "bg-white/85 ring-black/10", placeholderClass)}
                    placeholder={t("value")}
                    aria-label={t("value")}
                  />
                </div>

                <div className="flex items-end justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-2xl", isDark ? "bg-white/6 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")} onClick={() => removeFilter(idx)} aria-label={t("remove")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("remove")}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" className="rounded-2xl" onClick={run}>
              {t("runQuery")}
            </Button>
            <Button className="rounded-2xl text-white" onClick={save} style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}>
              {t("saveQuery")}
            </Button>
            {resultsCount !== null && (
              <div className={cn("ml-auto rounded-2xl px-3 py-2 text-sm ring-1", isDark ? "bg-white/6 ring-white/10" : "bg-white/75 ring-black/10")}>
                {t("resultsCount")}: <span className="font-semibold">{resultsCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
            <div className="text-sm font-semibold">{t("queryPreview")}</div>
            <div className="mt-3 grid gap-3">
              <div className={cn("rounded-2xl p-3 ring-1", isDark ? "bg-black/25 ring-white/10" : "bg-white/70 ring-black/10")}>
                <div className={cn("text-xs font-semibold", textMuted)}>{t("querySqlPreview")}</div>
                <pre className={cn("mt-2 whitespace-pre-wrap text-xs", isDark ? "text-slate-100" : "text-slate-950")}>{sql}</pre>
              </div>
              <div className={cn("rounded-2xl p-3 ring-1", isDark ? "bg-black/25 ring-white/10" : "bg-white/70 ring-black/10")}>
                <div className={cn("text-xs font-semibold", textMuted)}>{t("queryJsonPreview")}</div>
                <pre className={cn("mt-2 whitespace-pre-wrap text-xs", isDark ? "text-slate-100" : "text-slate-950")}>{JSON.stringify(json, null, 2)}</pre>
              </div>
            </div>
          </div>

          <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{t("savedQueries")}</div>
              <span className={cn("text-xs", textMuted)}>{savedQueries.length}/25</span>
            </div>
            <div className="mt-3 grid gap-2">
              {savedQueries.length === 0 ? (
                <div className={cn("rounded-2xl p-3 text-sm", isDark ? "bg-white/6" : "bg-white/70")}>{t("noSavedQueries")}</div>
              ) : (
                savedQueries.map((q) => (
                  <div key={q.id} className={cn("flex items-center justify-between gap-2 rounded-2xl p-3 ring-1", isDark ? "bg-white/6 ring-white/10" : "bg-white/70 ring-black/10")}>
                    <div>
                      <div className="text-sm font-semibold">{q.name}</div>
                      <div className={cn("text-xs", textMuted)}>
                        {q.entity} • {q.clauses.filter((c) => c.value.trim()).length} filters
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" className="h-9 rounded-2xl" onClick={() => load(q)}>
                        {t("load")}
                      </Button>
                      <Button variant="ghost" className="h-9 rounded-2xl" onClick={() => del(q.id)}>
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {gridEngine === "tanstack" ? (
          <TanstackVirtualGrid
            title={t("queryResultsTitle")}
            subtitle={t("queryResultsSubtitle")}
            headerRight={gridToggle}
            data={resultRows as any[]}
            columns={queryColumns}
            isDark={isDark}
            textMuted={textMuted}
            placeholderClass={placeholderClass}
            searchPlaceholder={t("gridSearchRows")}
            rowsLabel={t("rows")}
            height={460}
          />
        ) : (
          <AgGridPanel
            title={t("queryResultsTitle")}
            subtitle={t("queryResultsSubtitle")}
            headerRight={gridToggle}
            isDark={isDark}
            textMuted={textMuted}
            rowData={resultRows as any[]}
            columnDefs={queryAgCols}
            placeholderClass={placeholderClass}
            searchPlaceholder={t("gridSearchRows")}
            rowsLabel={t("rows")}
            selectedLabel={t("selected")}
            uiText={{
              options: t("agOptions"),
              optionsTooltip: t("agOptionsTooltip"),
              menuGrid: t("agMenuGrid"),
              menuPageSize: t("agMenuPageSize"),
              density: t("agDensity"),
              comfortable: t("agComfortable"),
              compact: t("agCompact"),
              autoSizeColumns: t("agAutoSize"),
              exportCsv: t("agExportCsv"),
              resetGrid: t("agReset"),
              noRows: t("agNoRows"),
            }}
            height={460}
            ariaLabel={t("queryResultsTitle")}
          />
        )}
      </div>
    </div>
  );
}

function Reports(props: {
  t: (k: I18nKey) => string;
  isDark: boolean;
  textMuted: string;
  placeholderClass: string;
  gridEngine: GridEngine;
  setGridEngine: React.Dispatch<React.SetStateAction<GridEngine>>;
  reports: Report[];
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
}) {
  const { t, isDark, textMuted, placeholderClass, gridEngine, setGridEngine, reports, selectedReportId, setSelectedReportId } = props;

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return reports;
    return reports.filter((r) => r.title.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
  }, [q, reports]);

  const selected = useMemo(() => reports.find((r) => r.id === selectedReportId) ?? null, [reports, selectedReportId]);

  const reportId = selected?.id ?? "all";
  const reportRows = useMemo(() => makeReportRunRows(reportId, 1600, reportId) as ReportRunRow[], [reportId]);

  const reportColumns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: "run_id", header: t("colRunId"), size: 160 },
      { accessorKey: "report", header: t("colReport"), size: 260 },
      { accessorKey: "owner", header: t("colOwner"), size: 180 },
      { accessorKey: "updated", header: t("colUpdated"), size: 160 },
      { accessorKey: "duration_ms", header: t("colDuration"), size: 150, cell: ({ getValue }) => <span className="font-semibold">{Number(getValue() ?? 0)}</span> },
    ],
    [t]
  );

  const reportAgCols = useMemo<ColDef<any>[]>(
    () => [
      { field: "run_id", headerName: t("colRunId"), minWidth: 180 },
      { field: "report", headerName: t("colReport"), minWidth: 240 },
      { field: "owner", headerName: t("colOwner"), minWidth: 180 },
      { field: "updated", headerName: t("colUpdated"), minWidth: 160 },
      { field: "duration_ms", headerName: t("colDuration"), minWidth: 160 },
    ],
    [t]
  );

  const engineToggle = (
    <GridEngineToggle
      engine={gridEngine}
      setEngine={(v) => setGridEngine(v)}
      isDark={isDark}
      label={t("gridEngine")}
      tanstackLabel={t("gridTanstack")}
      agLabel={t("gridAgGrid")}
    />
  );

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold">{t("reportsTitle")}</div>
          <div className={cn("mt-1", textMuted)}>{t("reportsSubtitle")}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[0.95fr,1.05fr]">
        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 opacity-70" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("reportSearch")}
              className={cn("h-10 rounded-2xl border-none ring-1", isDark ? "bg-white/10 ring-white/10" : "bg-white/85 ring-black/10", placeholderClass)}
              aria-label={t("reportSearch")}
            />
          </div>

          <div className="mt-4 grid gap-2">
            {filtered.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReportId(r.id)}
                className={cn(
                  "rounded-2xl p-4 text-left ring-1 transition",
                  selectedReportId === r.id
                    ? isDark
                      ? "bg-white/12 ring-white/18"
                      : "bg-black/10 ring-black/15"
                    : isDark
                      ? "bg-white/6 ring-white/10 hover:bg-white/10"
                      : "bg-white/70 ring-black/10 hover:bg-black/10"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div className={cn("mt-1 text-xs", textMuted)}>{r.description}</div>
                  </div>
                  <div className={cn("text-xs", textMuted)}>
                    {t("reportUpdated")}: {r.updated}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
          {!selected ? (
            <div className={cn("rounded-2xl p-4", isDark ? "bg-white/6" : "bg-white/70")}>
              <div className="text-sm font-semibold">{t("reportPreview")}</div>
              <div className={cn("mt-2 text-sm", textMuted)}>{t("openReportHint")}</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">{selected.title}</div>
                  <div className={cn("mt-1 text-sm", textMuted)}>{selected.description}</div>
                </div>
                <Button variant="secondary" className="rounded-2xl" onClick={() => setSelectedReportId(null)}>
                  {t("back")}
                </Button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className={cn("rounded-3xl p-4 ring-1", isDark ? "bg-white/6 ring-white/10" : "bg-white/70 ring-black/10")}>
                  <div className="text-sm font-semibold">{t("category")}</div>
                  <div className={cn("mt-1 text-sm", textMuted)}>{selected.category}</div>
                </div>
                <div className={cn("rounded-3xl p-4 ring-1", isDark ? "bg-white/6 ring-white/10" : "bg-white/70 ring-black/10")}>
                  <div className="text-sm font-semibold">{t("reportUpdated")}</div>
                  <div className={cn("mt-1 text-sm", textMuted)}>{selected.updated}</div>
                </div>
              </div>

              <div className={cn("mt-4 rounded-3xl p-5 ring-1", isDark ? "bg-black/25 ring-white/10" : "bg-white/70 ring-black/10")}>
                <div className="text-sm font-semibold">{t("reportPreview")}</div>
                <div className={cn("mt-2 text-sm", textMuted)}>{t("placeholderPreview")}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        {gridEngine === "tanstack" ? (
          <TanstackVirtualGrid
            title={t("reportDataTitle")}
            subtitle={t("reportDataSubtitle")}
            headerRight={engineToggle}
            data={reportRows as any[]}
            columns={reportColumns}
            isDark={isDark}
            textMuted={textMuted}
            placeholderClass={placeholderClass}
            searchPlaceholder={t("gridSearchRows")}
            rowsLabel={t("rows")}
            height={460}
          />
        ) : (
          <AgGridPanel
            title={t("reportDataTitle")}
            subtitle={t("reportDataSubtitle")}
            headerRight={engineToggle}
            isDark={isDark}
            textMuted={textMuted}
            rowData={reportRows as any[]}
            columnDefs={reportAgCols}
            placeholderClass={placeholderClass}
            searchPlaceholder={t("gridSearchRows")}
            rowsLabel={t("rows")}
            selectedLabel={t("selected")}
            uiText={{
              options: t("agOptions"),
              optionsTooltip: t("agOptionsTooltip"),
              menuGrid: t("agMenuGrid"),
              menuPageSize: t("agMenuPageSize"),
              density: t("agDensity"),
              comfortable: t("agComfortable"),
              compact: t("agCompact"),
              autoSizeColumns: t("agAutoSize"),
              exportCsv: t("agExportCsv"),
              resetGrid: t("agReset"),
              noRows: t("agNoRows"),
            }}
            height={460}
            ariaLabel={t("reportDataTitle")}
          />
        )}
      </div>
    </div>
  );
}

function AiAssistant(props: {
  t: (k: I18nKey) => string;
  isDark: boolean;
  glass: string;
  aiOpen: boolean;
  setAiOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiText: string;
  setAiText: React.Dispatch<React.SetStateAction<string>>;
  aiMessages: Array<{ id: string; role: "user" | "assistant"; text: string }>;
  onSend: () => void;
  placeholder: string;
}) {
  const { t, isDark, glass, aiOpen, setAiOpen, aiText, setAiText, aiMessages, onSend, placeholder } = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [aiMessages, aiOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-[300]">
      <Popover open={aiOpen} onOpenChange={setAiOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-2xl shadow-lg ring-1 ring-inset",
                  isDark ? "bg-white/10 ring-white/15 hover:bg-white/15" : "bg-white/80 ring-black/10 hover:bg-white/90"
                )}
                aria-label={t("aiAssistant")}
              >
                <Bot className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{t("ai")}</TooltipContent>
        </Tooltip>
        <PopoverContent align="end" side="top" className={cn("w-[360px] border-none p-0 backdrop-blur-2xl", isDark ? "bg-black/60" : "bg-white/92")}>
          <div className={cn("rounded-2xl", glass)}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }} aria-hidden>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{t("aiAssistant")}</div>
                  <div className={cn("text-xs", isDark ? "text-slate-200/60" : "text-slate-800/60")}>{t("aiHint")}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setAiOpen(false)} aria-label={t("close")}>
                <span className="text-lg leading-none">×</span>
              </Button>
            </div>

            <div className="px-4 pb-3">
              <div ref={scrollRef} className={cn("max-h-[260px] overflow-auto rounded-2xl p-3", isDark ? "bg-white/8" : "bg-black/5")}>
                <div className="space-y-2">
                  {aiMessages.map((m) => (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                          m.role === "user"
                            ? isDark
                              ? "bg-white/15"
                              : "bg-white/80"
                            : isDark
                              ? "bg-black/30"
                              : "bg-white/70"
                        )}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Input
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder={t("aiPrompt")}
                  className={cn("h-10 rounded-2xl border-none ring-1 ring-inset", isDark ? "bg-white/10 ring-white/10" : "bg-white/85 ring-black/10", placeholder)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSend();
                  }}
                  aria-label={t("aiPrompt")}
                />
                <Button onClick={onSend} className="h-10 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))" }}>
                  <Send className="mr-2 h-4 w-4" />
                  {t("aiSend")}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
