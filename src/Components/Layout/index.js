import Header from "Components/Header";
import headerAtom from "Components/Header/atoms/header-atom";
import AppRoutes from "Components/Routes";
import SidebarSelection from "Components/Sidebar/SidebarSelection";
import { useRecoilValue } from "recoil";

export default function Layout() {
    const { hiddenSidebar } = useRecoilValue(headerAtom)
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
            height: '100%',
            // width: '100%',
            // flexGrow: '1',
            overflow: 'hidden'
        }}>
            <Header />
            <div style={{
                height: '100%',
                overflow: 'auto',
                ...(!hiddenSidebar ? { display: 'flex', flexDirection: 'row' } : {})
            }}>
                {!hiddenSidebar && <SidebarSelection />}
                <div style={{
                    display: 'flex', flexDirection: 'column', flexGrow: '1',
                    paddingBottom: '24px', overflow: 'auto', scrollbarGutter: 'stable',
                    height: '100%',
                    ...(!hiddenSidebar ? { paddingLeft: '24px', paddingRight: '24px' } : {})
                }}>
                    <AppRoutes />
                </div>
            </div>
        </div>
    )
}