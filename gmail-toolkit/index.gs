const options = PropertiesService.getScriptProperties();

const _updateTrigger = (name, e) => {
  const shouldSet = !!e.commonEventObject.formInputs?.switch;
  if (shouldSet) {
    Triggers.create(name, 1);
    return;
  }
  Triggers.remove(name);
};

// Digests
//
const notesDigestExecute = () =>
  Digests.send({
    label: options.getProperty("notes-label"),
    recipient: options.getProperty("notes-recipient"),
  });
const notesDigestUpdate = (e) => _updateTrigger(notesDigestExecute.name, e);

// GitHubEmails
//
const gitHubLabelsExecute = () =>
  GitHubEmails.label(options.getProperty("github-label"));
const gitHubLabelsUpdate = (e) => _updateTrigger(gitHubLabelsExecute.name, e);

// UI
//
const homepage = () =>
  UI.page([
    UI.section("GitHub Label Maker", [
      UI.switch(
        "Daily Trigger",
        !!Triggers.find(gitHubLabelsExecute.name),
        gitHubLabelsUpdate.name
      ),
      UI.button("Execute", gitHubLabelsExecute.name),
    ]),
    UI.section("Notes Digest", [
      UI.switch(
        "Daily Trigger",
        !!Triggers.find(notesDigestExecute.name),
        notesDigestUpdate.name
      ),
      UI.button("Execute", notesDigestExecute.name),
    ]),
  ]);
