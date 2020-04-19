import { Middleware } from "redux";
import { asyncLocalStorage } from "redux-persist/storages";
import { CreateEntryDto, CreateUserDto, PatchUserDto } from "@@types";
import { ImportUsersRequestPayload } from "./actions";

export type SagaListeners = {
  onImportSuccessful: (payload: ImportUsersRequestPayload) => void;
  onUsersCreated: (users: CreateUserDto[]) => void;
  onUserUpdated: (patch: PatchUserDto) => void;
  onSignedEntry: (entryId: string) => void;
  onUnsignedEntry: (entryId: string) => void;
  onEntryCreated: (entry: CreateEntryDto) => void;
  onEntryDeleted: (entryId: string) => void;
  onLoginFailedInvalidCredentials: () => void;
  onUserDeleted: (userId: string) => void;
  onRequestError: (error: Error) => void;
  onSigningError: (error: Error) => void;
  onUnsigningError: (error: Error) => void;
  onSyncingLanguageError: (error: Error) => void;
  onSagaError: (err: Error) => void;
};

export type ReduxConfig = {
  onFileDownload: (file: Blob, filename: string) => void;
  middlewares: Middleware[];
  storage: any;
} & SagaListeners;

const ignore = () => {};

const defaultConfig: ReduxConfig = {
  storage: asyncLocalStorage,
  middlewares: [],
  onFileDownload: ignore,
  onImportSuccessful: ignore,
  onUsersCreated: ignore,
  onEntryCreated: ignore,
  onUserDeleted: ignore,
  onEntryDeleted: ignore,
  onSignedEntry: ignore,
  onRequestError: ignore,
  onSagaError: ignore,
  onSigningError: ignore,
  onSyncingLanguageError: ignore,
  onUnsignedEntry: ignore,
  onUnsigningError: ignore,
  onUserUpdated: ignore,
  onLoginFailedInvalidCredentials: ignore,
};

let config: ReduxConfig = defaultConfig;

export const updateConfig = (v: Partial<ReduxConfig>) => {
  config = { ...config, ...v };
};

export const getConfig = () => config;
