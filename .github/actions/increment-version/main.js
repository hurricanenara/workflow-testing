const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");

const { GH_AUTH_TOKEN } = process.env;

const joinVersions = (...versions) => {
  return versions.join(".");
};

function main() {
  const latestTagVersion = core.getInput("latest-tag-version", {
    required: true,
  });
  // TODO nara 10/04/2023: extract this info from job to bump accordingly
  const isMajorUpdate = false;
  const isMinorUpdate = true;
  const isPatchUpdate = false;

  console.log("Previous version is ", latestTagVersion);

  const [_, version] = latestTagVersion.split("v");
  let [major, minor = 0, patch = 0] = version.split(".");

  if (isMajorUpdate) {
    major++;
  }

  if (isMinorUpdate) {
    minor++;
  }

  if (isPatchUpdate) {
    patch++;
  }

  const versionToRelease = joinVersions(major, minor, patch);
  console.log("Next version is ", versionToRelease);

  core.setOutput("next-tag-version", versionToRelease);

  const {
    context: {
      repo: { owner, repo },
    },
  } = github;

  console.log("context", {
    owner,
    repo,
  });

  try {
    github
      .getOctokit(GH_AUTH_TOKEN || core.getInput("gh_token"))
      .rest.repos.createRelease({
        owner,
        repo,
        tag_name: `v${versionToRelease}`,
      });

    console.log("Release created");
  } catch (error) {
    console.log("error", { error });
  }
}

main();
