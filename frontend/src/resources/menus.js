import {
  IconHome,
  IconBooks,
  IconBracketsContain,
  IconSettings,
  IconDeviceFloppy,
  IconInfoCircle,
  IconLanguage,
} from "@tabler/icons-react";

const menu = {
  home: {
    label: "Home",
    action: "/",
    icon: IconHome,
  },

  book: {
    label: "New Book",
    icon: IconBooks,
    action: "/books/new",
  },

  languages: {
    label: "Languages",
    action: "/languages",
    icon: IconLanguage,
  },

  terms: {
    label: "Terms",
    action: "/terms",
    icon: IconBracketsContain,

    children: [
      {
        label: "All Terms",
        action: "/terms",
      },
      {
        label: "Create New",
        action: "/terms/term",
      },
      {
        label: "Tags",
        action: "/terms/tags",
      },
    ],
  },

  settings: {
    label: "Settings",
    action: "/",
    icon: IconSettings,

    children: [
      { label: "General", action: "/settings" },
      {
        label: "Keyboard shortcuts",
        action: "/settings/shortcuts",
      },
    ],
  },

  backup: {
    label: "Backup",
    action: "/",
    icon: IconDeviceFloppy,

    children: [
      {
        label: "Backups",
        action: "/backups",
      },
      {
        label: "Create backup",
        action: "/backup/backup?type=manual",
      },
    ],
  },

  about: {
    label: "About",
    action: "/",
    icon: IconInfoCircle,

    info: {
      label: "Software info",
      action: "/",
    },
    stats: {
      label: "Usage statistics",
      action: "/stats",
    },
    docs: {
      label: "Documentation",
      action: "https://luteorg.github.io/lute-manual/",
    },
    discord: {
      label: "Discord",
      action: "https://discord.gg/CzFUQP5m8u",
    },
  },
};

export { menu };
