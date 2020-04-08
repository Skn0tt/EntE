import * as React from "react";
import _ReactToPrint from "react-to-print";
import { IconButton } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";

const ReactToPrint = _ReactToPrint as any;

type WithPrintContextType = JSX.Element;

const WithPrintContext = React.createContext<WithPrintContextType>(<></>);

export const usePrintButton = () => {
  const f = React.useContext(WithPrintContext);
  return f;
};

export const withPrintButton = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => props => {
  const ref = React.useRef<HTMLElement | null>(null);

  const printButton = React.useMemo(
    () => {
      return (
        <ReactToPrint
          trigger={() => (
            <IconButton>
              <PrintIcon />
            </IconButton>
          )}
          content={() => ref.current}
        />
      );
    },
    [ref.current]
  );

  return (
    <WithPrintContext.Provider value={printButton}>
      <div ref={ref}>
        <Component {...props} />
      </div>
    </WithPrintContext.Provider>
  );
};
