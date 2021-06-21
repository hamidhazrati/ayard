export function getArrayWithDistinctValues(array: any[]): any[] {
  return array.filter((value: string, index: number, currentArray: any[]) => {
    return currentArray.indexOf(value) === index;
  });
}
