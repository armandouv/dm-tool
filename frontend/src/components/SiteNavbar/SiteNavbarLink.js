import {Navbar} from "@nextui-org/react";
import {NavLink} from "react-router-dom";
import * as React from "react";


export const SiteNavbarLink = ({link, name}) => (
    <NavLink to={link}>
        {({isActive}) => (<Navbar.Item isActive={isActive}>
            {name}
        </Navbar.Item>)}
    </NavLink>
)