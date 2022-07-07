import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result} from './support'
import * as v1 from './v1'
import * as v9 from './v9'
import * as v17 from './v17'

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

  get isV1(): boolean {
    return this._chain.getCallHash('Posts.create_post') === '35e3551453631d0469eeb2673097d1e762dbb75c8cdd952d8e3cba800aa92f8e'
  }

  get asV1(): {spaceIdOpt: (v1.SpaceId | undefined), extension: v1.PostExtension, content: v1.Content} {
    assert(this.isV1)
    return this._chain.decodeCall(this.call)
  }

  get isV17(): boolean {
    return this._chain.getCallHash('Posts.create_post') === '63c9f322c5b12d6187db33373254e9ec2c7314b8dcacd1bf79a9a0e773dc121c'
  }

  get asV17(): {spaceIdOpt: (bigint | undefined), extension: v17.PostExtension, content: v17.Content} {
    assert(this.isV17)
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

  get isV9(): boolean {
    return this._chain.getCallHash('Posts.move_post') === '478dc9b8210ec3e52e94f9e8c5066f483455585059d77f7021e5766e761f7513'
  }

  get asV9(): {postId: v9.PostId, newSpaceId: (v9.SpaceId | undefined)} {
    assert(this.isV9)
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

  get isV1(): boolean {
    return this._chain.getCallHash('Reactions.create_post_reaction') === '40a2068cedc002bd126a60b2fdfd6a8420e987d189f9789df116abe34a019b23'
  }

  get asV1(): {postId: v1.PostId, kind: v1.ReactionKind} {
    assert(this.isV1)
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

  get isV1(): boolean {
    return this._chain.getCallHash('Reactions.update_post_reaction') === 'd06582c6fcf18f040305ce7b19db3c68689a72d1b24731900e8960ed4d399dfe'
  }

  get asV1(): {postId: v1.PostId, reactionId: v1.ReactionId, newKind: v1.ReactionKind} {
    assert(this.isV1)
    return this._chain.decodeCall(this.call)
  }
}
