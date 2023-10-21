const UI = {
  page: (sections) => {
    return sections
      .reduce(
        (card, section) => card.addSection(section),
        CardService.newCardBuilder()
      )
      .build();
  },
  section: (header, widgets) => {
    let section = CardService.newCardSection().setHeader(header);
    widgets.forEach((widget) => section.addWidget(widget));
    return section;
  },
  switch: (text, isSelected, functionName) => {
    return CardService.newDecoratedText()
      .setText(text)
      .setSwitchControl(
        CardService.newSwitch()
          .setFieldName("switch")
          .setValue("on")
          .setSelected(isSelected)
          .setOnChangeAction(
            CardService.newAction().setFunctionName(functionName)
          )
      );
  },
  button: (text, functionName) => {
    return CardService.newTextButton()
      .setText(text)
      .setOnClickAction(CardService.newAction().setFunctionName(functionName));
  },
};
