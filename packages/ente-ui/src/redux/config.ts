import { Middleware } from "redux";
import { asyncLocalStorage } from "redux-persist/storages";
import { CreateEntryDto, CreateUserDto, PatchUserDto } from "ente-types";
import { ImportUsersRequestPayload } from "./actions";

export type SagaListeners = {
  onImportSuccessful: (payload: ImportUsersRequestPayload) => void;
  onUsersCreated: (users: CreateUserDto[]) => void;
  onUserUpdated: (patch: PatchUserDto) => void;
  onSignedEntry: (entryId: string) => void;
  onUnsignedEntry: (entryId: string) => void;
  onPasswordResetRequested: (username: string) => void;
  onEntryCreated: (entry: CreateEntryDto) => void;
  onEntryDeleted: (entryId: string) => void;
  onLoginFailedInvalidCredentials: () => void;
  onUserDeleted: (userId: string) => void;
  onRequestError: (error: Error) => void;
  onSigningError: (error: Error) => void;
  onUnsigningError: (error: Error) => void;
  onSetPasswordError: (error: Error) => void;
  onSetPasswordSuccess: () => void;
  onSyncingLanguageError: (error: Error) => void;
  onSagaError: (err: Error) => void;
};

export type ReduxConfig = {
  onFileDownload: (file: Blob, filename: string) => void;
  baseUrl: string;
  middlewares: Middleware[];
  storage: any;
} & SagaListeners;

const ignore = () => {};

const defaultConfig: ReduxConfig = {
  storage: asyncLocalStorage,
  baseUrl: "",
  middlewares: [],
  onFileDownload: ignore,
  onImportSuccessful: ignore,
  onUsersCreated: ignore,
  onEntryCreated: ignore,
  onUserDeleted: ignore,
  onEntryDeleted: ignore,
  onSignedEntry: ignore,
  onPasswordResetRequested: ignore,
  onRequestError: ignore,
  onSagaError: ignore,
  onSetPasswordError: ignore,
  onSigningError: ignore,
  onSyncingLanguageError: ignore,
  onUnsignedEntry: ignore,
  onUnsigningError: ignore,
  onUserUpdated: ignore,
  onLoginFailedInvalidCredentials: ignore,
  onSetPasswordSuccess: ignore
};

let config: ReduxConfig = defaultConfig;

export const updateConfig = (v: Partial<ReduxConfig>) => {
  config = { ...config, ...v };
};

export const getConfig = () => config;
