'use strict';

const { Contract } = require('fabric-contract-api');

class ElectionContract extends Contract {
  async InitLedger(ctx) {
    const candidates = [
      {
        id: '1',
        paslon: 'Jokowi & Maruf Amin',
        perolehan_suara: 0
      },
      {
        id: '2',
        paslon: 'Prabowo & Sandiaga Uno',
        perolehan_suara: 0
      },
    ];

    for (const candidate of candidates) {
      await ctx.stub.putState(candidate.id, Buffer.from(JSON.stringify(candidate)));
    }
  }

  async Vote(ctx, candidateId) {
    const candidateAsBytes = await ctx.stub.getState(candidateId);

    if (!candidateAsBytes || candidateAsBytes.length === 0) {
      throw new Error(`Candidate with id ${candidateId} does not exist.`);
    }

    const candidate = JSON.parse(candidateAsBytes.toString());

    candidate.perolehan_suara++;

    await ctx.stub.putState(candidateId, Buffer.from(JSON.stringify(candidate)));
  }

  async GetResults(ctx) {
    const candidates = [
      {
        id: '1',
        paslon: 'Jokowi & Maruf Amin',
        perolehan_suara: 0
      },
      {
        id: '2',
        paslon: 'Prabowo & Sandiaga Uno',
        perolehan_suara: 0
      },
    ];

    for (const candidate of candidates) {
      const candidateAsBytes = await ctx.stub.getState(candidate.id);

      if (!candidateAsBytes || candidateAsBytes.length === 0) {
        throw new Error(`Candidate with id ${candidate.id} does not exist.`);
      }

      const candidateFromLedger = JSON.parse(candidateAsBytes.toString());

      candidate.perolehan_suara = candidateFromLedger.perolehan_suara;
    }

    return candidates;
  }
}

module.exports = ElectionContract;
