import { ReactNode } from 'react';
import WindowPoint from './ui/WindowPoint';

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex justify-center items-center w-full h-screen bg-gray-300'>
      <div className='max-w-[800px] w-[98%] sm:w-full h-[98%] sm:h-[88%] max-h-[700px] bg-white rounded-xl shadow-custom'>
        <header className='flex items-center h-8 p-4 bg-gray-100 rounded-tl-xl rounded-tr-xl'>
          <WindowPoint />
        </header>
        {children}
      </div>
    </div>
  )
}

export default Layout