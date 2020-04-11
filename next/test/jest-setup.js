// https://github.com/nestjs/nest/issues/1305
require("reflect-metadata");

// Setup Enzyme
const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });
