import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Logo,
    LogoutBtn
} from '../index';
import {
    useMediaQuery,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    IconButton,
    Box,
    Flex,
    useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const authStatus = useSelector((state) => state.auth.status) || false;
    const authUserData = useSelector((state) => state.auth.userData) || {};
    const [user, setUser] = useState('Guest');
    const navigate = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (authStatus && authUserData?.name) {
            setUser(authUserData.name);
        } else {
            setUser('Guest');
        }
    }, [authUserData, authStatus]);

    const navItems = [
        { name: 'Home', url: '/', active: true },
        { name: 'Login', url: '/login', active: !authStatus },
        { name: 'Signup', url: '/signup', active: !authStatus },
        { name: 'Your Posts', url: '/alluserposts', active: authStatus },
        { name: 'Write', url: '/addpost', active: authStatus }
    ];

    return (
        <header className='py-3'>
            <Container>
                <Flex justify='space-between' align='center'>
                    <Box>
                        <Link to='/'>
                            <Logo width='70px' />
                        </Link>
                    </Box>
                    <IconButton
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        onClick={toggleColorMode}
                        variant="ghost"
                    />
                    {isLargerThan768 ? (
                        <Flex as='nav'>
                            {navItems.map((item) => item.active && (
                                <Button
                                    key={item.name}
                                    variant='ghost'
                                    onClick={() => navigate(item.url)}
                                    mx={2}
                                >
                                    {item.name}
                                </Button>
                            ))}
                            {authStatus && <LogoutBtn />}
                        </Flex>
                    ) : (
                        <>
                            <IconButton
                                ref={btnRef}
                                icon={<HamburgerIcon />}
                                onClick={onOpen}
                                variant='outline'
                            />
                            <Drawer
                                isOpen={isOpen}
                                placement='right'
                                onClose={onClose}
                                finalFocusRef={btnRef}
                            >
                                <DrawerOverlay />
                                <DrawerContent>
                                    <DrawerCloseButton />
                                    {/* <DrawerHeader>Navigation</DrawerHeader> */}
                                    <DrawerBody>
                                        {navItems.map((item) => item.active && (
                                            <Button
                                                key={item.name}
                                                variant='ghost'
                                                onClick={() => {
                                                    navigate(item.url);
                                                    onClose();
                                                }}
                                                w='100%'
                                                my={2}
                                            >
                                                {item.name}
                                            </Button>
                                        ))}
                                        {authStatus && (
                                            <Button
                                                variant='ghost'
                                                onClick={() => {
                                                    // Assuming LogoutBtn has its own functionality
                                                    onClose();
                                                }}
                                                w='100%'
                                                my={2}
                                            >
                                                Logout
                                            </Button>
                                        )}
                                    </DrawerBody>
                                </DrawerContent>
                            </Drawer>
                        </>
                    )}
                </Flex>
            </Container>
        </header>
    );
}

export default Header;
