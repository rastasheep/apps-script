const options = PropertiesService.getScriptProperties();

// DigestScript
//
const notesDigestExecute = () => DigestScript.execute({
  label: options.getProperty('notes-label'),
  recipient: options.getProperty('notes-recipient')
});

const notesDigestUp = () => DigestScript.up(notesDigestExecute.name);
const notesDigestDown = () => DigestScript.down(notesDigestExecute.name);

// GitHubLabelsScript
//
const gitHubLabelsExecute = () => GitHubLabelsScript.execute({
  label: options.getProperty('github-label'),
});

const gitHubLabelsUp = () => GitHubLabelsScript.up(gitHubLabelsExecute.name);
const gitHubLabelsDown = () => GitHubLabelsScript.down(gitHubLabelsExecute.name);