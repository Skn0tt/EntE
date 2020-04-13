import * as Handlebars from "handlebars";

const title = "Successfully Changed Password";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Successfully changed password
        </mj-text>
        
        <mj-text>
          The password for the account "{{ username }}" has been updated successfully.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const PasswordResetSuccessEN = {
  title,
  template,
};
