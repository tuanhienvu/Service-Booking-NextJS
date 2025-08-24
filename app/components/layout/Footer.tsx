'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const isVisible = !pathname.includes('services/details');

  return (
    <>
      {isVisible && (
        <div className="footer flex flex-col pt-8 bg-slate-900 border-t border-slate-700">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full py-4 px-4 gap-4 sm:gap-0 sm:py-6">
              <div className="flex flex-col items-center gap-2 justify-center mb-4 sm:justify-start sm:items-start sm:mb-0">
                <Link className="btn btn-ghost text-xl hover:bg-slate-800" href="/">
                  <Image className="dark:invert" src="/images/logo.svg" alt="Logo" width={35} height={35} priority />
                </Link>
                <p className="text-slate-300 text-center sm:text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="flex justify-center items-end mb-6 sm:mb-0">
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link className="link text-slate-300 font-light hover:text-primary" href="/about">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link className="link text-slate-300 font-light hover:text-primary" href="/services">
                      Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center sm:justify-end">
                <ul className="flex flex-row gap-6 sm:gap-2">
                  <li>
                    <a className="link text-slate-300 font-light hover:text-primary transition-colors">
                      <FaInstagram className="w-[24px] h-[24px]" />
                    </a>
                  </li>
                  <li>
                    <a className="link text-slate-300 font-light hover:text-primary transition-colors">
                      <BsTwitterX className="w-[24px] h-[24px]" />
                    </a>
                  </li>
                  <li>
                    <a className="link text-slate-300 font-light hover:text-primary transition-colors">
                      <FaFacebookF className="w-[24px] h-[24px]" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-slate-400 flex justify-center items-center font-extralight p-4 border-t border-slate-700 w-full">
            &copy;2024 - Service. All rights reserved.
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
