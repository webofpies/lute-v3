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
      { label: "Create New Book", link: "/book/new" },
      { label: "Import web page", link: "/" },
      { label: "Book archive", link: "/" },
    ],
  },
  {
    label: "Terms",
    icon: IconBracketsContain,

    links: [
      { label: "Terms", link: "/term/index" },
      { label: "Import terms", link: "/termimport/index" },
      { label: "Term tags", link: "/termtag/index" },
    ],
  },
  {
    label: "Settings",
    icon: IconSettings,

    links: [
      { label: "Languages", link: "/language/index" },
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
      { label: "Version and software info", link: "/version" },
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
