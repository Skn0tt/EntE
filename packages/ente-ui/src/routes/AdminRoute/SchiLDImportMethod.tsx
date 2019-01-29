import * as React from "react";
import { Maybe, Some, None } from "monet";
import { CreateUserDto } from "ente-types";
import ImportDropzone from "./ImportDropzone";
import { SchildParser } from "../../schild-import/schild.parser";

interface SchiLDImportMethodOwnProps {
  onImport: (u: Maybe<CreateUserDto[]>) => void;
}

type SchiLDImportMethodProps = SchiLDImportMethodOwnProps;

export const SchiLDImportMethod: React.FC<SchiLDImportMethodProps> = props => {
  const { onImport } = props;

  const handleDrop = React.useCallback(
    async (input: string) => {
      try {
        const result = SchildParser.parse(input);
        onImport(Some(result));
      } catch (error) {
        onImport(None());
      }
    },
    [onImport]
  );

  return <ImportDropzone onDrop={handleDrop} accept="" />;
};
