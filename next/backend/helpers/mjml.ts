import _mjml2html from "mjml";

interface MjmlOptions {
  keepComments: boolean;
  beautify: boolean;
  minify: boolean;
  validationLevel: "strict" | "soft" | "skip";
  filePath: string;
}

export const mjml2html = (
  input: string,
  options: Partial<MjmlOptions> = {}
): { errors: any[]; html: string } => _mjml2html(input, options);
