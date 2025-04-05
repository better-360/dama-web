//@ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AvatarDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate=useNavigate();   
  // Dropdown dışına tıklanırsa menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
const auth = getAuth();
    signOut(auth)
    .then(() => {
        console.log('User signed out');
        navigate('/login');
    })
    .catch((error) => {
        console.error('Error signing out: ', error);
    });
  };

  return (
    <div className="relative flex" ref={dropdownRef}>
      {/* Avatar */}
      <div className="ml-4 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img
          className="h-8 w-8 rounded-full"
          src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
          alt="User avatar"
        />
      </div>

      {/* Açılır Menü */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-2">
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
