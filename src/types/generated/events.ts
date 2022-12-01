import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v1 from './v1'
import * as v2 from './v2'
import * as v5 from './v5'
import * as v10 from './v10'
import * as v12 from './v12'
import * as v13 from './v13'
import * as v16 from './v16'

export class AccountFollowsAccountFollowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'AccountFollows.AccountFollowed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('AccountFollows.AccountFollowed') === '58dcd964d7fecf10fd85a4b5f5055a33d6cd8c1d0a60f35895e4b2d02f69670d'
  }

  get asV13(): {follower: Uint8Array, account: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class AccountFollowsAccountUnfollowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'AccountFollows.AccountUnfollowed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('AccountFollows.AccountUnfollowed') === '58dcd964d7fecf10fd85a4b5f5055a33d6cd8c1d0a60f35895e4b2d02f69670d'
  }

  get asV13(): {follower: Uint8Array, account: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesBalanceSetEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.BalanceSet')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A balance was set by root. \[who, free, reserved\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.BalanceSet') === '0f263bfdefa394edfb38d20d33662423a2e0902235b599f9b2b0292f157f0902'
  }

  /**
   * A balance was set by root. \[who, free, reserved\]
   */
  get asV1(): [Uint8Array, bigint, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A balance was set by root.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.BalanceSet') === '1e2b5d5a07046e6d6e5507661d3f3feaddfb41fc609a2336b24957322080ca77'
  }

  /**
   * A balance was set by root.
   */
  get asV2(): {who: Uint8Array, free: bigint, reserved: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesDepositEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Deposit')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some amount was deposited into the account (e.g. for transaction fees). \[who,
   * deposit\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Deposit') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some amount was deposited into the account (e.g. for transaction fees). \[who,
   * deposit\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Deposit') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asV2(): {who: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesDustLostEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.DustLost')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss. \[account, balance\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.DustLost') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss. \[account, balance\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.DustLost') === '504f155afb2789c50df19d1f747fb2dc0e99bf8b7623c30bdb5cf82029fec760'
  }

  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  get asV2(): {account: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesEndowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Endowed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An account was created with some free balance. \[account, free_balance\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Endowed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * An account was created with some free balance. \[account, free_balance\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An account was created with some free balance.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Endowed') === '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
  }

  /**
   * An account was created with some free balance.
   */
  get asV2(): {account: Uint8Array, freeBalance: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesReserveRepatriatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.ReserveRepatriated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   * \[from, to, balance, destination_status\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.ReserveRepatriated') === '68e9ec5664c8ffe977da0c890bac43122a5cf13565c1c936e2120ba4980bcf31'
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   * \[from, to, balance, destination_status\]
   */
  get asV1(): [Uint8Array, Uint8Array, bigint, v1.BalanceStatus] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.ReserveRepatriated') === '6232d50d422cea3a6fd21da36387df36d1d366405d0c589566c6de85c9cf541f'
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get asV2(): {from: Uint8Array, to: Uint8Array, amount: bigint, destinationStatus: v2.BalanceStatus} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesReservedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Reserved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Reserved') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Reserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asV2(): {who: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesSlashedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Slashed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior). \[who,
   * amount_slashed\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Slashed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior). \[who,
   * amount_slashed\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Slashed') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get asV2(): {who: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesTransferEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Transfer')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Transfer succeeded. \[from, to, value\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
  }

  /**
   * Transfer succeeded. \[from, to, value\]
   */
  get asV1(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Transfer succeeded.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV2(): {from: Uint8Array, to: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesUnreservedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Unreserved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some balance was unreserved (moved from reserved to free). \[who, value\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Unreserved') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some balance was unreserved (moved from reserved to free). \[who, value\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Unreserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get asV2(): {who: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesWithdrawEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Withdraw')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Balances.Withdraw') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Balances.Withdraw') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asV2(): {who: Uint8Array, amount: bigint} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }
}

export class CollatorSelectionCandidateAddedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CollatorSelection.CandidateAdded')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('CollatorSelection.CandidateAdded') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV13(): boolean {
    return this._chain.getEventHash('CollatorSelection.CandidateAdded') === 'ba2022a97694b35bf4119d93cf1f9f270614aff290c97ed529225ca32df45f8a'
  }

  get asV13(): {accountId: Uint8Array, deposit: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class CollatorSelectionCandidateRemovedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CollatorSelection.CandidateRemoved')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('CollatorSelection.CandidateRemoved') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV13(): boolean {
    return this._chain.getEventHash('CollatorSelection.CandidateRemoved') === '4c99ef39b683041b136506afc1f762bdcd37f0231162345da388897a103d3710'
  }

  get asV13(): {accountId: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class CollatorSelectionNewCandidacyBondEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CollatorSelection.NewCandidacyBond')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('CollatorSelection.NewCandidacyBond') === '47b59f698451e50cce59979f0121e842fa3f8b2bcef2e388222dbd69849514f9'
  }

  get asV1(): bigint {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV13(): boolean {
    return this._chain.getEventHash('CollatorSelection.NewCandidacyBond') === 'c1e41dad3e2e938a30a6e043071efd6f20574fa878a8043a120b11c1f28ed0fe'
  }

  get asV13(): {bondAmount: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class CollatorSelectionNewDesiredCandidatesEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CollatorSelection.NewDesiredCandidates')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('CollatorSelection.NewDesiredCandidates') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  get asV1(): number {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV13(): boolean {
    return this._chain.getEventHash('CollatorSelection.NewDesiredCandidates') === 'f0a2b1451ce79defe5cc2f882fbd32834fc174fbd0c05020004cbd720a4aa77e'
  }

  get asV13(): {desiredCandidates: number} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class CollatorSelectionNewInvulnerablesEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CollatorSelection.NewInvulnerables')
    this._chain = ctx._chain
    this.event = event
  }

  get isV1(): boolean {
    return this._chain.getEventHash('CollatorSelection.NewInvulnerables') === 'b108f68a3a6ead7fe33d80e59b6d7124fdd14cd6108c81ad0b9d713fd6046122'
  }

  get asV1(): Uint8Array[] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  get isV13(): boolean {
    return this._chain.getEventHash('CollatorSelection.NewInvulnerables') === '994c18897efc6a5b0e11aeb337b6c718ad03cb0eb182a442fc74b9c80dd56313'
  }

  get asV13(): {invulnerables: Uint8Array[]} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class CumulusXcmExecutedDownwardEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CumulusXcm.ExecutedDownward')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('CumulusXcm.ExecutedDownward') === 'ce1ecc6cb7bde7a0e967ed0e6caff9002b8e335404bc1e51403dc21d44028613'
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get asV1(): [Uint8Array, v1.V2Outcome] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('CumulusXcm.ExecutedDownward') === '155c7cce0948b8cb240d1401bb772a72b24567aa52618e9a4aaa84271c380044'
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get asV5(): [Uint8Array, v5.V2Outcome] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class CumulusXcmInvalidFormatEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CumulusXcm.InvalidFormat')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message is invalid XCM.
   * \[ id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('CumulusXcm.InvalidFormat') === '6e16a60605a9f0946795787675f1f0ec4f4cd1665cfea6599116111a008c8f0e'
  }

  /**
   * Downward message is invalid XCM.
   * \[ id \]
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class CumulusXcmUnsupportedVersionEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'CumulusXcm.UnsupportedVersion')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message is unsupported version of XCM.
   * \[ id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('CumulusXcm.UnsupportedVersion') === '6e16a60605a9f0946795787675f1f0ec4f4cd1665cfea6599116111a008c8f0e'
  }

  /**
   * Downward message is unsupported version of XCM.
   * \[ id \]
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class DmpQueueExecutedDownwardEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'DmpQueue.ExecutedDownward')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('DmpQueue.ExecutedDownward') === 'f660a1eb74571095e7cab99beb471c0ab4687ebb9afcd9f8734fc316dd9f477d'
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get asV1(): [Uint8Array, v1.V2Outcome] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('DmpQueue.ExecutedDownward') === '286143d78cae88e1dcd7f8fca6da4dcb49ebc3ba61ad473eec7ff13812f3fd56'
  }

  /**
   * Downward message executed with the given outcome.
   * \[ id, outcome \]
   */
  get asV5(): [Uint8Array, v5.V2Outcome] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message executed with the given outcome.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('DmpQueue.ExecutedDownward') === '9b6c90aca74067a591eda76a227e61ce66cd6597483f828a039aba267c0d21a9'
  }

  /**
   * Downward message executed with the given outcome.
   */
  get asV13(): {messageId: Uint8Array, outcome: v13.V2Outcome} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class DmpQueueInvalidFormatEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'DmpQueue.InvalidFormat')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message is invalid XCM.
   * \[ id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('DmpQueue.InvalidFormat') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * Downward message is invalid XCM.
   * \[ id \]
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message is invalid XCM.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('DmpQueue.InvalidFormat') === '6bcb1469518e8e7bacd0242af782ebd652887f65f7377a9b2d81ccea6505416e'
  }

  /**
   * Downward message is invalid XCM.
   */
  get asV13(): {messageId: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class DmpQueueOverweightEnqueuedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'DmpQueue.OverweightEnqueued')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message is overweight and was placed in the overweight queue.
   * \[ id, index, required \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('DmpQueue.OverweightEnqueued') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  /**
   * Downward message is overweight and was placed in the overweight queue.
   * \[ id, index, required \]
   */
  get asV1(): [Uint8Array, bigint, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message is overweight and was placed in the overweight queue.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('DmpQueue.OverweightEnqueued') === 'ffa192c80e10233d155345fc4cc34bc357a97a6465c78ccf6a14b02ee5b8c21f'
  }

  /**
   * Downward message is overweight and was placed in the overweight queue.
   */
  get asV13(): {messageId: Uint8Array, overweightIndex: bigint, requiredWeight: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class DmpQueueOverweightServicedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'DmpQueue.OverweightServiced')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message from the overweight queue was executed.
   * \[ index, used \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('DmpQueue.OverweightServiced') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110'
  }

  /**
   * Downward message from the overweight queue was executed.
   * \[ index, used \]
   */
  get asV1(): [bigint, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message from the overweight queue was executed.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('DmpQueue.OverweightServiced') === '7deec7d9ba4a81157571b321671d50b393890bd802f27d9b3ba2609ffa497713'
  }

  /**
   * Downward message from the overweight queue was executed.
   */
  get asV13(): {overweightIndex: bigint, weightUsed: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class DmpQueueUnsupportedVersionEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'DmpQueue.UnsupportedVersion')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward message is unsupported version of XCM.
   * \[ id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('DmpQueue.UnsupportedVersion') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * Downward message is unsupported version of XCM.
   * \[ id \]
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward message is unsupported version of XCM.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('DmpQueue.UnsupportedVersion') === '6bcb1469518e8e7bacd0242af782ebd652887f65f7377a9b2d81ccea6505416e'
  }

  /**
   * Downward message is unsupported version of XCM.
   */
  get asV13(): {messageId: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class DmpQueueWeightExhaustedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'DmpQueue.WeightExhausted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The weight limit for handling downward messages was reached.
   * \[ id, remaining, required \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('DmpQueue.WeightExhausted') === '5ecf574fedb0dd818c5b40ec149d9c842d218107d35c4018d00cc169f56e1267'
  }

  /**
   * The weight limit for handling downward messages was reached.
   * \[ id, remaining, required \]
   */
  get asV1(): [Uint8Array, bigint, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * The weight limit for handling downward messages was reached.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('DmpQueue.WeightExhausted') === 'dcf12831e69a1760af0584247b404096aa4ce1c77c7b3caae95d831bf4afa0b2'
  }

  /**
   * The weight limit for handling downward messages was reached.
   */
  get asV13(): {messageId: Uint8Array, remainingWeight: bigint, requiredWeight: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class DomainsDomainMetaUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Domains.DomainMetaUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The domain meta was successfully updated.
   */
  get isV7(): boolean {
    return this._chain.getEventHash('Domains.DomainMetaUpdated') === '73beec149671d4cb018751c97dbc6bc98a8f2fe07dd82943d2a8e39de980066e'
  }

  /**
   * The domain meta was successfully updated.
   */
  get asV7(): {who: Uint8Array, domain: Uint8Array} {
    assert(this.isV7)
    return this._chain.decodeEvent(this.event)
  }
}

export class DomainsDomainRegisteredEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Domains.DomainRegistered')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The domain name was successfully registered.
   */
  get isV7(): boolean {
    return this._chain.getEventHash('Domains.DomainRegistered') === '73beec149671d4cb018751c97dbc6bc98a8f2fe07dd82943d2a8e39de980066e'
  }

  /**
   * The domain name was successfully registered.
   */
  get asV7(): {who: Uint8Array, domain: Uint8Array} {
    assert(this.isV7)
    return this._chain.decodeEvent(this.event)
  }
}

export class DomainsNewTldsSupportedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Domains.NewTldsSupported')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Added support for new TLDs (top-level domains).
   */
  get isV7(): boolean {
    return this._chain.getEventHash('Domains.NewTldsSupported') === '1cdbdc8ac203922f95ae6ab3e8b98004e956389f7ec11480ec5633d29b48cf71'
  }

  /**
   * Added support for new TLDs (top-level domains).
   */
  get asV7(): {count: number} {
    assert(this.isV7)
    return this._chain.decodeEvent(this.event)
  }
}

