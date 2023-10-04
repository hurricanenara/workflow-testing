const core = require("@actions/core");
const exec = require("@actions/exec");

function run() {
  const testInput = core.getInput("testing");
  console.log("$_$");
  core.setOutput("next-version", testInput);
}

run();
