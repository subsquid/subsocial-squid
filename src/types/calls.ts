import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result} from './support'
import * as v1 from './v1'

export class ReactionsCreatePostReactionCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'Reactions.create_post_reaction')
    this._chain = ctx._chain
    this.call = call
  }

  get isV1(): boolean {
    return this._chain.getCallHash('Reactions.create_post_reaction') === '40a2068cedc002bd126a60b2fdfd6a8420e987d189f9789df116abe34a019b23'
  }

  get asV1(): {postId: v1.PostId, kind: v1.ReactionKind} {
    assert(this.isV1)
    return this._chain.decodeCall(this.call)
  }
}
