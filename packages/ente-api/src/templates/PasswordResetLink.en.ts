import * as Handlebars from "handlebars";

const title = "Reset Password";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Reset Password
        </mj-text>
        
        <mj-text>
          Somebody requested a password-reset for the following account:
        <br /> <br />
          {{ username }}
        <br /> <br />

          If this was not intentional, please ignore this email.

        <br />
          To reset your password, click on the following link:
          
        <br /> <br />
          
        <a href="{{linkAddress}}">{{linkDisplay}}</a>
        
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const PasswordResetLinkEN = {
  title,
  template
};
