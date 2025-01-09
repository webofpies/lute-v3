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

    all: {
      label: "All Terms",
      action: "/terms",
    },
    new: {
      label: "Create New",
      action: "/terms/new",
    },
    tags: {
      label: "Tags",
      action: "/terms/tags",
    },
  },

  settings: {
    label: "Settings",
    action: "/",
    icon: IconSettings,

    general: {
      label: "General",
      action: "/settings",
    },
    shortcuts: {
      label: "Keyboard shortcuts",
      action: "/settings/shortcuts",
    },
  },

  backup: {
    label: "Backup",
    action: "/",
    icon: IconDeviceFloppy,

    backups: {
      label: "Backups",
      action: "/backups",
    },
    new: {
      label: "Create backup",
      action: "/backup/backup?type=manual",
    },
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
