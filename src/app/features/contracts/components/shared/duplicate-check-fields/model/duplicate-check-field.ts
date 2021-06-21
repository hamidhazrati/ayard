export class DuplicateCheckField {
  label: string;
  hashExpression: string;

  constructor(label: string, hashExpression: string) {
    this.label = label;
    this.hashExpression = hashExpression;
  }
}
