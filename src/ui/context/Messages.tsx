import { BehaviorSubject } from "rxjs";
import * as React from "react";

export const messages$ = new BehaviorSubject<string[]>([]);

export const addMessages = (...msg: string[]) => {
  const currentVal = messages$.getValue();
  const nextVal = [...currentVal, ...msg];
  messages$.next(nextVal);
};

export const removeMessage = (msg: string) => {
  const currentVal = messages$.getValue();
  const nextVal = currentVal.filter((a) => a !== msg);
  messages$.next(nextVal);
};

export interface MessagesContextValue {
  messages: Readonly<string[]>;
  addMessages: (...msg: string[]) => void;
  removeMessage: (msg: string) => void;
}

export const MessagesContext = React.createContext<MessagesContextValue>({
  addMessages,
  removeMessage,
  messages: messages$.getValue(),
});

export const MessagesConsumer = MessagesContext.Consumer;

export const MessagesProvider: React.FunctionComponent<{}> = (props) => {
  const { children } = props;

  const [messages, updateMessages] = React.useState(messages$.getValue());

  React.useEffect(() => {
    const subscription = messages$.subscribe((msgs) => {
      updateMessages(msgs);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        addMessages,
        removeMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => React.useContext(MessagesContext);
