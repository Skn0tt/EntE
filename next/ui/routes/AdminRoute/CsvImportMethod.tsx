import * as React from "react";
import { Maybe, Some, None } from "monet";
import { CreateUserDto } from "@@types";
import { parseCSVFromFile } from "../../helpers/parser";
import { ValidationError } from "class-validator";
import { Grid } from "@material-ui/core";
import ErrorDisplay from "./ErrorDisplay";
import ImportDropzone from "./ImportDropzone";

interface CsvImportMethodOwnProps {
  onImport: (u: Maybe<CreateUserDto[]>) => void;
  existingUsernames: string[];
}

type CsvImportMethodProps = CsvImportMethodOwnProps;

const CsvImportMethod: React.FC<CsvImportMethodProps> = props => {
  const { onImport, existingUsernames } = props;

  const [errors, setErrors] = React.useState<
    Maybe<(ValidationError | string)[]>
  >(None());

  const handleDrop = React.useCallback(
    async (input: string) => {
      const result = await parseCSVFromFile(input, existingUsernames);
      result.forEach(success => {
        onImport(Some(success));
        setErrors(None());
      });
      result.forEachFail(fail => {
        onImport(None());
        setErrors(Some(fail));
      });
    },
    [setErrors, onImport, existingUsernames]
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <ImportDropzone onDrop={handleDrop} accept=".csv" />
      </Grid>
      {errors
        .map(errors => (
          <Grid item xs={12}>
            <ErrorDisplay errors={errors} />
          </Grid>
        ))
        .orSome(<></>)}
    </Grid>
  );
};

export default CsvImportMethod;
