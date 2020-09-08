import { Grid, Typography } from "@material-ui/core";
import { Center } from "../ui/components/Center";
import MUILink from "@material-ui/core/Link";
import Link from "next/link";
import { makeTranslationHook } from "../ui/helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    notFound: "Page was not found.",
    toStartPage: "Open Homepage",
  },
  de: {
    notFound: "Hier ist nichts.",
    toStartPage: "Zur Startseite",
  },
});

export default function NotFound() {
  const lang = useTranslation();
  return (
    <Center>
      <Grid item>
        <img src="/Diggie.png" height={400} />
      </Grid>
      <Grid item>
        <Typography variant="h6">{lang.notFound}</Typography>
        <Link href="/">
          <MUILink variant="h6" component="a">
            {lang.toStartPage}
          </MUILink>
        </Link>
      </Grid>
    </Center>
  );
}
