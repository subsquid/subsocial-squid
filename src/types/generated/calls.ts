import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result} from './support'
import * as v13 from './v13'

export class PostsCreatePostCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'Posts.create_post')
    this._chain = ctx._chain
    this.call = call
  }

  get isV13(): boolean {
    return this._chain.getCallHash('Posts.create_post') === '13cf8f56f66250567e65ce0c2f684f94aac1d468477a4bc95459f9e824a0ccd8'
  }

  get asV13(): {spaceIdOpt: (bigint | undefined), extension: v13.PostExtension, content: v13.Content} {
    assert(this.isV13)
    return this._chain.decodeCall(this.call)
  }
}

export class PostsMovePostCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'Posts.move_post')
    this._chain = ctx._chain
    this.call = call
  }

  get isV13(): boolean {
    return this._chain.getCallHash('Posts.move_post') === '478dc9b8210ec3e52e94f9e8c5066f483455585059d77f7021e5766e761f7513'
  }

  get asV13(): {postId: bigint, newSpaceId: (bigint | undefined)} {
    assert(this.isV13)
    return this._chain.decodeCall(this.call)
  }
}

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

  get isV13(): boolean {
    return this._chain.getCallHash('Reactions.create_post_reaction') === '40a2068cedc002bd126a60b2fdfd6a8420e987d189f9789df116abe34a019b23'
  }

  get asV13(): {postId: bigint, kind: v13.ReactionKind} {
    assert(this.isV13)
    return this._chain.decodeCall(this.call)
  }
}

export class ReactionsUpdatePostReactionCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'Reactions.update_post_reaction')
    this._chain = ctx._chain
    this.call = call
  }

  get isV13(): boolean {
    return this._chain.getCallHash('Reactions.update_post_reaction') === 'd06582c6fcf18f040305ce7b19db3c68689a72d1b24731900e8960ed4d399dfe'
  }

  get asV13(): {postId: bigint, reactionId: bigint, newKind: v13.ReactionKind} {
    assert(this.isV13)
    return this._chain.decodeCall(this.call)
  }
}