export class DomainsNewWordsReservedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Domains.NewWordsReserved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * New words have been reserved.
   */
  get isV7(): boolean {
    return this._chain.getEventHash('Domains.NewWordsReserved') === '1cdbdc8ac203922f95ae6ab3e8b98004e956389f7ec11480ec5633d29b48cf71'
  }

  /**
   * New words have been reserved.
   */
  get asV7(): {count: number} {
    assert(this.isV7)
    return this._chain.decodeEvent(this.event)
  }
}

export class EnergyDustLostEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Energy.DustLost')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An account was removed whose balance was non-zero but below
   * ExistentialDeposit, resulting in an outright loss.
   */
  get isV14(): boolean {
    return this._chain.getEventHash('Energy.DustLost') === '504f155afb2789c50df19d1f747fb2dc0e99bf8b7623c30bdb5cf82029fec760'
  }

  /**
   * An account was removed whose balance was non-zero but below
   * ExistentialDeposit, resulting in an outright loss.
   */
  get asV14(): {account: Uint8Array, amount: bigint} {
    assert(this.isV14)
    return this._chain.decodeEvent(this.event)
  }
}

export class EnergyEnergyGeneratedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Energy.EnergyGenerated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Energy have been generated to an account.
   */
  get isV14(): boolean {
    return this._chain.getEventHash('Energy.EnergyGenerated') === '4bcd85519e0eb73207f6e8611168616ad5d200319097a6b48dca9900af5d70f4'
  }

  /**
   * Energy have been generated to an account.
   */
  get asV14(): {generator: Uint8Array, receiver: Uint8Array, balanceBurned: bigint} {
    assert(this.isV14)
    return this._chain.decodeEvent(this.event)
  }
}

