import * as React from "react";
import { WithStyles, createStyles, withStyles } from "@material-ui/styles";
import { Theme, Typography } from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import Dropzone from "react-dropzone";

const useTranslation = makeTranslationHook({
  en: {
    dropzone: "Drop an import file or click here.",
  },
  de: {
    dropzone: "Legen Sie eine Import-Datei ab oder klicken Sie hier.",
  },
});

const styles = (theme: Theme) =>
  createStyles({
    dropzone: {
      minHeight: 24,
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.spacing.unit,
      padding: theme.spacing.unit * 2,
      boxSizing: "border-box",
    },
  });

const readFile = async (f: File) => {
  const response = new Response(f);
  return await response.text();
};

interface ImportDropzoneOwnProps {
  onDrop: (s: string) => void;
  accept: string;
}

type ImportDropzoneProps = ImportDropzoneOwnProps & WithStyles<"dropzone">;

const ImportDropzone: React.FC<ImportDropzoneProps> = (props) => {
  const { onDrop, classes, accept } = props;

  const translation = useTranslation();

  const handleDrop = React.useCallback(
    async (accepted: File[]) => {
      const [file] = accepted;

      if (!file) {
        return;
      }

      const input = await readFile(file);

      onDrop(input);
    },
    [onDrop]
  );

  return (
    <Dropzone onDrop={handleDrop} className={classes.dropzone} accept={accept}>
      <Typography variant="body1">{translation.dropzone}</Typography>
    </Dropzone>
  );
};

export default withStyles(styles)(ImportDropzone);
