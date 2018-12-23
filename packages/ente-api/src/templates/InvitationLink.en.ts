import * as Handlebars from "handlebars";

const title = "You have been invited to EntE.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          You have been invited to EntE.
        </mj-text>
        
        <mj-text>
          You have been invited to manage your children's missed lessons on EntE.
          In order to be able to use EntE, please set your password using the following link.
          
          <br /> <br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>

          <br /> <br />

          This link is valid for seven days.
          If your link is too old, refer to the <a href="https://skn0tt.gitlab.io/EntE/docs/">documentation</a>
          to find out how you can activate your account.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const InvitationLinkEN = {
  title,
  template
};
