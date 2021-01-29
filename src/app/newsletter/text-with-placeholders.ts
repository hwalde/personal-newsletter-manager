export class TextWithPlaceholders {

  private usedPlaceHolderMap = new Map<string, boolean>();

  constructor(private text: string, private knownPlaceHolderList: string[]) {
    this.analyseUsedPlaceholders();
  }

  private analyseUsedPlaceholders(): void
  {
    this.usedPlaceHolderMap = new Map<string, boolean>();
    this.knownPlaceHolderList.forEach(placeHolderCode => {
      this.usedPlaceHolderMap.set(placeHolderCode, this.existsPlaceholder(placeHolderCode));
    });
  }

  private existsPlaceholder(code: string): boolean
  {
    const result = this.text.match(new RegExp("{{" + code + "}}","g"));
    return result?.length > 0;
  }

  public isUsingPlaceholder(code: string): boolean
  {
    return this.usedPlaceHolderMap.get(code) === true;
  }

  public compileText(placeHolderReplaceMap: Map<string, string>): string
  {
    let replacements = this.generateReplacements(placeHolderReplaceMap);

    return this.text.replace(/{{\w+}}/g, function(placeholder) {
      return replacements[placeholder] || placeholder;
    });
  }

  private generateReplacements(placeHolderReplaceMap: Map<string, string>) {
    let replacements = {};

    this.usedPlaceHolderMap.forEach((isUsed, placeHolderName) => {
      if (isUsed && placeHolderReplaceMap.has(placeHolderName)) {
        replacements["{{" + placeHolderName + "}}"] = placeHolderReplaceMap.get(placeHolderName);
      }
    });

    return replacements;
  }

}
