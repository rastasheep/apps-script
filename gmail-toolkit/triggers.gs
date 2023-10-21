const Triggers = {
  create: (name, everyDays) => {
    return ScriptApp.newTrigger(name).timeBased().everyDays(everyDays).create();
  },
  remove: (name) => {
    console.log(Trigger.find(name));
    return ScriptApp.deleteTrigger(Trigger.find(name));
  },
  find: (name) => {
    return ScriptApp.getProjectTriggers().find(
      (t) => t.getHandlerFunction() === name
    );
  },
};
