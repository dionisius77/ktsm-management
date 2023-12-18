import { FiBookOpen, FiHome, FiArchive, FiMapPin, FiGitBranch, FiMessageSquare } from "react-icons/fi";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: "Operating Area Management",
    icon: <FiMapPin />,
    path: "/operating-area",
  },
  {
    name: "Branch Management",
    icon: <FiGitBranch />,
    path: "/branch",
  },
  {
    name: "Message Management",
    icon: <FiMessageSquare />,
    path: "/message",
  },
];

export { menuItems };
export type { MenuItem };
