import * as Handlebars from "handlebars";

const title = "Your manager signed an entry.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Your manager signed an entry.
        </mj-text>

        <mj-text>
          You can find it under this address:<br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const ManagerSignedInformationEN = {
  title,
  template,
};
