import {
  IconHome,
  IconBooks,
  IconBracketsContain,
  IconSettings,
  IconDeviceFloppy,
  IconInfoCircle,
} from "@tabler/icons-react";

const navLinks = [
  {
    label: "Home",
    icon: IconHome,
    links: "/",
  },
  {
    label: "Books",
    icon: IconBooks,

    links: [
      { label: "New", link: "/books/new" },
      { label: "Archive", link: "/books/archived" },
    ],
  },
  {
    label: "Languages",
    icon: IconSettings,
    links: "/languages",
  },
  {
    label: "Terms",
    icon: IconBracketsContain,
    links: "/terms",
  },
  {
    label: "Settings",
    icon: IconSettings,

    links: [
      { label: "Settings", link: "/settings/index" },
      { label: "Keyboard shortcuts", link: "/settings/shortcuts" },
    ],
  },
  {
    label: "Backup",
    icon: IconDeviceFloppy,

    links: [
      { label: "Backups", link: "/backup/index" },
      { label: "Create backup", link: "/backup/backup?type=manual" },
    ],
  },
  {
    label: "About",
    icon: IconInfoCircle,

    links: [
      { label: "Software info", link: "/about" },
      { label: "Statistics", link: "/stats" },
      {
        label: "Documentation",
        link: "https://luteorg.github.io/lute-manual/",
      },
      { label: "Discord", link: "https://discord.gg/CzFUQP5m8u" },
    ],
  },
];

export { navLinks };
