export class TooManyDependentsError extends Error {
  constructor() {
    super('Too many legal dependents to this Legal Responsible')
  }
}
