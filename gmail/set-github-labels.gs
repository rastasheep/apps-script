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

// Maximum number of message threads to process per run. 
var PAGE_SIZE = 150

var LABEL_NAMESPACE = "GH"

/**
 * Create a trigger that executes the function every hour.
 * Execute this function to install the script.
 */
function setTriggers() {
  ScriptApp
    .newTrigger('updateGitHubLabels')
    .timeBased()
    .everyHours(1)
    .create()
}

/**
 * Deletes all of the project's triggers
 * Execute this function to unintstall the script.
 */
function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger)
  })
}

function updateGitHubLabels() {
  
  var search = `in:${LABEL_NAMESPACE}`   
  var threads = GmailApp.search(search, 0, PAGE_SIZE)
  
  if (threads.length === PAGE_SIZE) {
    console.log('PAGE_SIZE exceeded')
  }
  
  console.log('Processing ' + threads.length + ' threads...')
  
  // For each thread matching our search
  threads.forEach(thread => {
    if(thread.getLabels().length > 3){
      Logger.log('Labels already in place for: ' + subject)
      return
    }
    const subject = thread.getFirstMessageSubject()
    const label = getLabel(subject)
    Logger.log(`Labeling'${subject}' with '${label.getName()}'`)

    label.addToThread(thread);
  })
}

function getLabel(subject) {
  repo = Array.from(subject.matchAll(/\[.*\/(.*?)\]/g), m => m[1])[0];
  
  return GmailApp.createLabel(`${LABEL_NAMESPACE}/${repo}`)
}