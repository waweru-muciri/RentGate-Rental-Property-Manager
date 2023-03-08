import React from "react";
import {
    Collapse,
    Navbar,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";

export default class Header extends React.Component {
    navCssStyles = {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
    };
    state = {
        isOpen: false,
    };
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };
    render() {
        return (
            <Navbar dark className="bg-dark" expand="lg">
                <NavbarBrand href="/">Property Manager</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar style={this.navCssStyles}>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Listings
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/rentals">
                                    Rentals
                                </DropdownItem>
                                <DropdownItem href="/sales">Sales</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Work
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/contacts">
                                    Contacts
                                </DropdownItem>
                                <DropdownItem href="/transactions">
                                    Transactions
                                </DropdownItem>
                                <DropdownItem href="/calendar">
                                    Calendar
                                </DropdownItem>
                                <DropdownItem href="/to_dos">
                                    To-Dos
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Marketing
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/sms">SMS</DropdownItem>
                                <DropdownItem href="/email">Email</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Analytics
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/history">
                                    History
                                </DropdownItem>
                                <DropdownItem href="/recent_activity">
                                    Recent Activity
                                </DropdownItem>
                                <DropdownItem href="/reports">
                                    Reports
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Company
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/company_profile">
                                    Profile
                                </DropdownItem>
                                <DropdownItem href="/company_settings">
                                    Settings
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Admin
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/admin_portals">
                                    Portals
                                </DropdownItem>
                                <DropdownItem href="/admin_users">
                                    Users
                                </DropdownItem>
                                <DropdownItem href="/admin_automation">
                                    Automation
                                </DropdownItem>
                                <DropdownItem href="/admin_document_templates">
                                    Documents Templates
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
