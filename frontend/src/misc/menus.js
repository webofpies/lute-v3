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

  books: {
    label: "Books",
    action: "/",
    icon: IconBooks,

    new: {
      label: "New",
      action: "/books/new",
    },
    archived: {
      label: "Archived",
      action: "/books/archived",
    },
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
      action: "/backup/index",
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
