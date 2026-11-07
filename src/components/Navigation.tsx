import { useState, useRef, useEffect } from "react";
import { Logo } from "./Logo";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      className="text-base-text hover:text-brand-green relative group"
      onClick={onClick}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-coral group-hover:w-full transition-all duration-300" />
    </a>
  );
}

interface DropdownItem {
  href: string;
  label: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }

  function handleMouseEnter() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-base-text hover:text-brand-green relative group"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {label}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-coral group-hover:w-full transition-all duration-300" />
      </button>
      <div
        role="menu"
        aria-label={`${label} menu`}
        className={`absolute top-full left-0 mt-2 w-48 bg-base-bg border border-base-border rounded-lg shadow-lg transition-all duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="py-2">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block px-4 py-2 text-base-text hover:bg-brand-green/10 hover:text-brand-green"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: DropdownItem[];
}

function MobileMenu({ isOpen, onClose, galleryItems }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-base-text/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <nav
        className={`absolute top-0 right-0 h-full w-64 bg-base-bg border-l border-base-border shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 text-base-text/60 hover:text-base-text"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 space-y-6">
          {/* Gallery section */}
          <div>
            <p className="text-xs font-semibold text-base-text/40 uppercase tracking-wider mb-3">
              Projects
            </p>
            <div className="space-y-1">
              {galleryItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-base-text hover:text-brand-green transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-base-border pt-6 space-y-1">
            <a
              href="/manifesto"
              className="block py-2 text-base-text hover:text-brand-green transition-colors"
              onClick={onClose}
            >
              Manifesto
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface NavigationProps {
  galleryItems: DropdownItem[];
}

export function Navigation({ galleryItems }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-base-bg/80 backdrop-blur-sm border-b border-base-border">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" aria-label="Random Software home">
            <Logo className="h-8 sm:h-9 w-auto" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 text-sm">
            <NavDropdown label="Gallery" items={galleryItems} />
            <NavLink href="/manifesto">Manifesto</NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 text-base-text/60 hover:text-base-text"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        galleryItems={galleryItems}
      />
    </>
  );
}