export class EnergyValueCoefficientUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Energy.ValueCoefficientUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Energy value coefficient has been updated.
   */
  get isV14(): boolean {
    return this._chain.getEventHash('Energy.ValueCoefficientUpdated') === '3b55813576cf0de13f000ad3b579f0b56d77b7272a2c0061924dd13b08bab909'
  }

  /**
   * Energy value coefficient has been updated.
   */
  get asV14(): {newCoefficient: bigint} {
    assert(this.isV14)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainSystemDownwardMessagesProcessedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainSystem.DownwardMessagesProcessed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Downward messages were processed using the given weight.
   * \[ weight_used, result_mqc_head \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('ParachainSystem.DownwardMessagesProcessed') === '62ab179c459e900954ede92a01f149d553e9317efc7d0129525f40d631e8b38f'
  }

  /**
   * Downward messages were processed using the given weight.
   * \[ weight_used, result_mqc_head \]
   */
  get asV1(): [bigint, Uint8Array] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Downward messages were processed using the given weight.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('ParachainSystem.DownwardMessagesProcessed') === '83022e6226975081ba018c2b45a90d494bc922ece44e69af0322583651264f8e'
  }

  /**
   * Downward messages were processed using the given weight.
   */
  get asV13(): {weightUsed: bigint, dmqHead: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainSystemDownwardMessagesReceivedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainSystem.DownwardMessagesReceived')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some downward messages have been received and will be processed.
   * \[ count \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('ParachainSystem.DownwardMessagesReceived') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  /**
   * Some downward messages have been received and will be processed.
   * \[ count \]
   */
  get asV1(): number {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some downward messages have been received and will be processed.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('ParachainSystem.DownwardMessagesReceived') === '1cdbdc8ac203922f95ae6ab3e8b98004e956389f7ec11480ec5633d29b48cf71'
  }

  /**
   * Some downward messages have been received and will be processed.
   */
  get asV13(): {count: number} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainSystemUpgradeAuthorizedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainSystem.UpgradeAuthorized')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An upgrade has been authorized.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('ParachainSystem.UpgradeAuthorized') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * An upgrade has been authorized.
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An upgrade has been authorized.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('ParachainSystem.UpgradeAuthorized') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
  }

  /**
   * An upgrade has been authorized.
   */
  get asV13(): {codeHash: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainSystemValidationFunctionAppliedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainSystem.ValidationFunctionApplied')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The validation function was applied as of the contained relay chain block number.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('ParachainSystem.ValidationFunctionApplied') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  /**
   * The validation function was applied as of the contained relay chain block number.
   */
  get asV1(): number {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * The validation function was applied as of the contained relay chain block number.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('ParachainSystem.ValidationFunctionApplied') === 'f35adbaa82c93636884997faedd16369ac498b9208d7c11f2233b9ef2aa4f092'
  }

  /**
   * The validation function was applied as of the contained relay chain block number.
   */
  get asV13(): {relayChainBlockNum: number} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainSystemValidationFunctionDiscardedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainSystem.ValidationFunctionDiscarded')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The relay-chain aborted the upgrade process.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('ParachainSystem.ValidationFunctionDiscarded') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * The relay-chain aborted the upgrade process.
   */
  get asV1(): null {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class ParachainSystemValidationFunctionStoredEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'ParachainSystem.ValidationFunctionStored')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The validation function has been scheduled to apply.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('ParachainSystem.ValidationFunctionStored') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * The validation function has been scheduled to apply.
   */
  get asV1(): null {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmAssetsTrappedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.AssetsTrapped')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some assets have been placed in an asset trap.
   * 
   * \[ hash, origin, assets \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.AssetsTrapped') === '0663ceb24fcbc7c249c0d23c9fc7292b881f8cf18a5c2ade1e5b4a25b0a6d900'
  }

  /**
   * Some assets have been placed in an asset trap.
   * 
   * \[ hash, origin, assets \]
   */
  get asV1(): [Uint8Array, v1.V1MultiLocation, v1.VersionedMultiAssets] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmAttemptedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.Attempted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Execution of an XCM message was attempted.
   * 
   * \[ outcome \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.Attempted') === '193515c3b0e5bbe78313ce7bb5d80d3c789be70e0085c1d43ce0347187c43a50'
  }

  /**
   * Execution of an XCM message was attempted.
   * 
   * \[ outcome \]
   */
  get asV1(): v1.V2Outcome {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Execution of an XCM message was attempted.
   * 
   * \[ outcome \]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('PolkadotXcm.Attempted') === '4154651e242bd6b6bc077aa66e91ede994df17d6d31ec8746fb77b61829f6cc1'
  }

  /**
   * Execution of an XCM message was attempted.
   * 
   * \[ outcome \]
   */
  get asV5(): v5.V2Outcome {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmInvalidResponderEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.InvalidResponder')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Expected query response has been received but the origin location of the response does
   * not match that expected. The query remains registered for a later, valid, response to
   * be received and acted upon.
   * 
   * \[ origin location, id, expected location \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.InvalidResponder') === 'aca6b87c79cd283d77249dae5d6ff6b7249a24e95958b723f47cd2333f0e9bc1'
  }

  /**
   * Expected query response has been received but the origin location of the response does
   * not match that expected. The query remains registered for a later, valid, response to
   * be received and acted upon.
   * 
   * \[ origin location, id, expected location \]
   */
  get asV1(): [v1.V1MultiLocation, bigint, (v1.V1MultiLocation | undefined)] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmInvalidResponderVersionEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.InvalidResponderVersion')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Expected query response has been received but the expected origin location placed in
   * storate by this runtime previously cannot be decoded. The query remains registered.
   * 
   * This is unexpected (since a location placed in storage in a previously executing
   * runtime should be readable prior to query timeout) and dangerous since the possibly
   * valid response will be dropped. Manual governance intervention is probably going to be
   * needed.
   * 
   * \[ origin location, id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.InvalidResponderVersion') === 'c9ed91cb137ad1f5cd40162c8e40b33e2e6b9cdc244bb5c6f95922b4971639ae'
  }

  /**
   * Expected query response has been received but the expected origin location placed in
   * storate by this runtime previously cannot be decoded. The query remains registered.
   * 
   * This is unexpected (since a location placed in storage in a previously executing
   * runtime should be readable prior to query timeout) and dangerous since the possibly
   * valid response will be dropped. Manual governance intervention is probably going to be
   * needed.
   * 
   * \[ origin location, id \]
   */
  get asV1(): [v1.V1MultiLocation, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmNotifiedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.Notified')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Query response has been received and query is removed. The registered notification has
   * been dispatched and executed successfully.
   * 
   * \[ id, pallet index, call index \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.Notified') === '142af28353c3fd45d5839ca78e03f5b0850e0cd92892c66cfb4438a39b1200cf'
  }

  /**
   * Query response has been received and query is removed. The registered notification has
   * been dispatched and executed successfully.
   * 
   * \[ id, pallet index, call index \]
   */
  get asV1(): [bigint, number, number] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmNotifyDecodeFailedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.NotifyDecodeFailed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Query response has been received and query is removed. The dispatch was unable to be
   * decoded into a `Call`; this might be due to dispatch function having a signature which
   * is not `(origin, QueryId, Response)`.
   * 
   * \[ id, pallet index, call index \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.NotifyDecodeFailed') === '142af28353c3fd45d5839ca78e03f5b0850e0cd92892c66cfb4438a39b1200cf'
  }

  /**
   * Query response has been received and query is removed. The dispatch was unable to be
   * decoded into a `Call`; this might be due to dispatch function having a signature which
   * is not `(origin, QueryId, Response)`.
   * 
   * \[ id, pallet index, call index \]
   */
  get asV1(): [bigint, number, number] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmNotifyDispatchErrorEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.NotifyDispatchError')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Query response has been received and query is removed. There was a general error with
   * dispatching the notification call.
   * 
   * \[ id, pallet index, call index \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.NotifyDispatchError') === '142af28353c3fd45d5839ca78e03f5b0850e0cd92892c66cfb4438a39b1200cf'
  }

  /**
   * Query response has been received and query is removed. There was a general error with
   * dispatching the notification call.
   * 
   * \[ id, pallet index, call index \]
   */
  get asV1(): [bigint, number, number] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmNotifyOverweightEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.NotifyOverweight')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Query response has been received and query is removed. The registered notification could
   * not be dispatched because the dispatch weight is greater than the maximum weight
   * originally budgeted by this runtime for the query result.
   * 
   * \[ id, pallet index, call index, actual weight, max budgeted weight \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.NotifyOverweight') === '0104ccc866506c43592e56f342852c22c060b58c586141b7900f6ad97353e8b2'
  }

  /**
   * Query response has been received and query is removed. The registered notification could
   * not be dispatched because the dispatch weight is greater than the maximum weight
   * originally budgeted by this runtime for the query result.
   * 
   * \[ id, pallet index, call index, actual weight, max budgeted weight \]
   */
  get asV1(): [bigint, number, number, bigint, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmNotifyTargetMigrationFailEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.NotifyTargetMigrationFail')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A given location which had a version change subscription was dropped owing to an error
   * migrating the location to our new XCM format.
   * 
   * \[ location, query ID \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.NotifyTargetMigrationFail') === 'b02879418cace85908884f92e4b915e3b448f9e06d9bcc0edcce01ed9bc5b644'
  }

  /**
   * A given location which had a version change subscription was dropped owing to an error
   * migrating the location to our new XCM format.
   * 
   * \[ location, query ID \]
   */
  get asV1(): [v1.VersionedMultiLocation, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmNotifyTargetSendFailEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.NotifyTargetSendFail')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   * 
   * \[ location, query ID, error \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.NotifyTargetSendFail') === '691ecac12054acab4727e4ac3bcc4cc884bcf98e86e777b9c154133f1ff85778'
  }

  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   * 
   * \[ location, query ID, error \]
   */
  get asV1(): [v1.V1MultiLocation, bigint, v1.V2Error] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   * 
   * \[ location, query ID, error \]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('PolkadotXcm.NotifyTargetSendFail') === '0d47fb7e1a9ccdfd8879b0e483179d5b2c7b29bd5db653557e266536bc40f9a0'
  }

  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   * 
   * \[ location, query ID, error \]
   */
  get asV5(): [v5.V1MultiLocation, bigint, v5.V2Error] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmResponseReadyEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.ResponseReady')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   * 
   * \[ id, response \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.ResponseReady') === 'e6cd72b673b499abf36b946b4ab2a4531e2ca4af4aa3d41e14bafae7b2502409'
  }

  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   * 
   * \[ id, response \]
   */
  get asV1(): [bigint, v1.V2Response] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   * 
   * \[ id, response \]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('PolkadotXcm.ResponseReady') === '122689cbd0466e99035c5eeda9c178ed25d8a8fee01f9de0d818f7e86cd5e333'
  }

  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   * 
   * \[ id, response \]
   */
  get asV5(): [bigint, v5.V2Response] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmResponseTakenEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.ResponseTaken')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Received query response has been read and removed.
   * 
   * \[ id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.ResponseTaken') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
  }

  /**
   * Received query response has been read and removed.
   * 
   * \[ id \]
   */
  get asV1(): bigint {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmSentEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.Sent')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A XCM message was sent.
   * 
   * \[ origin, destination, message \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.Sent') === '1a2c2f0f587aa6cafef526c4c8aabbb80179c1dda79383508e93899dd8a8604c'
  }

  /**
   * A XCM message was sent.
   * 
   * \[ origin, destination, message \]
   */
  get asV1(): [v1.V1MultiLocation, v1.V1MultiLocation, v1.V2Instruction[]] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A XCM message was sent.
   * 
   * \[ origin, destination, message \]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('PolkadotXcm.Sent') === 'ae5e308764e970ce405a89338cec74552db382f20b13af73b16c9b7b172754e4'
  }

  /**
   * A XCM message was sent.
   * 
   * \[ origin, destination, message \]
   */
  get asV5(): [v5.V1MultiLocation, v5.V1MultiLocation, v5.V2Instruction[]] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmSupportedVersionChangedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.SupportedVersionChanged')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The supported version of a location has been changed. This might be through an
   * automatic notification or a manual intervention.
   * 
   * \[ location, XCM version \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.SupportedVersionChanged') === '53ea5e1638fe3c6b5c5c4d43de54730797aa6641ac1d8e2e3e4d910db00275b0'
  }

  /**
   * The supported version of a location has been changed. This might be through an
   * automatic notification or a manual intervention.
   * 
   * \[ location, XCM version \]
   */
  get asV1(): [v1.V1MultiLocation, number] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmUnexpectedResponseEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.UnexpectedResponse')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Query response received which does not match a registered query. This may be because a
   * matching query was never registered, it may be because it is a duplicate response, or
   * because the query timed out.
   * 
   * \[ origin location, id \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.UnexpectedResponse') === 'c9ed91cb137ad1f5cd40162c8e40b33e2e6b9cdc244bb5c6f95922b4971639ae'
  }

  /**
   * Query response received which does not match a registered query. This may be because a
   * matching query was never registered, it may be because it is a duplicate response, or
   * because the query timed out.
   * 
   * \[ origin location, id \]
   */
  get asV1(): [v1.V1MultiLocation, bigint] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class PolkadotXcmVersionChangeNotifiedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'PolkadotXcm.VersionChangeNotified')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An XCM version change notification message has been attempted to be sent.
   * 
   * \[ destination, result \]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('PolkadotXcm.VersionChangeNotified') === '53ea5e1638fe3c6b5c5c4d43de54730797aa6641ac1d8e2e3e4d910db00275b0'
  }

  /**
   * An XCM version change notification message has been attempted to be sent.
   * 
   * \[ destination, result \]
   */
  get asV1(): [v1.V1MultiLocation, number] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

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

  get isV13(): boolean {
    return this._chain.getEventHash('Posts.PostCreated') === 'c15c37af42f4d900025837e5f4326117b28dd922aa079cae41b57e9886b55782'
  }

  get asV13(): {account: Uint8Array, postId: bigint} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Posts.PostMoved') === '31342df9d009b9f3d0c9938b7c12d2c992b23b06de6edcd05215dd3e88f36a6a'
  }

  get asV13(): {account: Uint8Array, postId: bigint, fromSpace: (bigint | undefined), toSpace: (bigint | undefined)} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Posts.PostUpdated') === 'c15c37af42f4d900025837e5f4326117b28dd922aa079cae41b57e9886b55782'
  }

  get asV13(): {account: Uint8Array, postId: bigint} {
    assert(this.isV13)
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

  /**
   * Profile's space id was updated for this account.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('Profiles.ProfileUpdated') === 'd940f4b0c5de1ed174d22549ad330a36ea0aad9b808f016f5aaace9c80ce6441'
  }

  /**
   * Profile's space id was updated for this account.
   */
  get asV13(): {account: Uint8Array, spaceId: (bigint | undefined)} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProxyAnnouncedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Proxy.Announced')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An announcement was placed to make a call in the future.
   */
  get isV16(): boolean {
    return this._chain.getEventHash('Proxy.Announced') === '5c2546e4632bb75e839f990a33f7feb63fb5598747a25d3d09f23108c106abc4'
  }

  /**
   * An announcement was placed to make a call in the future.
   */
  get asV16(): {real: Uint8Array, proxy: Uint8Array, callHash: Uint8Array} {
    assert(this.isV16)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProxyAnonymousCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Proxy.AnonymousCreated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Anonymous account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  get isV16(): boolean {
    return this._chain.getEventHash('Proxy.AnonymousCreated') === 'c60ca3d22a35559fdeed1de47f39f7b840361adfcaf0d116367ae8b9d16856e5'
  }

  /**
   * Anonymous account has been created by new proxy with given
   * disambiguation index and proxy type.
   */
  get asV16(): {anonymous: Uint8Array, who: Uint8Array, proxyType: v16.ProxyType, disambiguationIndex: number} {
    assert(this.isV16)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProxyProxyAddedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Proxy.ProxyAdded')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A proxy was added.
   */
  get isV16(): boolean {
    return this._chain.getEventHash('Proxy.ProxyAdded') === '8362f959179c95d77565d122c6d8d71ca68045243b0463321955ff0b124b26c0'
  }

  /**
   * A proxy was added.
   */
  get asV16(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v16.ProxyType, delay: number} {
    assert(this.isV16)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProxyProxyExecutedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Proxy.ProxyExecuted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A proxy was executed correctly, with the given.
   */
  get isV16(): boolean {
    return this._chain.getEventHash('Proxy.ProxyExecuted') === '7d690b5ed9f2caaea0254a371bcab7b5a7b6fa958ff0b07661390aaf23c39439'
  }

  /**
   * A proxy was executed correctly, with the given.
   */
  get asV16(): {result: v16.Type_35} {
    assert(this.isV16)
    return this._chain.decodeEvent(this.event)
  }
}

export class ProxyProxyRemovedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Proxy.ProxyRemoved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A proxy was removed.
   */
  get isV16(): boolean {
    return this._chain.getEventHash('Proxy.ProxyRemoved') === '8362f959179c95d77565d122c6d8d71ca68045243b0463321955ff0b124b26c0'
  }

  /**
   * A proxy was removed.
   */
  get asV16(): {delegator: Uint8Array, delegatee: Uint8Array, proxyType: v16.ProxyType, delay: number} {
    assert(this.isV16)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionCreated') === 'd60054aecf68a376c704208df2db21ba58faec163ee7165b476481136322cee8'
  }

  get asV13(): {account: Uint8Array, postId: bigint, reactionId: bigint, reactionKind: v13.ReactionKind} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionDeleted') === 'd60054aecf68a376c704208df2db21ba58faec163ee7165b476481136322cee8'
  }

  get asV13(): {account: Uint8Array, postId: bigint, reactionId: bigint, reactionKind: v13.ReactionKind} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Reactions.PostReactionUpdated') === 'd60054aecf68a376c704208df2db21ba58faec163ee7165b476481136322cee8'
  }

  get asV13(): {account: Uint8Array, postId: bigint, reactionId: bigint, reactionKind: v13.ReactionKind} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class RolesRoleCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Roles.RoleCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('Roles.RoleCreated') === '008ed4bb8b7bc9284e6ba803c1cfcde5a61429c300c9e1963399488443979e54'
  }

  get asV13(): {account: Uint8Array, spaceId: bigint, roleId: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class RolesRoleDeletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Roles.RoleDeleted')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('Roles.RoleDeleted') === 'a58247060df1a3a901646649f1e12bcc5274ae227b4b2ab041966abd4ece14d2'
  }

  get asV13(): {account: Uint8Array, roleId: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class RolesRoleGrantedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Roles.RoleGranted')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('Roles.RoleGranted') === '3dd6b73057722a969d2f3f466bc225cddf384a8aabb3bf563b0bcb7bb9a6ceed'
  }

  get asV13(): {account: Uint8Array, roleId: bigint, users: v13.User[]} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class RolesRoleRevokedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Roles.RoleRevoked')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('Roles.RoleRevoked') === '3dd6b73057722a969d2f3f466bc225cddf384a8aabb3bf563b0bcb7bb9a6ceed'
  }

  get asV13(): {account: Uint8Array, roleId: bigint, users: v13.User[]} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class RolesRoleUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Roles.RoleUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('Roles.RoleUpdated') === 'a58247060df1a3a901646649f1e12bcc5274ae227b4b2ab041966abd4ece14d2'
  }

  get asV13(): {account: Uint8Array, roleId: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class SessionNewSessionEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Session.NewSession')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * New session has happened. Note that the argument is the \[session_index\], not the
   * block number as the type might suggest.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Session.NewSession') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
  }

  /**
   * New session has happened. Note that the argument is the \[session_index\], not the
   * block number as the type might suggest.
   */
  get asV1(): number {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * New session has happened. Note that the argument is the session index, not the
   * block number as the type might suggest.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Session.NewSession') === '75fa09d2d8b5fbcbe4f75feb6c886998092453010ae364a5b06b9bb6319f1086'
  }

  /**
   * New session has happened. Note that the argument is the session index, not the
   * block number as the type might suggest.
   */
  get asV2(): {sessionIndex: number} {
    assert(this.isV2)
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

  get isV13(): boolean {
    return this._chain.getEventHash('SpaceFollows.SpaceFollowed') === '39e28a03c48825c8d41a5f418096625711ab9709891a6cabc9f50fec5f113023'
  }

  get asV13(): {follower: Uint8Array, spaceId: bigint} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('SpaceFollows.SpaceUnfollowed') === '39e28a03c48825c8d41a5f418096625711ab9709891a6cabc9f50fec5f113023'
  }

  get asV13(): {follower: Uint8Array, spaceId: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpaceOwnershipSpaceOwnershipTransferAcceptedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'SpaceOwnership.SpaceOwnershipTransferAccepted')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('SpaceOwnership.SpaceOwnershipTransferAccepted') === '3598290eeb909bc34636d196da89829d37d0fa0ae5899f72908d4977aa03a0b7'
  }

  get asV13(): {account: Uint8Array, spaceId: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpaceOwnershipSpaceOwnershipTransferCreatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'SpaceOwnership.SpaceOwnershipTransferCreated')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('SpaceOwnership.SpaceOwnershipTransferCreated') === '7b63a4b6a0bc71448b9ddfcb9a69f7a52138afd689d538ab31dd07cfd36d2f44'
  }

  get asV13(): {currentOwner: Uint8Array, spaceId: bigint, newOwner: Uint8Array} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class SpaceOwnershipSpaceOwnershipTransferRejectedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'SpaceOwnership.SpaceOwnershipTransferRejected')
    this._chain = ctx._chain
    this.event = event
  }

  get isV13(): boolean {
    return this._chain.getEventHash('SpaceOwnership.SpaceOwnershipTransferRejected') === '3598290eeb909bc34636d196da89829d37d0fa0ae5899f72908d4977aa03a0b7'
  }

  get asV13(): {account: Uint8Array, spaceId: bigint} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Spaces.SpaceCreated') === '3598290eeb909bc34636d196da89829d37d0fa0ae5899f72908d4977aa03a0b7'
  }

  get asV13(): {account: Uint8Array, spaceId: bigint} {
    assert(this.isV13)
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

  get isV13(): boolean {
    return this._chain.getEventHash('Spaces.SpaceUpdated') === '3598290eeb909bc34636d196da89829d37d0fa0ae5899f72908d4977aa03a0b7'
  }

  get asV13(): {account: Uint8Array, spaceId: bigint} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class SudoKeyChangedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Sudo.KeyChanged')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The \[sudoer\] just switched identity; the old key is supplied.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Sudo.KeyChanged') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * The \[sudoer\] just switched identity; the old key is supplied.
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * The \[sudoer\] just switched identity; the old key is supplied.
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Sudo.KeyChanged') === 'bb1582b708cec95486f6bf4ff15529522e5c08c0d8149e09b71d2e042d0dcc8f'
  }

  /**
   * The \[sudoer\] just switched identity; the old key is supplied.
   */
  get asV2(): {newSudoer: Uint8Array} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * The \[sudoer\] just switched identity; the old key is supplied if one existed.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Sudo.KeyChanged') === 'b94a7a753f8f0b026120555f1f1c70878235307461e256807cb791dad15244c2'
  }

  /**
   * The \[sudoer\] just switched identity; the old key is supplied if one existed.
   */
  get asV5(): {oldSudoer: (Uint8Array | undefined)} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class SudoSudidEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Sudo.Sudid')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Sudo.Sudid') === '8fdfbdd4d08d5c98b7a7eada31ee13c01f31ab10c8752e768b9d4f32f2edfd25'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV1(): v1.Type_79 {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Sudo.Sudid') === '0904640b321d9467ec4b305822629c9cf7476e30acdbaf45232c9b0c23100db1'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV2(): {sudoResult: v2.Type_76} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Sudo.Sudid') === '7fffe0bb149a125d45315cdd4087524b9c4f4223010e0fff18d84854fc48aa3f'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV5(): {sudoResult: v5.Type_33} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV10(): boolean {
    return this._chain.getEventHash('Sudo.Sudid') === '7cde07a00087fe00204a886eb195e51ab4ed328b48e00f89cab63a3354eedb31'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV10(): {sudoResult: v10.Type_34} {
    assert(this.isV10)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV12(): boolean {
    return this._chain.getEventHash('Sudo.Sudid') === 'bfff987b04269a820686fcc24b9885fd64cbc87c576cf203a79a3a99a7c596e1'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV12(): {sudoResult: v12.Type_35} {
    assert(this.isV12)
    return this._chain.decodeEvent(this.event)
  }
}

export class SudoSudoAsDoneEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Sudo.SudoAsDone')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Sudo.SudoAsDone') === '8fdfbdd4d08d5c98b7a7eada31ee13c01f31ab10c8752e768b9d4f32f2edfd25'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV1(): v1.Type_79 {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV2(): boolean {
    return this._chain.getEventHash('Sudo.SudoAsDone') === '0904640b321d9467ec4b305822629c9cf7476e30acdbaf45232c9b0c23100db1'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV2(): {sudoResult: v2.Type_76} {
    assert(this.isV2)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Sudo.SudoAsDone') === '7fffe0bb149a125d45315cdd4087524b9c4f4223010e0fff18d84854fc48aa3f'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV5(): {sudoResult: v5.Type_33} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV10(): boolean {
    return this._chain.getEventHash('Sudo.SudoAsDone') === '7cde07a00087fe00204a886eb195e51ab4ed328b48e00f89cab63a3354eedb31'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV10(): {sudoResult: v10.Type_34} {
    assert(this.isV10)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A sudo just took place. \[result\]
   */
  get isV12(): boolean {
    return this._chain.getEventHash('Sudo.SudoAsDone') === 'bfff987b04269a820686fcc24b9885fd64cbc87c576cf203a79a3a99a7c596e1'
  }

  /**
   * A sudo just took place. \[result\]
   */
  get asV12(): {sudoResult: v12.Type_35} {
    assert(this.isV12)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemCodeUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.CodeUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * `:code` was updated.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('System.CodeUpdated') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * `:code` was updated.
   */
  get asV1(): null {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemExtrinsicFailedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.ExtrinsicFailed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An extrinsic failed. \[error, info\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('System.ExtrinsicFailed') === '0995776ff5e8d5f8662a6841d8556c830acc58fbb01f76a13b6aa4222b987150'
  }

  /**
   * An extrinsic failed. \[error, info\]
   */
  get asV1(): [v1.DispatchError, v1.DispatchInfo] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An extrinsic failed.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('System.ExtrinsicFailed') === '2dcccc93ed3f24e5499fe9480fe0a61a806d25bb5fc0d10a1074e360693768e7'
  }

  /**
   * An extrinsic failed.
   */
  get asV5(): {dispatchError: v5.DispatchError, dispatchInfo: v5.DispatchInfo} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An extrinsic failed.
   */
  get isV10(): boolean {
    return this._chain.getEventHash('System.ExtrinsicFailed') === '3b8e9f2b48f4b6f0f996d20434018cdbe20aacb2470e779d965d42dad18b0a4e'
  }

  /**
   * An extrinsic failed.
   */
  get asV10(): {dispatchError: v10.DispatchError, dispatchInfo: v10.DispatchInfo} {
    assert(this.isV10)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An extrinsic failed.
   */
  get isV12(): boolean {
    return this._chain.getEventHash('System.ExtrinsicFailed') === 'a6220584fa4f22cb02db1bfad4eacf1a689aea2324f22b4763def7376b7dd9bf'
  }

  /**
   * An extrinsic failed.
   */
  get asV12(): {dispatchError: v12.DispatchError, dispatchInfo: v12.DispatchInfo} {
    assert(this.isV12)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemExtrinsicSuccessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.ExtrinsicSuccess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An extrinsic completed successfully. \[info\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('System.ExtrinsicSuccess') === '00a75e03130fe6755b02b23ca285a19efc2bd57964ead02525eedef36cbf1bd4'
  }

  /**
   * An extrinsic completed successfully. \[info\]
   */
  get asV1(): v1.DispatchInfo {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An extrinsic completed successfully.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('System.ExtrinsicSuccess') === '407ed94c14f243acbe2cdb53df52c37d97bbb5ae550a10a6036bf59677cdd165'
  }

  /**
   * An extrinsic completed successfully.
   */
  get asV5(): {dispatchInfo: v5.DispatchInfo} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemKilledAccountEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.KilledAccount')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An \[account\] was reaped.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('System.KilledAccount') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * An \[account\] was reaped.
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An account was reaped.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('System.KilledAccount') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
  }

  /**
   * An account was reaped.
   */
  get asV5(): {account: Uint8Array} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemNewAccountEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.NewAccount')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A new \[account\] was created.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('System.NewAccount') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   * A new \[account\] was created.
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A new account was created.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('System.NewAccount') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
  }

  /**
   * A new account was created.
   */
  get asV5(): {account: Uint8Array} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemRemarkedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.Remarked')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * On on-chain remark happened. \[origin, remark_hash\]
   */
  get isV1(): boolean {
    return this._chain.getEventHash('System.Remarked') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  /**
   * On on-chain remark happened. \[origin, remark_hash\]
   */
  get asV1(): [Uint8Array, Uint8Array] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * On on-chain remark happened.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('System.Remarked') === 'c58b73482fe762a6dcca2f35266f0d1739333312cf7a50eea55c666d0cda6101'
  }

  /**
   * On on-chain remark happened.
   */
  get asV5(): {sender: Uint8Array, hash: Uint8Array} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class UtilityBatchCompletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Utility.BatchCompleted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Batch of dispatches completed fully with no error.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Utility.BatchCompleted') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * Batch of dispatches completed fully with no error.
   */
  get asV5(): null {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class UtilityBatchCompletedWithErrorsEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Utility.BatchCompletedWithErrors')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Batch of dispatches completed but has errors.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('Utility.BatchCompletedWithErrors') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * Batch of dispatches completed but has errors.
   */
  get asV13(): null {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class UtilityBatchInterruptedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Utility.BatchInterrupted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Utility.BatchInterrupted') === '0ebef0e669872b029afc6cbf6c35a90ca099164a7899375e3d8178345c0f3f73'
  }

  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  get asV5(): {index: number, error: v5.DispatchError} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  get isV10(): boolean {
    return this._chain.getEventHash('Utility.BatchInterrupted') === '8676c6dc6a22410c7ddbc9f34f71e25e9bc1f7237c98ea59385020ce26129067'
  }

  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  get asV10(): {index: number, error: v10.DispatchError} {
    assert(this.isV10)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  get isV12(): boolean {
    return this._chain.getEventHash('Utility.BatchInterrupted') === '30bda593b1e7b041ebb6b79df0135b12bf0ecdbea3d7694f8d9d59560411df93'
  }

  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  get asV12(): {index: number, error: v12.DispatchError} {
    assert(this.isV12)
    return this._chain.decodeEvent(this.event)
  }
}

export class UtilityDispatchedAsEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Utility.DispatchedAs')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A call was dispatched.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Utility.DispatchedAs') === 'af161e703a60c2ed390f4fc5df450268eda69dfe8656e401e29072d2b13258f5'
  }

  /**
   * A call was dispatched.
   */
  get asV5(): {result: v5.Type_33} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A call was dispatched.
   */
  get isV10(): boolean {
    return this._chain.getEventHash('Utility.DispatchedAs') === '123f6c35bbf8bd8d1cc0ada05ce8ad9758b8462076e62ae91382a7270c95ff10'
  }

  /**
   * A call was dispatched.
   */
  get asV10(): {result: v10.Type_34} {
    assert(this.isV10)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A call was dispatched.
   */
  get isV12(): boolean {
    return this._chain.getEventHash('Utility.DispatchedAs') === '7d690b5ed9f2caaea0254a371bcab7b5a7b6fa958ff0b07661390aaf23c39439'
  }

  /**
   * A call was dispatched.
   */
  get asV12(): {result: v12.Type_35} {
    assert(this.isV12)
    return this._chain.decodeEvent(this.event)
  }
}

export class UtilityItemCompletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Utility.ItemCompleted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A single item within a Batch of dispatches has completed with no error.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Utility.ItemCompleted') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
  }

  /**
   * A single item within a Batch of dispatches has completed with no error.
   */
  get asV5(): null {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class UtilityItemFailedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Utility.ItemFailed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A single item within a Batch of dispatches has completed with error.
   */
  get isV13(): boolean {
    return this._chain.getEventHash('Utility.ItemFailed') === '59e964849fe0837c16b04e3c81782ce0ee22b9efe3d6a8d43d6ea61e9b25b998'
  }

  /**
   * A single item within a Batch of dispatches has completed with error.
   */
  get asV13(): {error: v13.DispatchError} {
    assert(this.isV13)
    return this._chain.decodeEvent(this.event)
  }
}

export class VestingVestingCompletedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Vesting.VestingCompleted')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An \[account\] has become fully vested.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Vesting.VestingCompleted') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
  }

  /**
   * An \[account\] has become fully vested.
   */
  get asV5(): {account: Uint8Array} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class VestingVestingUpdatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Vesting.VestingUpdated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  get isV5(): boolean {
    return this._chain.getEventHash('Vesting.VestingUpdated') === '827ca6c1a4e85ce850afac4c8d4d055acd3be5c19141889b40808e42b2c769e3'
  }

  /**
   * The amount vested has been updated. This could indicate a change in funds available.
   * The balance given is the amount which is left unvested (and thus locked).
   */
  get asV5(): {account: Uint8Array, unvested: bigint} {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueBadFormatEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.BadFormat')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Bad XCM format used.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('XcmpQueue.BadFormat') === 'a5c1f8b891fae90a0d7ad9b2faf9f1b356be106b1dd35df6fd53ab6554e34e67'
  }

  /**
   * Bad XCM format used.
   */
  get asV1(): (Uint8Array | undefined) {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueBadVersionEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.BadVersion')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Bad XCM version used.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('XcmpQueue.BadVersion') === 'a5c1f8b891fae90a0d7ad9b2faf9f1b356be106b1dd35df6fd53ab6554e34e67'
  }

  /**
   * Bad XCM version used.
   */
  get asV1(): (Uint8Array | undefined) {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueFailEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.Fail')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some XCM failed.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('XcmpQueue.Fail') === 'c719d9ccc723cdf668f55966f450e4217391513459d13dcdea1b99c7e22b2890'
  }

  /**
   * Some XCM failed.
   */
  get asV1(): [(Uint8Array | undefined), v1.V2Error] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some XCM failed.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('XcmpQueue.Fail') === '639070abee49a6419e897939fc5b761d561a52efc062a7f1a1183b543e786999'
  }

  /**
   * Some XCM failed.
   */
  get asV5(): [(Uint8Array | undefined), v5.V2Error] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueOverweightEnqueuedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.OverweightEnqueued')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An XCM exceeded the individual message weight budget.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('XcmpQueue.OverweightEnqueued') === 'ebfdd28144c52e3beb9a90e53e214e90e6114fc4d52e2c572b7e0a2e8c303bd5'
  }

  /**
   * An XCM exceeded the individual message weight budget.
   */
  get asV5(): [number, number, bigint, bigint] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueOverweightServicedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.OverweightServiced')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An XCM from the overweight queue was executed with the given actual weight used.
   */
  get isV5(): boolean {
    return this._chain.getEventHash('XcmpQueue.OverweightServiced') === 'a07d31c2644106aa567962b0935daed493556b5253e00c77997c3b0e46966110'
  }

  /**
   * An XCM from the overweight queue was executed with the given actual weight used.
   */
  get asV5(): [bigint, bigint] {
    assert(this.isV5)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueSuccessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.Success')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some XCM was executed ok.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('XcmpQueue.Success') === 'a5c1f8b891fae90a0d7ad9b2faf9f1b356be106b1dd35df6fd53ab6554e34e67'
  }

  /**
   * Some XCM was executed ok.
   */
  get asV1(): (Uint8Array | undefined) {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueUpwardMessageSentEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.UpwardMessageSent')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An upward message was sent to the relay chain.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('XcmpQueue.UpwardMessageSent') === 'a5c1f8b891fae90a0d7ad9b2faf9f1b356be106b1dd35df6fd53ab6554e34e67'
  }

  /**
   * An upward message was sent to the relay chain.
   */
  get asV1(): (Uint8Array | undefined) {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class XcmpQueueXcmpMessageSentEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'XcmpQueue.XcmpMessageSent')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An HRMP message was sent to a sibling parachain.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('XcmpQueue.XcmpMessageSent') === 'a5c1f8b891fae90a0d7ad9b2faf9f1b356be106b1dd35df6fd53ab6554e34e67'
  }

  /**
   * An HRMP message was sent to a sibling parachain.
   */
  get asV1(): (Uint8Array | undefined) {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}
