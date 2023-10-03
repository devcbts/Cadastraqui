export class CandidateAlreadyExistsError extends Error {
  constructor() {
    super('Candidate already exists with this email.')
  }
}
