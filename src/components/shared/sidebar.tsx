import { Link, useLocation } from 'react-router-dom';
import { MenuItem, menuItems } from 'data/sidebar-menu';
import { Button, Modal } from 'react-daisyui';
import { FiLogOut } from 'react-icons/fi';
import { ForwardRefRenderFunction, useCallback, useRef } from 'react';
import { forwardRef } from 'react';
import imageLogo from 'assets/images/ktsm.jpeg';
import { useAppDispatch } from 'redux/hook';
import { logoutRedux } from 'redux/auth/auth.action';

interface SidebarProps {
  active: boolean;
  toggleSidebar: () => void;
}

interface ModalLogoutProps {
  ref: React.DialogHTMLAttributes<HTMLDialogElement>;
  handleClose: () => void;
  handleLogout: () => void;
}

const menuStyles = {
  active:
    'transition-all duration-100 p-4 bg-white cursor-pointer rounded-l-full ml-2',
  inactive:
    'hover:bg-slate-100 hover:bg-opacity-20 transition-all duration-100 p-4 cursor-pointer ml-2 rounded-l-full text-white',
};

const LogoutModal: ForwardRefRenderFunction<
  HTMLDialogElement,
  ModalLogoutProps
> = ({ handleClose, handleLogout }, ref) => {
  return (
    <div className='font-sans'>
      <Modal backdrop={true} ref={ref}>
        <Modal.Header className='font-bold'>
          Are you sure want to log out?
        </Modal.Header>
        <Modal.Body>
          Press ESC key or click the button below to close
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={handleLogout} color='primary' className='text-white'>
            Yes, sure
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const ForwardedRefLogoutModal = forwardRef(LogoutModal);

const Sidebar: React.FC<SidebarProps> = ({ active }): JSX.Element => {
  const location = useLocation();
  const validateMenuActive = (item: MenuItem) => {
    return location.pathname.includes(item.path) ? 'active' : 'inactive';
  };
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleShowDialog = useCallback(() => {
    modalRef.current?.showModal();
  }, [modalRef]);

  const handleCloseDialog = useCallback(() => {
    modalRef.current?.close();
  }, [modalRef]);

  const handleLogout = () => {
    dispatch(logoutRedux());
  };

  return (
    <aside
      className={`z-[999] max-h-screen h-screen overflow-auto relative top-0 bg-primary ${
        active ? 'left-0 w-[20%]' : '-left-[20%] w-[0%]'
      }`}
    >
      <div className='pl-4 pr-2'>
        <div className='w-full flex-col flex justify-center items-center gap-2 py-4'>
          <img src={imageLogo} width={80} />
          <span className='font-bold text-xl text-white'>Management</span>
        </div>
      </div>

      <div className='select-none mt-4'>
        <ul className='flex flex-col'>
          {menuItems.map((item, index) => {
            return (
              <Link key={index} to={item.path}>
                <li className={menuStyles[validateMenuActive(item)]}>
                  <span className='flex gap-2 items-center'>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>

        <div className='w-[20%] fixed bottom-5 px-4'>
          <Button onClick={handleShowDialog} className='w-full' color='accent'>
            <FiLogOut size={20} />
            Log out
          </Button>
        </div>
      </div>

      <ForwardedRefLogoutModal
        ref={modalRef}
        handleLogout={handleLogout}
        handleClose={handleCloseDialog}
      />
    </aside>
  );
};

export default Sidebar;
