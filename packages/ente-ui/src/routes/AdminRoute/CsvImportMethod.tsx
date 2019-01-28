import * as React from "react";
import { Maybe, Some, None } from "monet";
import { CreateUserDto } from "ente-types";
import Dropzone from "react-dropzone";
import { parseCSVFromFile } from "../../helpers/parser";
import { AppState, getStudents } from "ente-ui/src/redux";
import { MapStateToPropsParam, connect } from "react-redux";
import { ValidationError } from "class-validator";
import { Theme, Typography, Grid } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import ErrorDisplay from "./ErrorDisplay";

const useTranslation = makeTranslationHook({
  en: {
    dropzone: "Drop a .csv file or click here."
  },
  de: {
    dropzone: "Legen Sie eine .csv-Datei ab oder klicken Sie hier."
  }
});

const styles = (theme: Theme) =>
  createStyles({
    dropzone: {
      minHeight: 24,
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.spacing.unit,
      padding: theme.spacing.unit * 2,
      boxSizing: "border-box"
    }
  });

const readFile = async (f: File) => {
  const response = new Response(f);
  return await response.text();
};

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

type CsvImportMethodProps = CsvImportMethodOwnProps &
  CsvImportMethodStateProps &
  WithStyles<"dropzone">;

const CsvImportMethod: React.FC<CsvImportMethodProps> = props => {
  const { onImport, usernames, classes } = props;

  const translation = useTranslation();

  const [errors, setErrors] = React.useState<
    Maybe<(ValidationError | string)[]>
  >(None());

  const handleDrop = React.useCallback(
    async (accepted: File[]) => {
      const [file] = accepted;

      if (!file) {
        return;
      }

      const input = await readFile(file);
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
        <Dropzone
          onDrop={handleDrop}
          className={classes.dropzone}
          accept=".csv"
        >
          <Typography variant="body1">{translation.dropzone}</Typography>
        </Dropzone>
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

export default connect(mapStateToProps)(withStyles(styles)(CsvImportMethod));
