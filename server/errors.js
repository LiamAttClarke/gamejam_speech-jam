class PreconditionNotSatisfied extends Error {
  constructor(message) {
    super(message);
    this.name = 'PreconditionNotSatisfied';
  }
}

module.exports = {
  PreconditionNotSatisfied
};
