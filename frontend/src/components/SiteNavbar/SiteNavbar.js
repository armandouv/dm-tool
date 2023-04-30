import {Image, Navbar, Text} from "@nextui-org/react";
import {Link, NavLink} from "react-router-dom";
import logo from "../../assets/img/logo.png";
import * as React from "react";
import {SiteNavbarLink} from "./SiteNavbarLink";


export function SiteNavbar() {
    const links = [
        ["Inicio", "/"],
        ["Análisis Exploratorio", "/analisis-exploratorio"]
    ];

    return (
        <Navbar variant="static">
            <Navbar.Brand>
                <Navbar.Toggle aria-label="toggle navigation" showIn={"sm"}/>
                <NavLink to={"/"} style={() => {
                    return {
                        display: "flex", justifyContent: "space-between", alignItems: "flex-end", minWidth: "8.5rem"
                    };
                }}>
                    <Image
                        width={"3rem"}
                        src={logo}
                        alt="Logo"
                    />
                    <Text h4 hideIn="xs">
                        DM-Tool
                    </Text>
                </NavLink>
            </Navbar.Brand>
            <Navbar.Content activeColor={"primary"} hideIn="sm" variant={"highlight-solid-rounded"}>
                {links.map((item, index) => <SiteNavbarLink key={index} name={item[0]} link={item[1]}/>)}
            </Navbar.Content>
            <Navbar.Collapse>
                {links.map((item, index) => (
                    <Navbar.CollapseItem key={index}>
                        <Link to={item[1]}>
                            {item[0]}
                        </Link>
                    </Navbar.CollapseItem>
                ))}
            </Navbar.Collapse>
        </Navbar>
    );
}