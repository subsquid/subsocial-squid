import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'
import * as v1 from './v1'
import * as v9 from './v9'
import * as v15 from './v15'

export class PostsPostCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Posts.PostCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Posts.PostCreated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.PostId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PostsPostDeletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Posts.PostDeleted')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Posts.PostDeleted') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.PostId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PostsPostMovedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Posts.PostMoved')
    this._chain = ctx._chain
    this.event = event
  }

  get isV9(): boolean {
    return this._chain.getEventHash('Posts.PostMoved') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV9(): [v9.AccountId, v9.PostId] {
    assert(this.isV9)
    return this._chain.decodeEvent(this.event)
  }
}

export class PostsPostSharedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Posts.PostShared')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Posts.PostShared') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.PostId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PostsPostUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Posts.PostUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Posts.PostUpdated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.PostId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProfileFollowsAccountFollowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ProfileFollows.AccountFollowed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('ProfileFollows.AccountFollowed') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  get asV1(): [v1.AccountId, v1.AccountId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProfileFollowsAccountUnfollowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ProfileFollows.AccountUnfollowed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('ProfileFollows.AccountUnfollowed') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  get asV1(): [v1.AccountId, v1.AccountId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProfilesProfileCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Profiles.ProfileCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Profiles.ProfileCreated') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  get asV1(): v1.AccountId {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProfilesProfileUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Profiles.ProfileUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Profiles.ProfileUpdated') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  get asV1(): v1.AccountId {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class ReactionsPostReactionCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Reactions.PostReactionCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionCreated') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  get asV1(): [v1.AccountId, v1.PostId, v1.ReactionId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV15(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionCreated') === 'ca26d2ea071b219e270b1a6e49302db57fadc150e90c604899be4c3c166995ae'
  }

  get asV15(): [v15.AccountId, v15.PostId, v15.ReactionId, v15.ReactionKind] {
    assert(this.isV15)
    return this._chain.decodeEvent(this.event)
  }
}

export class ReactionsPostReactionDeletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Reactions.PostReactionDeleted')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionDeleted') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  get asV1(): [v1.AccountId, v1.PostId, v1.ReactionId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV15(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionDeleted') === 'ca26d2ea071b219e270b1a6e49302db57fadc150e90c604899be4c3c166995ae'
  }

  get asV15(): [v15.AccountId, v15.PostId, v15.ReactionId, v15.ReactionKind] {
    assert(this.isV15)
    return this._chain.decodeEvent(this.event)
  }
}

export class ReactionsPostReactionUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Reactions.PostReactionUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionUpdated') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  get asV1(): [v1.AccountId, v1.PostId, v1.ReactionId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV15(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionUpdated') === 'ca26d2ea071b219e270b1a6e49302db57fadc150e90c604899be4c3c166995ae'
  }

  get asV15(): [v15.AccountId, v15.PostId, v15.ReactionId, v15.ReactionKind] {
    assert(this.isV15)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpaceFollowsSpaceFollowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'SpaceFollows.SpaceFollowed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('SpaceFollows.SpaceFollowed') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.SpaceId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpaceFollowsSpaceUnfollowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'SpaceFollows.SpaceUnfollowed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('SpaceFollows.SpaceUnfollowed') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.SpaceId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpacesSpaceCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Spaces.SpaceCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Spaces.SpaceCreated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.SpaceId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpacesSpaceUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Spaces.SpaceUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('Spaces.SpaceUpdated') === 'fb1b6c83a547837ce9f07d7b623e71a4fec6cea1d51d01009d24c5a20e53d816'
  }

  get asV1(): [v1.AccountId, v1.SpaceId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}
