import * as React from "react";
import { Maybe, Some, None } from "monet";
import { CreateUserDto } from "ente-types";
import { parseCSVFromFile } from "../../helpers/parser";
import { AppState, getStudents } from "ente-ui/src/redux";
import { MapStateToPropsParam, connect } from "react-redux";
import { ValidationError } from "class-validator";
import { Grid } from "@material-ui/core";
import ErrorDisplay from "./ErrorDisplay";
import ImportDropzone from "./ImportDropzone";

interface CsvImportMethodOwnProps {
  onImport: (u: Maybe<CreateUserDto[]>) => void;
}

interface CsvImportMethodStateProps {
  usernames: string[];
}
const mapStateToProps: MapStateToPropsParam<
  CsvImportMethodStateProps,
  CsvImportMethodOwnProps,
  AppState
> = state => ({
  usernames: getStudents(state).map(u => u.get("username"))
});

type CsvImportMethodProps = CsvImportMethodOwnProps & CsvImportMethodStateProps;

const CsvImportMethod: React.FC<CsvImportMethodProps> = props => {
  const { onImport, usernames } = props;

  const [errors, setErrors] = React.useState<
    Maybe<(ValidationError | string)[]>
  >(None());

  const handleDrop = React.useCallback(
    async (input: string) => {
      const result = await parseCSVFromFile(input, usernames);
      result.forEach(success => {
        onImport(Some(success));
        setErrors(None());
      });
      result.forEachFail(fail => {
        onImport(None());
        setErrors(Some(fail));
      });
    },
    [setErrors, onImport]
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

export default connect(mapStateToProps)(CsvImportMethod);
