import {
  IconHome,
  IconBooks,
  IconBracketsContain,
  IconSettings,
  IconDeviceFloppy,
  IconInfoCircle,
  IconClick,
  IconAlignLeft,
  IconPilcrow,
  IconClipboardCheck,
  IconClipboardText,
  IconClipboardTypography,
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconBookmarkPlus,
  IconColumns1,
  IconColumns2,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconTextDecrease,
  IconTextIncrease,
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

const contextItems = [
  {
    label: "Translate",
    items: [
      {
        label: "Selection",
        icon: IconClick,
        action: "translateSelection",
      },
      {
        label: "Sentence",
        icon: IconAlignLeft,
        action: "translateSentence",
      },
      {
        label: "Paragraph",
        icon: IconPilcrow,
        action: "translateParagraph",
      },
    ],
  },
  {
    label: "Copy",
    items: [
      {
        label: "Selection",
        icon: IconClipboardCheck,
        action: "copySelection",
      },
      {
        label: "Sentence",
        icon: IconClipboardText,
        action: "copySentence",
      },
      {
        label: "Paragraph",
        icon: IconClipboardTypography,
        action: "copyParagraph",
      },
    ],
  },
];

const toolbarButtons = [
  [
    {
      label: "Descrease font size",
      icon: IconTextDecrease,
      action: "fontSizeDecrease",
    },
    {
      label: "Increase font size",
      icon: IconTextIncrease,
      action: "fontSizeIncrease",
    },
  ],
  [
    {
      label: "Descrease line height",
      icon: IconBaselineDensityMedium,
      action: "lineHeightDecrease",
    },
    {
      label: "Increase line height",
      icon: IconBaselineDensitySmall,
      action: "lineHeightIncrease",
    },
  ],
  [
    {
      label: "Set columns to 1",
      icon: IconColumns1,
      action: "setColumnCountOne",
    },
    {
      label: "Set columns to 2",
      icon: IconColumns2,
      action: "setColumnCountTwo",
    },
  ],
  [
    {
      label: "Decrease pane width",
      icon: IconLayoutSidebarRightExpand,
      action: "paneWidthDecrease",
    },
    {
      label: "Increase pane width",
      icon: IconLayoutSidebarLeftExpand,
      action: "paneWidthIncrease",
    },
  ],
  [
    {
      label: "Add bookmark",
      icon: IconBookmarkPlus,
      action: "addBookmark",
    },
  ],
];

export { navLinks, contextItems, toolbarButtons };
