import { useState } from 'react';
import { Avatar, Menu } from 'react-daisyui';
import { FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  className?: string;
}

interface HeaderMenuProps {}

const HeaderMenu: React.FC<HeaderMenuProps> = (): JSX.Element => {
  return (
    <Menu className='z-[999] fixed top-[60px] right-[20px] bg-white w-56'>
      <Menu.Item>
        <Link to='#' className='flex items-center gap-2'>
          <FiUser size={20} />
          <span className='font-bold'>Profile</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='#' className='flex items-center gap-2'>
          <FiSettings size={20} />
          <span className='font-bold'>Settings</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, className }): JSX.Element => {
  const [toolbarMenuVisible, setToolbarMenuVisible] = useState<boolean>(false);
  const toggleToolbarMenuVisible = () => setToolbarMenuVisible((prev) => !prev);

  return (
    <nav className={`z-[998] select-none w-[80%] h-[60px] bg-primary py-4 px-8 fixed right-0 top-0 flex justify-between items-center ${className}`}>
      <div
        onClick={toggleSidebar}
        className='cursor-pointer p-2 hover:bg-slate-500 hover:bg-opacity-50 transition-all duration-200 rounded-full'
      >
        <FiMenu color='white' size={20} />
      </div>
      <div
        onClick={toggleToolbarMenuVisible}
        className='flex items-center gap-2 cursor-pointer p-2'
      >
        <Avatar
          size='xs'
          shape='circle'
          src='https://avatars.githubusercontent.com/u/2?v=4'
        />
        <span className='font-semibold text-white'>Management</span>
      </div>

      {toolbarMenuVisible && <HeaderMenu />}
    </nav>
  );
};

export default Header;
