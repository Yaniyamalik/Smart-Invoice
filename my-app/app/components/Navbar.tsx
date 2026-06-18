import Link from "next/link"
export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm ">
      
      {/* Navbar Start */}
      <div className="navbar-start">
        
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
           <li>  
           <Link href="/" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Home
          </Link>
          </li> 
          <li>
            <Link href="/predict" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Predict Freight Cost
          </Link>
          </li>
           <li>
            <Link href="/flaging" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Invoice Flagging
          </Link>
          </li>
           <li>
            <Link href="/bulk" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Bulk Invoice Analysis
          </Link>
          </li>
        </ul>
        </div>

        {/* Logo */}
        <a className="btn btn-ghost text-xl">SmartInvoice</a>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex ">
         
        <ul className="menu menu-horizontal px-1 ">
           <li>  
           <Link href="/" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Home
          </Link>
          </li> 
          <li>
            <Link href="/predict" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Predict Freight Cost
          </Link>
          </li>
           <li>
            <Link href="/flaging" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Invoice Flagging
          </Link>
          </li>
           <li>
            <Link href="/bulk" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Bulk Invoice Analysis
          </Link>
          </li>
        </ul>
      </div>

    
    </div>
  );
}