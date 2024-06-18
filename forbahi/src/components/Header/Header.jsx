import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import userImg from '../../assets/images/avatar-icon.png';
import { BiMenu } from "react-icons/bi";
import React from 'react';
import './Header.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const navLinks = [
  { path: '/home', display: 'Home' },
  { path: '/doctor', display: 'Find Therapist' },
  { path: '/session', display: 'Mysession', dropdown: true },
  { path: '/appointment', display: 'Appointment', dropdown: true },
  { path: '/forum', display: 'Forum' },
  { path: '/resources', display: 'Blog' },
  { path: '/services', display: 'Services' },
  { path: '/contact', display: 'Contact' },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElTwo, setAnchorElTwo] = useState(null);

  const open = Boolean(anchorEl);
  const openTwo = Boolean(anchorElTwo);

  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClickTwo = (event) => {
    setAnchorElTwo(event.currentTarget);
  };

  const handleMenuCloseTwo = () => {
    setAnchorElTwo(null);
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li className="relative" key={index}>
                  {link.dropdown ? (
                    <>
                      <Button
                        id={`basic-button-${index}`}
                        aria-controls={
                          (open && link.path === '/appointment') || (openTwo && link.path === '/session')
                            ? 'basic-menu'
                            : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={
                          (open && link.path === '/appointment') || (openTwo && link.path === '/session')
                            ? 'true'
                            : undefined
                        }
                        onClick={
                          link.path === '/appointment'
                            ? (event) => handleMenuClick(event, link.path)
                            : (link.path === '/session' ? (event) => handleMenuClickTwo(event, link.path) : null)
                        }
                      >
                        {link.display}
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={link.path === '/appointment' ? anchorEl : anchorElTwo}
                        open={link.path === '/appointment' ? open : openTwo}
                        onClose={link.path === '/appointment' ? handleMenuClose : handleMenuCloseTwo}
                        MenuListProps={{
                          'aria-labelledby': `basic-button-${index}`,
                        }}
                      >
                        {link.path === '/session' && (
                          <>
                            <MenuItem onClick={handleMenuCloseTwo}>
                              <NavLink to="/sessions/text" className="menu-link">
                                Text Sessions
                              </NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleMenuCloseTwo}>
                              <NavLink to="/sessions/video" className="menu-link">
                                Video Sessions
                              </NavLink>
                            </MenuItem>
                          </>
                        )}
                        {link.path === '/appointment' && (
                          <>
                            <MenuItem onClick={handleMenuClose}>
                              <NavLink to="/appointments/online" className="menu-link">
                                Online Appointments
                              </NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                              <NavLink to="/appointments/in-person" className="menu-link">
                                In-Person Appointments
                              </NavLink>
                            </MenuItem>
                          </>
                        )}
                      </Menu>
                    </>
                  ) : (
                    <NavLink
                      to={link.path}
                      className={(navClass) =>
                        navClass.isActive
                          ? 'text-primaryColor text-[16px] leading-7 font-[600]'
                          : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                      }
                    >
                      {link.display}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden">
              <Link to="/">
                <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                  <img src={userImg} className="w-full rounded-full" alt="User Avatar" />
                </figure>
              </Link>
            </div>

            <div>
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            </div>
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
