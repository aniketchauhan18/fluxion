"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function HamburgerMenu() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggleMenu = () => setToggleMenu((prev) => !prev);
  return (
    <div>
      <div className="md:hidden flex justify-end">
        <Menu
          className="overflow-hidden block md:hidden cursor-pointer"
          onClick={handleToggleMenu}
        />
      </div>
      <div className="fixed bg-white/10 backdrop-blur-xs top-[50px] left-0 px-5 mx-auto w-full h-auto md:hidden z-[100] ">
        {toggleMenu && (
          <div className="md:hidden bg-white backdrop-blur-sm animate-menu-animation transform-gpu transition-transform duration-200ms ease-in-out">
            <div className="cursor-pointer w-fit py-2">Sign Out</div>
            <Link href="/dashboard" className="cursor-pointer w-fit py-2">
              Dashboard
            </Link>
            {/* <div className="cursor-pointer w-fit py-2">Connect Wallet</div> */}
          </div>
        )}
      </div>
    </div>
  );
}
