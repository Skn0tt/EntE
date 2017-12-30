export interface SignedInformationOptions {
  subject: string;
  preview: string;
  link_display: string;
  link_address: string;
}

export default `
<heml>
  <head>
    <subject>{{subject}}</subject>
    <preview>{{preview}}</preview>
  </head>
  <body>
    <container>
      <h1>
        EntschuldigungsVerfahren
      </h1>
      Eines ihrer Kinder hat einen neuen Eintrag erstellt.<br />
      Sie finden diese unter folgender Addresse:<br />
      
      <a href="{{link_address}}">{{link_display}}</a>
    </container>
  </body>
</heml>
`;
