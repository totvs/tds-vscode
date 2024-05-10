import * as React from "react";

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Something went wrong.</h1>
          {this.state}
        </>
      );
    }

    return this.props.children;
  }
}
