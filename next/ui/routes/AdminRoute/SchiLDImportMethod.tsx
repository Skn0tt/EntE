import * as React from "react";
import { Maybe, Some, None } from "monet";
import { CreateUserDto } from "@@types";
import ImportDropzone from "./ImportDropzone";
import { SchildParser } from "../../schild-import/schild.parser";
import { Grid } from "@material-ui/core";
import { ValidationError } from "class-validator";
import ErrorDisplay from "./ErrorDisplay";

interface SchiLDImportMethodOwnProps {
  onImport: (u: Maybe<CreateUserDto[]>) => void;
  existingUsernames: string[];
}

type SchiLDImportMethodProps = SchiLDImportMethodOwnProps;

export const SchiLDImportMethod: React.FC<SchiLDImportMethodProps> = props => {
  const { onImport, existingUsernames } = props;

  const [errors, setErrors] = React.useState<(ValidationError | string)[]>([]);

  const handleDrop = React.useCallback(
    async (input: string) => {
      try {
        const result = SchildParser.parseWithValidation(
          input,
          existingUsernames
        );
        result.cata(
          errors => {
            setErrors(errors);
            onImport(None());
          },
          dtos => {
            setErrors([]);
            onImport(Some(dtos));
          }
        );
      } catch (error) {}
    },
    [onImport, existingUsernames, setErrors]
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <ImportDropzone onDrop={handleDrop} accept="" />
      </Grid>
      {errors.length !== 0 && (
        <Grid item xs={12}>
          <ErrorDisplay errors={errors} />
        </Grid>
      )}
    </Grid>
  );
};
