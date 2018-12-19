const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
require("reflect-metadata");

configure({ adapter: new Adapter() });
