import * as React from "react";
import { ErrorReporting } from "../ErrorReporting";
import { createTranslation } from "../helpers/createTranslation";

const lang = createTranslation({
  de: {
    reportFeedback: "Feedback rückmelden",
    anErrorOccured: (msg: string) => `Es ist ein Fehler aufgetreten: ${msg}`
  },
  en: {
    reportFeedback: "Report feedback",
    anErrorOccured: (msg: string) => `An Error occured: ${msg}`
  }
});

interface WithErrorBoundaryState {
  error: Error | null;
}

export const withErrorBoundary = <C extends { error: Error }>(
  CustomErrorScreen?: React.ComponentType<C>
) => <P extends object>(Component: React.ComponentType<P>) =>
  class WithErrorBoundary extends React.Component<P, WithErrorBoundaryState> {
    state: WithErrorBoundaryState = {
      error: null
    };

    componentDidCatch(error, info) {
      console.error(error);
      ErrorReporting.report(error);
      this.setState({ error });
    }

    render() {
      const { error } = this.state;

      if (!!error) {
        if (!!CustomErrorScreen) {
          return <CustomErrorScreen error={error} />;
        }

        if (ErrorReporting.isActive()) {
          return (
            <>
              <p id="error">{lang.anErrorOccured(error.message)}</p>
              <button onClick={ErrorReporting.showReportDialog}>
                {lang.reportFeedback}
              </button>
            </>
          );
        }

        return <p id="error">{lang.anErrorOccured(error.message)}</p>;
      }

      return <Component {...this.props} />;
    }
  };

export default withErrorBoundary;
