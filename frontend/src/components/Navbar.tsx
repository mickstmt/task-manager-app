import { Link } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, ListTodo } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              Task Manager
            </span>
          </Link>

          {/* Links de navegación */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ListTodo className="w-5 h-5" />
              <span className="font-medium">Tasks</span>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            {/* Botón de usuario (lo implementaremos después) */}
            <div className="flex items-center space-x-2 pl-6 border-l border-gray-200">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;