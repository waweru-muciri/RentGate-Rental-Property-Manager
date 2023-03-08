import React from "react";
import * as ReactDOM from "react-dom";

const headRoot = document.head;

class CustomHead extends React.Component {
    render() {
        return ReactDOM.createPortal(this.props.children, headRoot);
    }
}

const Head = (props) => {
    return (
        <CustomHead>
            <meta charSet="utf-8" />
            <title>RentGate PM - {props.title}</title>
            <meta
                name="description"
                content="DigitalDairy Dairy Farm Management Services. DigitalDairy offers the best dairy farm management technologies including software applications, digital devices and instruments, automation services and equipment and other I.T solutions. "
            />
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
            <meta
                name="keywords"
                content="Dairy Farms, Dairy Farm Management, DigitalDairy, Digital Dairy Farms, Technology in Dairy Farms, Cow Management, Smart Dairy, Dairy Tech, Dairy Technology"
            />
            <meta name="author" content="Brian Waweru Muciri, DigitalDairy" />
            <meta name="theme-color" content="#2F3BA2" key="theme-color" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta
                name="apple-mobile-web-app-capable"
                content="yes"
                key="apple-mobile-web-app-capable"
            />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="black"
                key="apple-mobile-web-app-status-bar-style"
            />
            <meta
                name="apple-mobile-web-app-title"
                content="DigitalDairy Dairy Farm Management"
                key="apple-mobile-web-app-title"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
        </CustomHead>
    );
};

export default Head;
