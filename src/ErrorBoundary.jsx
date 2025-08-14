import { Link } from "@tanstack/react-router";
import { Component } from "react";

class ErrorBoundary extends Component {
    state = { hasError: false }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error, info) {
        console.error("ErrorBounday caught error", error, info)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Error Found !</h2>
                    <p>There was an error with this page</p>
                    <Link to='/'> Back to home page
                    </Link>

                </div>

            )
        }
        return this.props.children
    }
}
export default ErrorBoundary