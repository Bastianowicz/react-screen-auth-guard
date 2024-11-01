# Typescript NPM Package Template

Template repository for creating a Typescript NPM package. It uses 
* uplift for creating SemVer by analyzing commit messages (convetional commits)
* jest for testing
* renovate for keeping dependencies up to date

## Usage

* Fork this repository and start developing your package
* Update the package.json with your package details
* Update the README.md with your package details


### CI/CD Configuration
In your github repository, go to `Settings` -> `Secrets` and add the following
* `NPM_TOKEN` - NPM token for publishing the package
* `GH_TOKEN_UPLIFT` - Github token for creating releases

### Test

Run `npm test`
