interface BaseClassifier {
  type: string;
}

export interface HomogenousClassifier extends BaseClassifier {
  type: 'homogenous-classifier';
}

export type Classifier = HomogenousClassifier;

export function isHomogenousClassifier(classifier: Classifier): classifier is HomogenousClassifier {
  return classifier.type === 'homogenous-classifier';
}
