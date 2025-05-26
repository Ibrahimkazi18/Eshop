"use client"

import { usePathname } from "next/navigation";
import useSidebar from "../../hooks/useSidebar"
import useSeller from "../../hooks/useSeller";
import { useEffect } from "react";
import Box from './box'
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import SidebarItem from "./sidebar-item";
import Home from "../../assets/icons/home";
import SidebarMenu from "./sidebar-menu";
import { ListOrdered } from "lucide-react";

const SideBarWrapper = () => {
  const {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const {seller, isLoading } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route : string) => activeSidebar === route ? '#0085ff' : '#969696';

  return (
   <Box css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: "0",
        overflowY: 'scroll',
        scrollbarWidth: 'none'
   }}
   className="sidebar-wrapper"
   >
    <Sidebar.Header>
        <Box>
            <Link href={'/'} className="flex justify-center text-center gap-2">
                Logo
                <Box>
                    <h3 className="text-xl font-medium text-[#ecedee]">{seller?.shop?.name}</h3>

                    <h5 className="font-medium text-xs pl-2 text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                        {seller?.shop?.address}
                    </h5>
                </Box>
            </Link>
        </Box>
    </Sidebar.Header>

    <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
            <SidebarItem 
                title="Dashboard" 
                isActive={activeSidebar === "/dashboard"}
                href="/dashboard"
                icon={<Home fill={getIconColor("/dashboard")} />}
            />

            <div className="mt-2 block">
                <SidebarMenu title="Main Menu">
                    <SidebarItem 
                        title="Orders" 
                        isActive={activeSidebar === "/orders"}
                        href="/orders"
                        icon={<ListOrdered size={26} fill={getIconColor("/dashboard")} />}
                    />
                </SidebarMenu>
            </div>
        </Sidebar.Body>
    </div>
   </Box>
  )
}

export default SideBarWrapper