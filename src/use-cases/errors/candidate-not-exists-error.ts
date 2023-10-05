export class CandidateNotExistsError extends Error {
  constructor() {
    super('Candidate not exists.')
  }
}
