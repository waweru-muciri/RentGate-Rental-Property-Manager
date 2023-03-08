import React from "react";
import CustomSnackbar from './CustomSnackbar'


class ErrorBoundary extends React.Component {
    constructor(props) {
        super()
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log("Error during rendering of a component => ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <CustomSnackbar variant="error" message="Error during showing component" />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;