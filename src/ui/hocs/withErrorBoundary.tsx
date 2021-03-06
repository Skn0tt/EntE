import * as React from "react";
import { ErrorReporting } from "../ErrorReporting";
import { getByLanguage } from "@@types";
import { withLanguage, WithLanguage } from "../helpers/with-language";
import { Maybe, None } from "monet";

const lang = getByLanguage({
  de: {
    reportFeedback: "Feedback rückmelden",
    anErrorOccured: (msg: string) => `Es ist ein Fehler aufgetreten: ${msg}`,
  },
  en: {
    reportFeedback: "Report feedback",
    anErrorOccured: (msg: string) => `An Error occured: ${msg}`,
  },
});

interface WithErrorBoundaryState {
  error: Error | null;
  eventId: Maybe<string>;
}

type CustomErrorScreenComponentType<T = {}> = React.ComponentType<
  T & { error: Error }
>;

export const withErrorBoundary = (
  CustomErrorScreen?: CustomErrorScreenComponentType
) => <P extends object>(Component: React.ComponentType<P>) =>
  withLanguage(
    class WithErrorBoundary extends React.PureComponent<
      P & WithLanguage,
      WithErrorBoundaryState
    > {
      state: WithErrorBoundaryState = {
        error: null,
        eventId: None(),
      };

      async componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(error);
        this.setState({ error });

        const eventId = await ErrorReporting.report(error);
        this.setState({ eventId });
      }

      handleShowReportDialog = () => {
        const { eventId } = this.state;
        eventId.forEach((id) => ErrorReporting.showReportDialog(id));
      };

      render() {
        const { language } = this.props;
        const { error, eventId } = this.state;

        if (!!error) {
          if (!!CustomErrorScreen) {
            return <CustomErrorScreen error={error} />;
          }

          if (ErrorReporting.isActive()) {
            return (
              <>
                <p id="error">{lang(language).anErrorOccured(error.message)}</p>
                {eventId.isSome() && (
                  <button onClick={this.handleShowReportDialog}>
                    {lang(language).reportFeedback}
                  </button>
                )}
              </>
            );
          }

          return (
            <p id="error">{lang(language).anErrorOccured(error.message)}</p>
          );
        }

        return <Component {...this.props} />;
      }
    }
  );

export default withErrorBoundary;
