/*
* set-github-labels
* 
* This script goes through your Gmail Inbox and finds emails labeled with ${LABEL_NAMESPACE}.
* It then reads the subject of each email and applies an additional label that represents the repo name.
* New label is in the following format: ${LABEL_NAMESPACE}/${REPO}
*
* Example:
*   Subject: "[rastasheep/dotfiles] Nix setup (PR #31)"
*   Resulting labels: ${LABEL_NAMESPACE}, ${LABEL_NAMESPACE}/dotfiles
*/

class GitHubLabelsScript {
  // (re)Create a trigger that executes the function every hour.
  static up(functionName) {
    this.down(functionName);
    ScriptApp
      .newTrigger(functionName)
      .timeBased()
      .everyDays(1)
      .create();
  }
  // Deletes all of the project's triggers
  static down(functionName) {
    ScriptApp.getProjectTriggers().forEach(trigger => {
      if (trigger.getHandlerFunction() === functionName) {
        ScriptApp.deleteTrigger(trigger);
      }
    })
  }

  // Execute logic
  static execute({ label }) {
    const threads = GmailApp.search(`in:${label}`, 0, 150);

    if (!threads) {
      console.log(`[GitHubLabelsScript] no messages found`);
      return;
    }

    if (threads.length === 150) {
      console.log(`[GitHubLabelsScript] max messages limit  exceeded, processing first 150 results`);
    }

    console.log(`[GitHubLabelsScript] processing  ${threads} threads`);

    threads.forEach(thread => {
      if (thread.getLabels().length > 3) {
        console.log(`[GitHubLabelsScript] Labels already in place for: ${subject}`);
        return;
      }
      const subject = thread.getFirstMessageSubject();
      const newLabel = this._getLabel(label, subject);
      console.log(`[GitHubLabelsScript] Labeling'${subject}' with '${newLabel.getName()}'`);

      newLabel.addToThread(thread);
    })
  }

  static _getLabel(baseLabel, subject) {
    const repo = Array.from(subject.matchAll(/\[.*\/(.*?)\]/g), m => m[1])[0];

    return GmailApp.createLabel(`${baseLabel}/${repo}`);
  }
}