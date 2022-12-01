import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result, Option} from './support'
import * as v1 from './v1'
import * as v2 from './v2'
import * as v5 from './v5'
import * as v7 from './v7'
import * as v10 from './v10'
import * as v12 from './v12'
import * as v13 from './v13'
import * as v14 from './v14'
import * as v16 from './v16'

export class AccountFollowsAccountFollowedByAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('AccountFollows', 'AccountFollowedByAccount') === '1b9f3c1aa97ebb13d3f6550639395187ac833f02c0fe4d006c73b767ecbb863e'
  }

  async getAsV13(key: [Uint8Array, Uint8Array]): Promise<boolean> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'AccountFollows', 'AccountFollowedByAccount', key)
  }

  async getManyAsV13(keys: [Uint8Array, Uint8Array][]): Promise<(boolean)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'AccountFollows', 'AccountFollowedByAccount', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(boolean)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'AccountFollows', 'AccountFollowedByAccount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('AccountFollows', 'AccountFollowedByAccount') != null
  }
}

export class AccountFollowsAccountFollowersStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('AccountFollows', 'AccountFollowers') === 'ad7e5187ae060fec07b1929f558af1374198afab9d21e08b23028f5c02a1b279'
  }

  async getAsV13(key: Uint8Array): Promise<Uint8Array[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'AccountFollows', 'AccountFollowers', key)
  }

  async getManyAsV13(keys: Uint8Array[]): Promise<(Uint8Array[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'AccountFollows', 'AccountFollowers', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(Uint8Array[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'AccountFollows', 'AccountFollowers')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('AccountFollows', 'AccountFollowers') != null
  }
}

export class AccountFollowsAccountsFollowedByAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('AccountFollows', 'AccountsFollowedByAccount') === 'ad7e5187ae060fec07b1929f558af1374198afab9d21e08b23028f5c02a1b279'
  }

  async getAsV13(key: Uint8Array): Promise<Uint8Array[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'AccountFollows', 'AccountsFollowedByAccount', key)
  }

  async getManyAsV13(keys: Uint8Array[]): Promise<(Uint8Array[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'AccountFollows', 'AccountsFollowedByAccount', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(Uint8Array[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'AccountFollows', 'AccountsFollowedByAccount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('AccountFollows', 'AccountsFollowedByAccount') != null
  }
}

export class AuraAuthoritiesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current authority set.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Aura', 'Authorities') === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895'
  }

  /**
   *  The current authority set.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Aura', 'Authorities')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Aura', 'Authorities') != null
  }
}

export class AuraCurrentSlotStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current slot of this block.
   * 
   *  This will be set in `on_initialize`.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Aura', 'CurrentSlot') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  The current slot of this block.
   * 
   *  This will be set in `on_initialize`.
   */
  async getAsV1(): Promise<bigint> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Aura', 'CurrentSlot')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Aura', 'CurrentSlot') != null
  }
}

export class AuraExtAuthoritiesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Serves as cache for the authorities.
   * 
   *  The authorities in AuRa are overwritten in `on_initialize` when we switch to a new session,
   *  but we require the old authorities to verify the seal when validating a PoV. This will always
   *  be updated to the latest AuRa authorities in `on_finalize`.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('AuraExt', 'Authorities') === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895'
  }

  /**
   *  Serves as cache for the authorities.
   * 
   *  The authorities in AuRa are overwritten in `on_initialize` when we switch to a new session,
   *  but we require the old authorities to verify the seal when validating a PoV. This will always
   *  be updated to the latest AuRa authorities in `on_finalize`.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'AuraExt', 'Authorities')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('AuraExt', 'Authorities') != null
  }
}

export class AuthorshipAuthorStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Author of current block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Authorship', 'Author') === '8620bdc4f360add1f8e58e488bdba4fa9b6dab86ecdd1c942b8d9de43ede38e5'
  }

  /**
   *  Author of current block.
   */
  async getAsV1(): Promise<Uint8Array | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Authorship', 'Author')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Authorship', 'Author') != null
  }
}

export class AuthorshipDidSetUnclesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Whether uncles were already set in this block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Authorship', 'DidSetUncles') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  Whether uncles were already set in this block.
   */
  async getAsV1(): Promise<boolean> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Authorship', 'DidSetUncles')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Authorship', 'DidSetUncles') != null
  }
}

export class AuthorshipUnclesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Uncles
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Authorship', 'Uncles') === '320be201dc467df78c8912d3a5ad0cb57cd9b25ab8bff2e738597ffc0a83b551'
  }

  /**
   *  Uncles
   */
  async getAsV1(): Promise<v1.UncleEntryItem[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Authorship', 'Uncles')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Authorship', 'Uncles') != null
  }
}

export class BalancesAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The balance of an account.
   * 
   *  NOTE: This is only used in the case that this pallet is used to store balances.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Balances', 'Account') === '0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78'
  }

  /**
   *  The balance of an account.
   * 
   *  NOTE: This is only used in the case that this pallet is used to store balances.
   */
  async getAsV1(key: Uint8Array): Promise<v1.AccountData> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Balances', 'Account', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(v1.AccountData)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Account', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(v1.AccountData)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Account')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'Account') != null
  }
}

export class BalancesLocksStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Any liquidity locks on some account balances.
   *  NOTE: Should only be accessed when setting, changing and freeing a lock.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Balances', 'Locks') === 'e393b3a20a6d47aee703c898fda1db02fffe128e4692a5861f416ecc67b13a86'
  }

  /**
   *  Any liquidity locks on some account balances.
   *  NOTE: Should only be accessed when setting, changing and freeing a lock.
   */
  async getAsV1(key: Uint8Array): Promise<v1.BalanceLock[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Balances', 'Locks', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(v1.BalanceLock[])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Locks', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(v1.BalanceLock[])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Locks')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'Locks') != null
  }
}

export class BalancesReservesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Named reserves on some account balances.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Balances', 'Reserves') === '474ab364918936227f04514c303c572bb070961f30f593f2cbb3e25426aba37a'
  }

  /**
   *  Named reserves on some account balances.
   */
  async getAsV1(key: Uint8Array): Promise<v1.ReserveData[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Balances', 'Reserves', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(v1.ReserveData[])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Reserves', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(v1.ReserveData[])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Reserves')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'Reserves') != null
  }
}

export class BalancesStorageVersionStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Storage version of the pallet.
   * 
   *  This is set to v2.0.0 for new networks.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Balances', 'StorageVersion') === '1431e80ffaa4d10a7fe714faa381ada05c3baae7e12aa80f24f8728a41ba57c4'
  }

  /**
   *  Storage version of the pallet.
   * 
   *  This is set to v2.0.0 for new networks.
   */
  async getAsV1(): Promise<v1.Releases> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Balances', 'StorageVersion')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'StorageVersion') != null
  }
}

export class BalancesTotalIssuanceStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The total units issued in the system.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Balances', 'TotalIssuance') === 'f8ebe28eb30158172c0ccf672f7747c46a244f892d08ef2ebcbaadde34a26bc0'
  }

  /**
   *  The total units issued in the system.
   */
  async getAsV1(): Promise<bigint> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Balances', 'TotalIssuance')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'TotalIssuance') != null
  }
}

export class CollatorSelectionCandidacyBondStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Fixed deposit bond for each candidate.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'CandidacyBond') === 'f8ebe28eb30158172c0ccf672f7747c46a244f892d08ef2ebcbaadde34a26bc0'
  }

  /**
   *  Fixed deposit bond for each candidate.
   */
  async getAsV1(): Promise<bigint> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'CollatorSelection', 'CandidacyBond')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'CandidacyBond') != null
  }
}

export class CollatorSelectionCandidatesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The (community, limited) collation candidates.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'Candidates') === '239ae5a83674078569642b29549b6d89d616b5748799fde8f01f3356f32141fd'
  }

  /**
   *  The (community, limited) collation candidates.
   */
  async getAsV1(): Promise<v1.CandidateInfo[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'CollatorSelection', 'Candidates')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'Candidates') != null
  }
}

export class CollatorSelectionDesiredCandidatesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Desired number of candidates.
   * 
   *  This should ideally always be less than [`Config::MaxCandidates`] for weights to be correct.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'DesiredCandidates') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  Desired number of candidates.
   * 
   *  This should ideally always be less than [`Config::MaxCandidates`] for weights to be correct.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'CollatorSelection', 'DesiredCandidates')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'DesiredCandidates') != null
  }
}

export class CollatorSelectionInvulnerablesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The invulnerable, fixed collators.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'Invulnerables') === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895'
  }

  /**
   *  The invulnerable, fixed collators.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'CollatorSelection', 'Invulnerables')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'Invulnerables') != null
  }
}

export class CollatorSelectionLastAuthoredBlockStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Last block authored by collator.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'LastAuthoredBlock') === '25f0d63900988134e6767c7fe398885c0448fd3bd7a0d8ff90cf6b33a482cebd'
  }

  /**
   *  Last block authored by collator.
   */
  async getAsV1(key: Uint8Array): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'CollatorSelection', 'LastAuthoredBlock', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(number)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'CollatorSelection', 'LastAuthoredBlock', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(number)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'CollatorSelection', 'LastAuthoredBlock')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('CollatorSelection', 'LastAuthoredBlock') != null
  }
}

export class DmpQueueConfigurationStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The configuration.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'Configuration') === 'de2fc633d896ffed21e1f630f0a1bfe710ecfa69921c58a4a758e7fd49d0b5a4'
  }

  /**
   *  The configuration.
   */
  async getAsV1(): Promise<v1.ConfigData> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'DmpQueue', 'Configuration')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'Configuration') != null
  }
}

export class DmpQueueOverweightStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The overweight messages.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'Overweight') === '02b70c9350fc19f8edcf45c5eb6332933141453267579d97f6eece480cbaa4d4'
  }

  /**
   *  The overweight messages.
   */
  async getAsV1(key: bigint): Promise<[number, Uint8Array] | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'DmpQueue', 'Overweight', key)
  }

  async getManyAsV1(keys: bigint[]): Promise<([number, Uint8Array] | undefined)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'DmpQueue', 'Overweight', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<([number, Uint8Array])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'DmpQueue', 'Overweight')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'Overweight') != null
  }
}

export class DmpQueuePageIndexStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The page index.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'PageIndex') === 'cad43146ccd742f66da886b2f77b13d96d2c4de637fbb965a7493a2f16c99189'
  }

  /**
   *  The page index.
   */
  async getAsV1(): Promise<v1.PageIndexData> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'DmpQueue', 'PageIndex')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'PageIndex') != null
  }
}

export class DmpQueuePagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The queue pages.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'Pages') === '0b9460c8234ca1e6341c95066d20ac8d7e79e3a9b2def20c9450f88ef0ab1b1d'
  }

  /**
   *  The queue pages.
   */
  async getAsV1(key: number): Promise<[number, Uint8Array][]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'DmpQueue', 'Pages', key)
  }

  async getManyAsV1(keys: number[]): Promise<([number, Uint8Array][])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'DmpQueue', 'Pages', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<([number, Uint8Array][])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'DmpQueue', 'Pages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('DmpQueue', 'Pages') != null
  }
}

export class DomainsDomainByInnerValueStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  TWOX-NOTE: Safe as `AccountId`s are crypto hashes anyway.
   */
  get isV7() {
    return this._chain.getStorageItemTypeHash('Domains', 'DomainByInnerValue') === '9567cabf419cb972d5a42c9a62c92c107f30d2a8ccfc2c74695671b5eed957b3'
  }

  /**
   *  TWOX-NOTE: Safe as `AccountId`s are crypto hashes anyway.
   */
  async getAsV7(key1: Uint8Array, key2: v7.InnerValue): Promise<Uint8Array | undefined> {
    assert(this.isV7)
    return this._chain.getStorage(this.blockHash, 'Domains', 'DomainByInnerValue', key1, key2)
  }

  async getManyAsV7(keys: [Uint8Array, v7.InnerValue][]): Promise<(Uint8Array | undefined)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'DomainByInnerValue', keys)
  }

  async getAllAsV7(): Promise<(Uint8Array)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'DomainByInnerValue')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Domains', 'DomainByInnerValue') != null
  }
}

export class DomainsDomainsByOwnerStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  TWOX-NOTE: Safe as `AccountId`s are crypto hashes anyway.
   */
  get isV7() {
    return this._chain.getStorageItemTypeHash('Domains', 'DomainsByOwner') === '46a288862bbf45be8ea8df419f742aba93624d0f567542a8d476bcea78e59e22'
  }

  /**
   *  TWOX-NOTE: Safe as `AccountId`s are crypto hashes anyway.
   */
  async getAsV7(key: Uint8Array): Promise<Uint8Array[]> {
    assert(this.isV7)
    return this._chain.getStorage(this.blockHash, 'Domains', 'DomainsByOwner', key)
  }

  async getManyAsV7(keys: Uint8Array[]): Promise<(Uint8Array[])[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'DomainsByOwner', keys.map(k => [k]))
  }

  async getAllAsV7(): Promise<(Uint8Array[])[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'DomainsByOwner')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Domains', 'DomainsByOwner') != null
  }
}

export class DomainsRegisteredDomainsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV7() {
    return this._chain.getStorageItemTypeHash('Domains', 'RegisteredDomains') === 'f308dae103f1b242c473b5d7740850c24120b1b5eda9c106cd9b6672bf2c13c3'
  }

  async getAsV7(key: Uint8Array): Promise<v7.DomainMeta | undefined> {
    assert(this.isV7)
    return this._chain.getStorage(this.blockHash, 'Domains', 'RegisteredDomains', key)
  }

  async getManyAsV7(keys: Uint8Array[]): Promise<(v7.DomainMeta | undefined)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'RegisteredDomains', keys.map(k => [k]))
  }

  async getAllAsV7(): Promise<(v7.DomainMeta)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'RegisteredDomains')
  }

  /**
   *  Metadata associated per domain.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Domains', 'RegisteredDomains') === 'be78e341092f66766e2cb8c347e1a4866b6921cbee315613644993e196406046'
  }

  /**
   *  Metadata associated per domain.
   */
  async getAsV13(key: Uint8Array): Promise<v13.DomainMeta | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Domains', 'RegisteredDomains', key)
  }

  async getManyAsV13(keys: Uint8Array[]): Promise<(v13.DomainMeta | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'RegisteredDomains', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(v13.DomainMeta)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'RegisteredDomains')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Domains', 'RegisteredDomains') != null
  }
}

export class DomainsReservedWordsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV7() {
    return this._chain.getStorageItemTypeHash('Domains', 'ReservedWords') === '66f595a69be861a7ae876f1faab7fab701c8b9ef12c6e69d769fe069d00a5d08'
  }

  async getAsV7(key: Uint8Array): Promise<boolean> {
    assert(this.isV7)
    return this._chain.getStorage(this.blockHash, 'Domains', 'ReservedWords', key)
  }

  async getManyAsV7(keys: Uint8Array[]): Promise<(boolean)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'ReservedWords', keys.map(k => [k]))
  }

  async getAllAsV7(): Promise<(boolean)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'ReservedWords')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Domains', 'ReservedWords') != null
  }
}

export class DomainsSupportedTldsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV7() {
    return this._chain.getStorageItemTypeHash('Domains', 'SupportedTlds') === '66f595a69be861a7ae876f1faab7fab701c8b9ef12c6e69d769fe069d00a5d08'
  }

  async getAsV7(key: Uint8Array): Promise<boolean> {
    assert(this.isV7)
    return this._chain.getStorage(this.blockHash, 'Domains', 'SupportedTlds', key)
  }

  async getManyAsV7(keys: Uint8Array[]): Promise<(boolean)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'SupportedTlds', keys.map(k => [k]))
  }

  async getAllAsV7(): Promise<(boolean)[]> {
    assert(this.isV7)
    return this._chain.queryStorage(this.blockHash, 'Domains', 'SupportedTlds')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Domains', 'SupportedTlds') != null
  }
}

export class EnergyEnergyBalanceStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Energy credited to each account.
   */
  get isV14() {
    return this._chain.getStorageItemTypeHash('Energy', 'EnergyBalance') === '0bac40afaf72ceea5a87ae2baaa5fe7f69915323f3293bdd970e7790a9d968c0'
  }

  /**
   *  Energy credited to each account.
   */
  async getAsV14(key: Uint8Array): Promise<bigint> {
    assert(this.isV14)
    return this._chain.getStorage(this.blockHash, 'Energy', 'EnergyBalance', key)
  }

  async getManyAsV14(keys: Uint8Array[]): Promise<(bigint)[]> {
    assert(this.isV14)
    return this._chain.queryStorage(this.blockHash, 'Energy', 'EnergyBalance', keys.map(k => [k]))
  }

  async getAllAsV14(): Promise<(bigint)[]> {
    assert(this.isV14)
    return this._chain.queryStorage(this.blockHash, 'Energy', 'EnergyBalance')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Energy', 'EnergyBalance') != null
  }
}

export class EnergyTotalEnergyStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Total energy generated.
   */
  get isV14() {
    return this._chain.getStorageItemTypeHash('Energy', 'TotalEnergy') === 'f8ebe28eb30158172c0ccf672f7747c46a244f892d08ef2ebcbaadde34a26bc0'
  }

  /**
   *  Total energy generated.
   */
  async getAsV14(): Promise<bigint> {
    assert(this.isV14)
    return this._chain.getStorage(this.blockHash, 'Energy', 'TotalEnergy')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Energy', 'TotalEnergy') != null
  }
}

export class EnergyValueCoefficientStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current value coefficient.
   */
  get isV14() {
    return this._chain.getStorageItemTypeHash('Energy', 'ValueCoefficient') === '3c9260c078e57deb94e3d10dca1995a3263c48d53634c311a3537412486bb35e'
  }

  /**
   *  The current value coefficient.
   */
  async getAsV14(): Promise<bigint> {
    assert(this.isV14)
    return this._chain.getStorage(this.blockHash, 'Energy', 'ValueCoefficient')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Energy', 'ValueCoefficient') != null
  }
}

export class ParachainInfoParachainIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainInfo', 'ParachainId') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainInfo', 'ParachainId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainInfo', 'ParachainId') != null
  }
}

export class ParachainSystemAnnouncedHrmpMessagesPerCandidateStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The number of HRMP messages we observed in `on_initialize` and thus used that number for
   *  announcing the weight of `on_initialize` and `on_finalize`.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'AnnouncedHrmpMessagesPerCandidate') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  The number of HRMP messages we observed in `on_initialize` and thus used that number for
   *  announcing the weight of `on_initialize` and `on_finalize`.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'AnnouncedHrmpMessagesPerCandidate')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'AnnouncedHrmpMessagesPerCandidate') != null
  }
}

export class ParachainSystemAuthorizedUpgradeStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The next authorized upgrade, if there is one.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'AuthorizedUpgrade') === '8620bdc4f360add1f8e58e488bdba4fa9b6dab86ecdd1c942b8d9de43ede38e5'
  }

  /**
   *  The next authorized upgrade, if there is one.
   */
  async getAsV1(): Promise<Uint8Array | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'AuthorizedUpgrade')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'AuthorizedUpgrade') != null
  }
}

export class ParachainSystemCustomValidationHeadDataStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  A custom head data that should be returned as result of `validate_block`.
   * 
   *  See [`Pallet::set_custom_validation_head_data`] for more information.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'CustomValidationHeadData') === '9d37db61fb40fc6c377391f52a7b349395407634d45b47a8943ab5ccf47e31e4'
  }

  /**
   *  A custom head data that should be returned as result of `validate_block`.
   * 
   *  See [`Pallet::set_custom_validation_head_data`] for more information.
   */
  async getAsV5(): Promise<Uint8Array | undefined> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'CustomValidationHeadData')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'CustomValidationHeadData') != null
  }
}

export class ParachainSystemDidSetValidationCodeStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Were the validation data set to notify the relay chain?
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'DidSetValidationCode') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  Were the validation data set to notify the relay chain?
   */
  async getAsV1(): Promise<boolean> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'DidSetValidationCode')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'DidSetValidationCode') != null
  }
}

export class ParachainSystemHostConfigurationStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The parachain host configuration that was obtained from the relay parent.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HostConfiguration') === 'e7770235be9d14ed134fc6d0effb398cdedbf1010adc4f3555004a1d10de49d3'
  }

  /**
   *  The parachain host configuration that was obtained from the relay parent.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  async getAsV1(): Promise<v1.V1AbridgedHostConfiguration | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'HostConfiguration')
  }

  /**
   *  The parachain host configuration that was obtained from the relay parent.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HostConfiguration') === '76792d33ff147d490bc5f8e4454e476c4ef71aae7021fd1a44f96974f263af9b'
  }

  /**
   *  The parachain host configuration that was obtained from the relay parent.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  async getAsV5(): Promise<v5.V1AbridgedHostConfiguration | undefined> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'HostConfiguration')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HostConfiguration') != null
  }
}

export class ParachainSystemHrmpOutboundMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  HRMP messages that were sent in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HrmpOutboundMessages') === '0330a7423804895204dc06607d196d45bbec59edfd3f4f38c868daa9e880928c'
  }

  /**
   *  HRMP messages that were sent in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  async getAsV1(): Promise<v1.OutboundHrmpMessage[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'HrmpOutboundMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HrmpOutboundMessages') != null
  }
}

export class ParachainSystemHrmpWatermarkStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  HRMP watermark that was set in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HrmpWatermark') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  HRMP watermark that was set in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'HrmpWatermark')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'HrmpWatermark') != null
  }
}

export class ParachainSystemLastDmqMqcHeadStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The last downward message queue chain head we have observed.
   * 
   *  This value is loaded before and saved after processing inbound downward messages carried
   *  by the system inherent.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'LastDmqMqcHead') === '146c0d1dce070e2a43f497c479248a882f4ed48937203ea336e85dcf2fa0ec6c'
  }

  /**
   *  The last downward message queue chain head we have observed.
   * 
   *  This value is loaded before and saved after processing inbound downward messages carried
   *  by the system inherent.
   */
  async getAsV1(): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'LastDmqMqcHead')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'LastDmqMqcHead') != null
  }
}

export class ParachainSystemLastHrmpMqcHeadsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The message queue chain heads we have observed per each channel incoming channel.
   * 
   *  This value is loaded before and saved after processing inbound downward messages carried
   *  by the system inherent.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'LastHrmpMqcHeads') === '26057692e067e44d8eec686a8711f8b87a11679701c3afa133f7b9da8f327999'
  }

  /**
   *  The message queue chain heads we have observed per each channel incoming channel.
   * 
   *  This value is loaded before and saved after processing inbound downward messages carried
   *  by the system inherent.
   */
  async getAsV1(): Promise<[number, Uint8Array][]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'LastHrmpMqcHeads')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'LastHrmpMqcHeads') != null
  }
}

export class ParachainSystemNewValidationCodeStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Validation code that is set by the parachain and is to be communicated to collator and
   *  consequently the relay-chain.
   * 
   *  This will be cleared in `on_initialize` of each new block if no other pallet already set
   *  the value.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'NewValidationCode') === '9d37db61fb40fc6c377391f52a7b349395407634d45b47a8943ab5ccf47e31e4'
  }

  /**
   *  Validation code that is set by the parachain and is to be communicated to collator and
   *  consequently the relay-chain.
   * 
   *  This will be cleared in `on_initialize` of each new block if no other pallet already set
   *  the value.
   */
  async getAsV1(): Promise<Uint8Array | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'NewValidationCode')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'NewValidationCode') != null
  }
}

export class ParachainSystemPendingUpwardMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Upward messages that are still pending and not yet send to the relay chain.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'PendingUpwardMessages') === '69b64a98b95b35e85f746389396240a8c70e1dca686229dc8d8a0812c030037a'
  }

  /**
   *  Upward messages that are still pending and not yet send to the relay chain.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'PendingUpwardMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'PendingUpwardMessages') != null
  }
}

export class ParachainSystemPendingValidationCodeStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  In case of a scheduled upgrade, this storage field contains the validation code to be applied.
   * 
   *  As soon as the relay chain gives us the go-ahead signal, we will overwrite the [`:code`][well_known_keys::CODE]
   *  which will result the next block process with the new validation code. This concludes the upgrade process.
   * 
   *  [well_known_keys::CODE]: sp_core::storage::well_known_keys::CODE
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'PendingValidationCode') === '8199405308c9981e32f632f64a8758ba69af0e625da26ff6d6670b81cc1f1647'
  }

  /**
   *  In case of a scheduled upgrade, this storage field contains the validation code to be applied.
   * 
   *  As soon as the relay chain gives us the go-ahead signal, we will overwrite the [`:code`][well_known_keys::CODE]
   *  which will result the next block process with the new validation code. This concludes the upgrade process.
   * 
   *  [well_known_keys::CODE]: sp_core::storage::well_known_keys::CODE
   */
  async getAsV1(): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'PendingValidationCode')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'PendingValidationCode') != null
  }
}

export class ParachainSystemProcessedDownwardMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Number of downward messages processed in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ProcessedDownwardMessages') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  Number of downward messages processed in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'ProcessedDownwardMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ProcessedDownwardMessages') != null
  }
}

export class ParachainSystemRelayStateProofStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The state proof for the last relay parent block.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  get isV10() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'RelayStateProof') === '38f79414b788123884c7cc1e6c6ca89331d3264f4bdcf6dff4501d6b20966908'
  }

  /**
   *  The state proof for the last relay parent block.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  async getAsV10(): Promise<v10.StorageProof | undefined> {
    assert(this.isV10)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'RelayStateProof')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'RelayStateProof') != null
  }
}

export class ParachainSystemRelevantMessagingStateStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The snapshot of some state related to messaging relevant to the current parachain as per
   *  the relay parent.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'RelevantMessagingState') === '24e0311e0ec9634d6acff6e06aa83b4bd4c57957b8f7525bf0dd22f0a73d7b09'
  }

  /**
   *  The snapshot of some state related to messaging relevant to the current parachain as per
   *  the relay parent.
   * 
   *  This field is meant to be updated each block with the validation data inherent. Therefore,
   *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
   * 
   *  This data is also absent from the genesis.
   */
  async getAsV1(): Promise<v1.MessagingStateSnapshot | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'RelevantMessagingState')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'RelevantMessagingState') != null
  }
}

export class ParachainSystemReservedDmpWeightOverrideStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The weight we reserve at the beginning of the block for processing DMP messages. This
   *  overrides the amount set in the Config trait.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ReservedDmpWeightOverride') === 'd3f0e4c96dad8d73df3c44f02993a46a9ed2eed15208047c7d80882af09d67cc'
  }

  /**
   *  The weight we reserve at the beginning of the block for processing DMP messages. This
   *  overrides the amount set in the Config trait.
   */
  async getAsV1(): Promise<bigint | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'ReservedDmpWeightOverride')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ReservedDmpWeightOverride') != null
  }
}

export class ParachainSystemReservedXcmpWeightOverrideStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The weight we reserve at the beginning of the block for processing XCMP messages. This
   *  overrides the amount set in the Config trait.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ReservedXcmpWeightOverride') === 'd3f0e4c96dad8d73df3c44f02993a46a9ed2eed15208047c7d80882af09d67cc'
  }

  /**
   *  The weight we reserve at the beginning of the block for processing XCMP messages. This
   *  overrides the amount set in the Config trait.
   */
  async getAsV1(): Promise<bigint | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'ReservedXcmpWeightOverride')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ReservedXcmpWeightOverride') != null
  }
}

export class ParachainSystemUpgradeRestrictionSignalStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  An option which indicates if the relay-chain restricts signalling a validation code upgrade.
   *  In other words, if this is `Some` and [`NewValidationCode`] is `Some` then the produced
   *  candidate will be invalid.
   * 
   *  This storage item is a mirror of the corresponding value for the current parachain from the
   *  relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
   *  set after the inherent.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'UpgradeRestrictionSignal') === '2236db14165f1386be95c2e72a22524bdd6b93f6d64e4b0b39d54e03f1f1bee2'
  }

  /**
   *  An option which indicates if the relay-chain restricts signalling a validation code upgrade.
   *  In other words, if this is `Some` and [`NewValidationCode`] is `Some` then the produced
   *  candidate will be invalid.
   * 
   *  This storage item is a mirror of the corresponding value for the current parachain from the
   *  relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
   *  set after the inherent.
   */
  async getAsV1(): Promise<(v1.V1UpgradeRestriction | undefined)> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'UpgradeRestrictionSignal')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'UpgradeRestrictionSignal') != null
  }
}

export class ParachainSystemUpwardMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Upward messages that were sent in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'UpwardMessages') === '69b64a98b95b35e85f746389396240a8c70e1dca686229dc8d8a0812c030037a'
  }

  /**
   *  Upward messages that were sent in a block.
   * 
   *  This will be cleared in `on_initialize` of each new block.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'UpwardMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'UpwardMessages') != null
  }
}

export class ParachainSystemValidationDataStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The [`PersistedValidationData`] set for this block.
   *  This value is expected to be set only once per block and it's never stored
   *  in the trie.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ValidationData') === 'fb37759067a991bce599d3fbe39ee38b99d63716a96357c3a39bf04c66e2579d'
  }

  /**
   *  The [`PersistedValidationData`] set for this block.
   *  This value is expected to be set only once per block and it's never stored
   *  in the trie.
   */
  async getAsV1(): Promise<v1.V1PersistedValidationData | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'ParachainSystem', 'ValidationData')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('ParachainSystem', 'ValidationData') != null
  }
}

export class PostsNextPostIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The next post id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Posts', 'NextPostId') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  The next post id.
   */
  async getAsV13(): Promise<bigint> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Posts', 'NextPostId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Posts', 'NextPostId') != null
  }
}

export class PostsPostByIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get the details of a post by its' id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Posts', 'PostById') === '1ee9e6bab61d7f8dadfe55ad1fd6e16929efcdd28544e6678c7664f42f5bc217'
  }

  /**
   *  Get the details of a post by its' id.
   */
  async getAsV13(key: bigint): Promise<v13.Post | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Posts', 'PostById', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(v13.Post | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'PostById', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(v13.Post)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'PostById')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Posts', 'PostById') != null
  }
}

export class PostsPostIdsBySpaceIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get the ids of all posts in a given space, by the space's id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Posts', 'PostIdsBySpaceId') === '200cefb60e4444365f0a4848cd45df373a5776ad748fb7e8ec6c12564846bcf2'
  }

  /**
   *  Get the ids of all posts in a given space, by the space's id.
   */
  async getAsV13(key: bigint): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Posts', 'PostIdsBySpaceId', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'PostIdsBySpaceId', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'PostIdsBySpaceId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Posts', 'PostIdsBySpaceId') != null
  }
}

export class PostsReplyIdsByPostIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get the ids of all direct replies by their parent's post id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Posts', 'ReplyIdsByPostId') === '200cefb60e4444365f0a4848cd45df373a5776ad748fb7e8ec6c12564846bcf2'
  }

  /**
   *  Get the ids of all direct replies by their parent's post id.
   */
  async getAsV13(key: bigint): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Posts', 'ReplyIdsByPostId', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'ReplyIdsByPostId', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'ReplyIdsByPostId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Posts', 'ReplyIdsByPostId') != null
  }
}

export class PostsSharedPostIdsByOriginalPostIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get the ids of all posts that have shared a given original post id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Posts', 'SharedPostIdsByOriginalPostId') === '200cefb60e4444365f0a4848cd45df373a5776ad748fb7e8ec6c12564846bcf2'
  }

  /**
   *  Get the ids of all posts that have shared a given original post id.
   */
  async getAsV13(key: bigint): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Posts', 'SharedPostIdsByOriginalPostId', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'SharedPostIdsByOriginalPostId', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Posts', 'SharedPostIdsByOriginalPostId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Posts', 'SharedPostIdsByOriginalPostId') != null
  }
}

export class ProfilesProfileSpaceIdByAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('Profiles', 'ProfileSpaceIdByAccount') === 'fc96d6750297129d4ff884dffc4742fe833e9be687fa34e80679655014942975'
  }

  async getAsV13(key: Uint8Array): Promise<bigint | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Profiles', 'ProfileSpaceIdByAccount', key)
  }

  async getManyAsV13(keys: Uint8Array[]): Promise<(bigint | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Profiles', 'ProfileSpaceIdByAccount', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Profiles', 'ProfileSpaceIdByAccount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Profiles', 'ProfileSpaceIdByAccount') != null
  }
}

export class ProxyAnnouncementsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The announcements made by the proxy (key).
   */
  get isV16() {
    return this._chain.getStorageItemTypeHash('Proxy', 'Announcements') === 'b93d53c53a308d910b0304bf5593bd71084bcf177629ea67da68b9026f4b417c'
  }

  /**
   *  The announcements made by the proxy (key).
   */
  async getAsV16(key: Uint8Array): Promise<[v16.Announcement[], bigint]> {
    assert(this.isV16)
    return this._chain.getStorage(this.blockHash, 'Proxy', 'Announcements', key)
  }

  async getManyAsV16(keys: Uint8Array[]): Promise<([v16.Announcement[], bigint])[]> {
    assert(this.isV16)
    return this._chain.queryStorage(this.blockHash, 'Proxy', 'Announcements', keys.map(k => [k]))
  }

  async getAllAsV16(): Promise<([v16.Announcement[], bigint])[]> {
    assert(this.isV16)
    return this._chain.queryStorage(this.blockHash, 'Proxy', 'Announcements')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Proxy', 'Announcements') != null
  }
}

export class ProxyProxiesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The set of account proxies. Maps the account which has delegated to the accounts
   *  which are being delegated to, together with the amount held on deposit.
   */
  get isV16() {
    return this._chain.getStorageItemTypeHash('Proxy', 'Proxies') === 'a18f4a259027142644e1877eae0e366efc4bbd35836c68749fc243d68528ec16'
  }

  /**
   *  The set of account proxies. Maps the account which has delegated to the accounts
   *  which are being delegated to, together with the amount held on deposit.
   */
  async getAsV16(key: Uint8Array): Promise<[v16.ProxyDefinition[], bigint]> {
    assert(this.isV16)
    return this._chain.getStorage(this.blockHash, 'Proxy', 'Proxies', key)
  }

  async getManyAsV16(keys: Uint8Array[]): Promise<([v16.ProxyDefinition[], bigint])[]> {
    assert(this.isV16)
    return this._chain.queryStorage(this.blockHash, 'Proxy', 'Proxies', keys.map(k => [k]))
  }

  async getAllAsV16(): Promise<([v16.ProxyDefinition[], bigint])[]> {
    assert(this.isV16)
    return this._chain.queryStorage(this.blockHash, 'Proxy', 'Proxies')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Proxy', 'Proxies') != null
  }
}

export class RandomnessCollectiveFlipRandomMaterialStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Series of block headers from the last 81 blocks that acts as random seed material. This
   *  is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
   *  the oldest hash.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('RandomnessCollectiveFlip', 'RandomMaterial') === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895'
  }

  /**
   *  Series of block headers from the last 81 blocks that acts as random seed material. This
   *  is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
   *  the oldest hash.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'RandomnessCollectiveFlip', 'RandomMaterial')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('RandomnessCollectiveFlip', 'RandomMaterial') != null
  }
}

export class ReactionsNextReactionIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The next reaction id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Reactions', 'NextReactionId') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  The next reaction id.
   */
  async getAsV13(): Promise<bigint> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Reactions', 'NextReactionId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Reactions', 'NextReactionId') != null
  }
}

export class ReactionsPostReactionIdByAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('Reactions', 'PostReactionIdByAccount') === '8144dc7f229be2a2b7ad84301180f82ed529c901b96b8a3be5af39aeb8207dae'
  }

  async getAsV13(key: [Uint8Array, bigint]): Promise<bigint> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Reactions', 'PostReactionIdByAccount', key)
  }

  async getManyAsV13(keys: [Uint8Array, bigint][]): Promise<(bigint)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Reactions', 'PostReactionIdByAccount', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Reactions', 'PostReactionIdByAccount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Reactions', 'PostReactionIdByAccount') != null
  }
}

export class ReactionsReactionByIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('Reactions', 'ReactionById') === 'd8add7455b8771ab21475ce6b7f17bec38df6e9c3b647cf42d2693b2021af789'
  }

  async getAsV13(key: bigint): Promise<v13.Reaction | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Reactions', 'ReactionById', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(v13.Reaction | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Reactions', 'ReactionById', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(v13.Reaction)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Reactions', 'ReactionById')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Reactions', 'ReactionById') != null
  }
}

export class ReactionsReactionIdsByPostIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('Reactions', 'ReactionIdsByPostId') === '200cefb60e4444365f0a4848cd45df373a5776ad748fb7e8ec6c12564846bcf2'
  }

  async getAsV13(key: bigint): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Reactions', 'ReactionIdsByPostId', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Reactions', 'ReactionIdsByPostId', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Reactions', 'ReactionIdsByPostId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Reactions', 'ReactionIdsByPostId') != null
  }
}

export class RolesNextRoleIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The next role id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Roles', 'NextRoleId') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  The next role id.
   */
  async getAsV13(): Promise<bigint> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Roles', 'NextRoleId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Roles', 'NextRoleId') != null
  }
}

export class RolesRoleByIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get the details of a role by its' id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Roles', 'RoleById') === '52d8945a8d7eda950a92c734807fed9b6c47f38eedd45ab1dbc67a1a469e9df4'
  }

  /**
   *  Get the details of a role by its' id.
   */
  async getAsV13(key: bigint): Promise<v13.Role | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Roles', 'RoleById', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(v13.Role | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'RoleById', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(v13.Role)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'RoleById')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Roles', 'RoleById') != null
  }
}

export class RolesRoleIdsBySpaceIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get a list of all role ids available in a given space.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Roles', 'RoleIdsBySpaceId') === '200cefb60e4444365f0a4848cd45df373a5776ad748fb7e8ec6c12564846bcf2'
  }

  /**
   *  Get a list of all role ids available in a given space.
   */
  async getAsV13(key: bigint): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Roles', 'RoleIdsBySpaceId', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'RoleIdsBySpaceId', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'RoleIdsBySpaceId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Roles', 'RoleIdsBySpaceId') != null
  }
}

export class RolesRoleIdsByUserInSpaceStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get a list of all role ids owned by a given user (account or space id)
   *  within a given space.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Roles', 'RoleIdsByUserInSpace') === '07eff41ac3e5f3de8d983340d2fbd2bbfbab6f310e86801875c972003cf7740d'
  }

  /**
   *  Get a list of all role ids owned by a given user (account or space id)
   *  within a given space.
   */
  async getAsV13(key1: v13.User, key2: bigint): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Roles', 'RoleIdsByUserInSpace', key1, key2)
  }

  async getManyAsV13(keys: [v13.User, bigint][]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'RoleIdsByUserInSpace', keys)
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'RoleIdsByUserInSpace')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Roles', 'RoleIdsByUserInSpace') != null
  }
}

export class RolesUsersByRoleIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get a list of all users (account or space ids) that a given role has been granted to.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Roles', 'UsersByRoleId') === '26eb09317a74682c87f42efadb0a67ef01ec4e647cf12aa9e1e90dffa453e367'
  }

  /**
   *  Get a list of all users (account or space ids) that a given role has been granted to.
   */
  async getAsV13(key: bigint): Promise<v13.User[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Roles', 'UsersByRoleId', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(v13.User[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'UsersByRoleId', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(v13.User[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Roles', 'UsersByRoleId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Roles', 'UsersByRoleId') != null
  }
}

export class SessionCurrentIndexStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Current index of the session.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'CurrentIndex') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  Current index of the session.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'CurrentIndex')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'CurrentIndex') != null
  }
}

export class SessionDisabledValidatorsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Indices of disabled validators.
   * 
   *  The vec is always kept sorted so that we can find whether a given validator is
   *  disabled using binary search. It gets cleared when `on_session_ending` returns
   *  a new set of identities.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'DisabledValidators') === 'a9f6979e68cec9d5834e7d077129aa05e8b477f326cb009049d2178afbea14f0'
  }

  /**
   *  Indices of disabled validators.
   * 
   *  The vec is always kept sorted so that we can find whether a given validator is
   *  disabled using binary search. It gets cleared when `on_session_ending` returns
   *  a new set of identities.
   */
  async getAsV1(): Promise<number[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'DisabledValidators')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'DisabledValidators') != null
  }
}

export class SessionKeyOwnerStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The owner of a key. The key is the `KeyTypeId` + the encoded key.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'KeyOwner') === '20cf09ea865a34d19d79cca4e3df7a5a719547bdf984f5ab8eb811d55da822e5'
  }

  /**
   *  The owner of a key. The key is the `KeyTypeId` + the encoded key.
   */
  async getAsV1(key: [Uint8Array, Uint8Array]): Promise<Uint8Array | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'KeyOwner', key)
  }

  async getManyAsV1(keys: [Uint8Array, Uint8Array][]): Promise<(Uint8Array | undefined)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Session', 'KeyOwner', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Session', 'KeyOwner')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'KeyOwner') != null
  }
}

export class SessionNextKeysStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The next session keys for a validator.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'NextKeys') === '631bdf50943dc1aa6eef0e538bc5f8db41fca7120b2bae11b9c7ad84ada29964'
  }

  /**
   *  The next session keys for a validator.
   */
  async getAsV1(key: Uint8Array): Promise<v1.SessionKeys | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'NextKeys', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(v1.SessionKeys | undefined)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Session', 'NextKeys', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(v1.SessionKeys)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'Session', 'NextKeys')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'NextKeys') != null
  }
}

export class SessionQueuedChangedStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  True if the underlying economic identities or weighting behind the validators
   *  has changed in the queued validator set.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'QueuedChanged') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  True if the underlying economic identities or weighting behind the validators
   *  has changed in the queued validator set.
   */
  async getAsV1(): Promise<boolean> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'QueuedChanged')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'QueuedChanged') != null
  }
}

export class SessionQueuedKeysStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The queued keys for the next session. When the next session begins, these keys
   *  will be used to determine the validator's session keys.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'QueuedKeys') === '88cd205a98ff7b5562f0d030266b07e3566fdf283e05e6bd4c2405710a6a3b90'
  }

  /**
   *  The queued keys for the next session. When the next session begins, these keys
   *  will be used to determine the validator's session keys.
   */
  async getAsV1(): Promise<[Uint8Array, v1.SessionKeys][]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'QueuedKeys')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'QueuedKeys') != null
  }
}

export class SessionValidatorsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current set of validators.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Session', 'Validators') === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895'
  }

  /**
   *  The current set of validators.
   */
  async getAsV1(): Promise<Uint8Array[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Session', 'Validators')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Session', 'Validators') != null
  }
}

export class SpaceFollowsSpaceFollowedByAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('SpaceFollows', 'SpaceFollowedByAccount') === '3a5c068f0bee8f999fe4380eacc83b4955d448567a61570077100c6012e77833'
  }

  async getAsV13(key: [Uint8Array, bigint]): Promise<boolean> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'SpaceFollows', 'SpaceFollowedByAccount', key)
  }

  async getManyAsV13(keys: [Uint8Array, bigint][]): Promise<(boolean)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceFollows', 'SpaceFollowedByAccount', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(boolean)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceFollows', 'SpaceFollowedByAccount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('SpaceFollows', 'SpaceFollowedByAccount') != null
  }
}

export class SpaceFollowsSpaceFollowersStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('SpaceFollows', 'SpaceFollowers') === '184c47acb077e001b902021115493ba301fa2ec030dc0b1d5f2f5d836be22e29'
  }

  async getAsV13(key: bigint): Promise<Uint8Array[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'SpaceFollows', 'SpaceFollowers', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(Uint8Array[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceFollows', 'SpaceFollowers', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(Uint8Array[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceFollows', 'SpaceFollowers')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('SpaceFollows', 'SpaceFollowers') != null
  }
}

export class SpaceFollowsSpacesFollowedByAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('SpaceFollows', 'SpacesFollowedByAccount') === 'f43f17495ab14bf2b34cb5b8bdaf9729aaba8bafa8592e7c09f6213ac3464821'
  }

  async getAsV13(key: Uint8Array): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'SpaceFollows', 'SpacesFollowedByAccount', key)
  }

  async getManyAsV13(keys: Uint8Array[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceFollows', 'SpacesFollowedByAccount', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceFollows', 'SpacesFollowedByAccount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('SpaceFollows', 'SpacesFollowedByAccount') != null
  }
}

export class SpaceOwnershipPendingSpaceOwnerStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV13() {
    return this._chain.getStorageItemTypeHash('SpaceOwnership', 'PendingSpaceOwner') === 'ffc087e1323413e73a9729e444bf115bb89bc74cab9f4347c9dc890a14ae8d68'
  }

  async getAsV13(key: bigint): Promise<Uint8Array | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'SpaceOwnership', 'PendingSpaceOwner', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(Uint8Array | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceOwnership', 'PendingSpaceOwner', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(Uint8Array)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'SpaceOwnership', 'PendingSpaceOwner')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('SpaceOwnership', 'PendingSpaceOwner') != null
  }
}

export class SpacesNextSpaceIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The next space id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Spaces', 'NextSpaceId') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  The next space id.
   */
  async getAsV13(): Promise<bigint> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Spaces', 'NextSpaceId')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Spaces', 'NextSpaceId') != null
  }
}

export class SpacesSpaceByIdStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Get the details of a space by its' id.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Spaces', 'SpaceById') === 'ca7e1fe6a557d0d46aca0a24cbce813c2a7a0587a57ea47ecc9b233cadbe235f'
  }

  /**
   *  Get the details of a space by its' id.
   */
  async getAsV13(key: bigint): Promise<v13.Space | undefined> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Spaces', 'SpaceById', key)
  }

  async getManyAsV13(keys: bigint[]): Promise<(v13.Space | undefined)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Spaces', 'SpaceById', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(v13.Space)[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Spaces', 'SpaceById')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Spaces', 'SpaceById') != null
  }
}

export class SpacesSpaceIdsByOwnerStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Find the ids of all spaces owned, by a given account.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('Spaces', 'SpaceIdsByOwner') === 'f43f17495ab14bf2b34cb5b8bdaf9729aaba8bafa8592e7c09f6213ac3464821'
  }

  /**
   *  Find the ids of all spaces owned, by a given account.
   */
  async getAsV13(key: Uint8Array): Promise<bigint[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'Spaces', 'SpaceIdsByOwner', key)
  }

  async getManyAsV13(keys: Uint8Array[]): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Spaces', 'SpaceIdsByOwner', keys.map(k => [k]))
  }

  async getAllAsV13(): Promise<(bigint[])[]> {
    assert(this.isV13)
    return this._chain.queryStorage(this.blockHash, 'Spaces', 'SpaceIdsByOwner')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Spaces', 'SpaceIdsByOwner') != null
  }
}

export class SudoKeyStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The `AccountId` of the sudo key.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Sudo', 'Key') === '146c0d1dce070e2a43f497c479248a882f4ed48937203ea336e85dcf2fa0ec6c'
  }

  /**
   *  The `AccountId` of the sudo key.
   */
  async getAsV1(): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Sudo', 'Key')
  }

  /**
   *  The `AccountId` of the sudo key.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('Sudo', 'Key') === '8620bdc4f360add1f8e58e488bdba4fa9b6dab86ecdd1c942b8d9de43ede38e5'
  }

  /**
   *  The `AccountId` of the sudo key.
   */
  async getAsV5(): Promise<Uint8Array | undefined> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'Sudo', 'Key')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Sudo', 'Key') != null
  }
}

export class SystemAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The full account information for a particular account ID.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'Account') === '1ddc7ade926221442c388ee4405a71c9428e548fab037445aaf4b3a78f4735c1'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV1(key: Uint8Array): Promise<v1.AccountInfo> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<(v1.AccountInfo)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(v1.AccountInfo)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'Account')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'Account') != null
  }
}

export class SystemAllExtrinsicsLenStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Total length (in bytes) for all extrinsics put together, for the current block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'AllExtrinsicsLen') === 'a926ad48d1a07d1162c5fdb99f3f6cef39c7c5a115a92ff9ccf0357bae4bf2ed'
  }

  /**
   *  Total length (in bytes) for all extrinsics put together, for the current block.
   */
  async getAsV1(): Promise<number | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'AllExtrinsicsLen')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'AllExtrinsicsLen') != null
  }
}

export class SystemBlockHashStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Map of block numbers to block hashes.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'BlockHash') === '06f5703796027f4b198d4ffd50b721273430d8ff663660646793873168f9df17'
  }

  /**
   *  Map of block numbers to block hashes.
   */
  async getAsV1(key: number): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'BlockHash', key)
  }

  async getManyAsV1(keys: number[]): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'BlockHash', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'BlockHash')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'BlockHash') != null
  }
}

export class SystemBlockWeightStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current weight for the block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'BlockWeight') === '3117e920c869758010946f61bdfb045561b02a263bdc3bcff42e4ce915e4e5d4'
  }

  /**
   *  The current weight for the block.
   */
  async getAsV1(): Promise<v1.PerDispatchClass> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'BlockWeight')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'BlockWeight') != null
  }
}

export class SystemDigestStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Digest of the current block, also part of the block header.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'Digest') === '08ab0f1eb08eb281a0be5123646d1a04bf4254218b3b8617ed26e880f8eaa52f'
  }

  /**
   *  Digest of the current block, also part of the block header.
   */
  async getAsV1(): Promise<v1.Digest> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'Digest')
  }

  /**
   *  Digest of the current block, also part of the block header.
   */
  get isV2() {
    return this._chain.getStorageItemTypeHash('System', 'Digest') === '6edb48fd53810bda6cc1015d69e4aacd63966970836398edb4a47cec0bf3fa85'
  }

  /**
   *  Digest of the current block, also part of the block header.
   */
  async getAsV2(): Promise<v2.Digest> {
    assert(this.isV2)
    return this._chain.getStorage(this.blockHash, 'System', 'Digest')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'Digest') != null
  }
}

export class SystemEventCountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The number of events in the `Events<T>` list.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'EventCount') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  The number of events in the `Events<T>` list.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'EventCount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'EventCount') != null
  }
}

export class SystemEventTopicsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Mapping between a topic (represented by T::Hash) and a vector of indexes
   *  of events in the `<Events<T>>` list.
   * 
   *  All topic vectors have deterministic storage locations depending on the topic. This
   *  allows light-clients to leverage the changes trie storage tracking mechanism and
   *  in case of changes fetch the list of events of interest.
   * 
   *  The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
   *  the `EventIndex` then in case if the topic has the same contents on the next block
   *  no notification will be triggered thus the event might be lost.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'EventTopics') === 'd5ef37ba3daec264a9dcba5a29bf5b2ff23eb80b912936f924f44a8db557c58d'
  }

  /**
   *  Mapping between a topic (represented by T::Hash) and a vector of indexes
   *  of events in the `<Events<T>>` list.
   * 
   *  All topic vectors have deterministic storage locations depending on the topic. This
   *  allows light-clients to leverage the changes trie storage tracking mechanism and
   *  in case of changes fetch the list of events of interest.
   * 
   *  The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
   *  the `EventIndex` then in case if the topic has the same contents on the next block
   *  no notification will be triggered thus the event might be lost.
   */
  async getAsV1(key: Uint8Array): Promise<[number, number][]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'EventTopics', key)
  }

  async getManyAsV1(keys: Uint8Array[]): Promise<([number, number][])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'EventTopics', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<([number, number][])[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'EventTopics')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'EventTopics') != null
  }
}

export class SystemEventsStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === '42c839025f26b7c32228e40ef7c135680466832a9b8f4bc12800f169eceb8aa3'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  async getAsV1(): Promise<v1.EventRecord[]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  get isV2() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === 'a0165c704a80c65afe0513df2aef9b8dc876bd8ffba5c235bcaef30af33082b4'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  async getAsV2(): Promise<v2.EventRecord[]> {
    assert(this.isV2)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === '6d25899a301519935888ebac674eb3a0ee1bc1a067601b3d53fc95cd5d4f8302'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  async getAsV5(): Promise<v5.EventRecord[]> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  get isV7() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === '15246cf9d43d81e033767dde42c2b41962cbe2822795b0058cbeae2b3d4ae954'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  async getAsV7(): Promise<v7.EventRecord[]> {
    assert(this.isV7)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  get isV10() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === 'ffa1f14302ea5d6c73d61b5aa7a878b603edddcc54b1946d4340fb705f5f6282'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  async getAsV10(): Promise<v10.EventRecord[]> {
    assert(this.isV10)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  get isV12() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === '335ad13a554179a6b8878c87d5a6758824ef94e643e439eb42a141dab685ee4a'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
   *  from within the runtime.
   */
  async getAsV12(): Promise<v12.EventRecord[]> {
    assert(this.isV12)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: The item is unbound and should therefore never be read on chain.
   *  It could otherwise inflate the PoV size of a block.
   * 
   *  Events have a large in-memory size. Box the events to not go out-of-memory
   *  just in case someone still reads them from within the runtime.
   */
  get isV13() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === '67a5ee5e83f51bf56b2f21b1ea86ba79e6fffd1e93b98d373a13ee9c486e0bd8'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: The item is unbound and should therefore never be read on chain.
   *  It could otherwise inflate the PoV size of a block.
   * 
   *  Events have a large in-memory size. Box the events to not go out-of-memory
   *  just in case someone still reads them from within the runtime.
   */
  async getAsV13(): Promise<v13.EventRecord[]> {
    assert(this.isV13)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: The item is unbound and should therefore never be read on chain.
   *  It could otherwise inflate the PoV size of a block.
   * 
   *  Events have a large in-memory size. Box the events to not go out-of-memory
   *  just in case someone still reads them from within the runtime.
   */
  get isV14() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === 'a243aec30c8875c009e742fa4d81e746ca65ca2dd5ca8f62cffa8810a622aedc'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: The item is unbound and should therefore never be read on chain.
   *  It could otherwise inflate the PoV size of a block.
   * 
   *  Events have a large in-memory size. Box the events to not go out-of-memory
   *  just in case someone still reads them from within the runtime.
   */
  async getAsV14(): Promise<v14.EventRecord[]> {
    assert(this.isV14)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: The item is unbound and should therefore never be read on chain.
   *  It could otherwise inflate the PoV size of a block.
   * 
   *  Events have a large in-memory size. Box the events to not go out-of-memory
   *  just in case someone still reads them from within the runtime.
   */
  get isV16() {
    return this._chain.getStorageItemTypeHash('System', 'Events') === 'b8ff83c04f4b1e5f6a2f5cf475a4ab22ed7e9692f0150269da5ffc4b7fc8f955'
  }

  /**
   *  Events deposited for the current block.
   * 
   *  NOTE: The item is unbound and should therefore never be read on chain.
   *  It could otherwise inflate the PoV size of a block.
   * 
   *  Events have a large in-memory size. Box the events to not go out-of-memory
   *  just in case someone still reads them from within the runtime.
   */
  async getAsV16(): Promise<v16.EventRecord[]> {
    assert(this.isV16)
    return this._chain.getStorage(this.blockHash, 'System', 'Events')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'Events') != null
  }
}

export class SystemExecutionPhaseStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The execution phase of the block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'ExecutionPhase') === '0ad1e323fa21971add5b3b0cc709a6e02dc7c64db7d344c1a67ec0227969ae75'
  }

  /**
   *  The execution phase of the block.
   */
  async getAsV1(): Promise<v1.Phase | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'ExecutionPhase')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'ExecutionPhase') != null
  }
}

export class SystemExtrinsicCountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Total extrinsics count for the current block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'ExtrinsicCount') === 'a926ad48d1a07d1162c5fdb99f3f6cef39c7c5a115a92ff9ccf0357bae4bf2ed'
  }

  /**
   *  Total extrinsics count for the current block.
   */
  async getAsV1(): Promise<number | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'ExtrinsicCount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'ExtrinsicCount') != null
  }
}

export class SystemExtrinsicDataStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Extrinsics data for the current block (maps an extrinsic's index to its data).
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'ExtrinsicData') === 'f278d7d239e9ac4cbb0509cc885124fd45c3f5b75452aba0391701e1a886debb'
  }

  /**
   *  Extrinsics data for the current block (maps an extrinsic's index to its data).
   */
  async getAsV1(key: number): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'ExtrinsicData', key)
  }

  async getManyAsV1(keys: number[]): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'ExtrinsicData', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'System', 'ExtrinsicData')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'ExtrinsicData') != null
  }
}

export class SystemLastRuntimeUpgradeStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'LastRuntimeUpgrade') === 'e03e445e7a7694163bede3a772a8a347abf7a3a00424fbafec75f819d6173a17'
  }

  /**
   *  Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
   */
  async getAsV1(): Promise<v1.LastRuntimeUpgradeInfo | undefined> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'LastRuntimeUpgrade')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'LastRuntimeUpgrade') != null
  }
}

export class SystemNumberStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current block number being processed. Set by `execute_block`.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'Number') === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
  }

  /**
   *  The current block number being processed. Set by `execute_block`.
   */
  async getAsV1(): Promise<number> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'Number')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'Number') != null
  }
}

export class SystemParentHashStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Hash of the previous block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'ParentHash') === '146c0d1dce070e2a43f497c479248a882f4ed48937203ea336e85dcf2fa0ec6c'
  }

  /**
   *  Hash of the previous block.
   */
  async getAsV1(): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'ParentHash')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'ParentHash') != null
  }
}

export class SystemUpgradedToTripleRefCountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
   *  (default) if not.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'UpgradedToTripleRefCount') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
   *  (default) if not.
   */
  async getAsV1(): Promise<boolean> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'UpgradedToTripleRefCount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'UpgradedToTripleRefCount') != null
  }
}

export class SystemUpgradedToU32RefCountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('System', 'UpgradedToU32RefCount') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
   */
  async getAsV1(): Promise<boolean> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'System', 'UpgradedToU32RefCount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'UpgradedToU32RefCount') != null
  }
}

export class TimestampDidUpdateStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Did the timestamp get updated in this block?
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Timestamp', 'DidUpdate') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  Did the timestamp get updated in this block?
   */
  async getAsV1(): Promise<boolean> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Timestamp', 'DidUpdate')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Timestamp', 'DidUpdate') != null
  }
}

export class TimestampNowStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Current time for the current block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('Timestamp', 'Now') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  Current time for the current block.
   */
  async getAsV1(): Promise<bigint> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'Timestamp', 'Now')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Timestamp', 'Now') != null
  }
}

export class TransactionPaymentNextFeeMultiplierStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV1() {
    return this._chain.getStorageItemTypeHash('TransactionPayment', 'NextFeeMultiplier') === 'f8ebe28eb30158172c0ccf672f7747c46a244f892d08ef2ebcbaadde34a26bc0'
  }

  async getAsV1(): Promise<bigint> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'TransactionPayment', 'NextFeeMultiplier')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('TransactionPayment', 'NextFeeMultiplier') != null
  }
}

export class TransactionPaymentStorageVersionStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  get isV1() {
    return this._chain.getStorageItemTypeHash('TransactionPayment', 'StorageVersion') === '7a0b9b43fb3e876cfa92bb4b00e569ef9a82972b0600c8a8570e064c7e3890fd'
  }

  async getAsV1(): Promise<v1.Type_147> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'TransactionPayment', 'StorageVersion')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('TransactionPayment', 'StorageVersion') != null
  }
}

export class VestingStorageVersionStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Storage version of the pallet.
   * 
   *  New networks start with latest version, as determined by the genesis build.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('Vesting', 'StorageVersion') === '5370c514276f3735e13df7db1f1bbacaba918c365a3ed949597f7ce091eeb77e'
  }

  /**
   *  Storage version of the pallet.
   * 
   *  New networks start with latest version, as determined by the genesis build.
   */
  async getAsV5(): Promise<v5.Type_177> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'Vesting', 'StorageVersion')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Vesting', 'StorageVersion') != null
  }
}

export class VestingVestingStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Information regarding the vesting of a given account.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('Vesting', 'Vesting') === '22ac0db91087ba9b3f5dee769d5e3398f8c8c045cabf7f6585992df66dba74db'
  }

  /**
   *  Information regarding the vesting of a given account.
   */
  async getAsV5(key: Uint8Array): Promise<v5.VestingInfo[] | undefined> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'Vesting', 'Vesting', key)
  }

  async getManyAsV5(keys: Uint8Array[]): Promise<(v5.VestingInfo[] | undefined)[]> {
    assert(this.isV5)
    return this._chain.queryStorage(this.blockHash, 'Vesting', 'Vesting', keys.map(k => [k]))
  }

  async getAllAsV5(): Promise<(v5.VestingInfo[])[]> {
    assert(this.isV5)
    return this._chain.queryStorage(this.blockHash, 'Vesting', 'Vesting')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Vesting', 'Vesting') != null
  }
}

export class XcmpQueueInboundXcmpMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Inbound aggregate XCMP messages. It can only be one per ParaId/block.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'InboundXcmpMessages') === '7bf0d83d361216e18f7bca971cbf4fbd433158d3be6ac33fe278fb6d9bfb0469'
  }

  /**
   *  Inbound aggregate XCMP messages. It can only be one per ParaId/block.
   */
  async getAsV1(key1: number, key2: number): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'InboundXcmpMessages', key1, key2)
  }

  async getManyAsV1(keys: [number, number][]): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'InboundXcmpMessages', keys)
  }

  async getAllAsV1(): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'InboundXcmpMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'InboundXcmpMessages') != null
  }
}

export class XcmpQueueInboundXcmpStatusStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Status of the inbound XCMP channels.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'InboundXcmpStatus') === '48f3de6a738f03ae3c729fdf2adfbcc7dd58a2d62c1e81c228ac332b7237c8c2'
  }

  /**
   *  Status of the inbound XCMP channels.
   */
  async getAsV1(): Promise<[number, v1.InboundStatus, [number, v1.XcmpMessageFormat][]][]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'InboundXcmpStatus')
  }

  /**
   *  Status of the inbound XCMP channels.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'InboundXcmpStatus') === '9463adeec55c62de9270b726721d07d1258e861fc23bcadc753e06286f1e9d94'
  }

  /**
   *  Status of the inbound XCMP channels.
   */
  async getAsV5(): Promise<v5.InboundChannelDetails[]> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'InboundXcmpStatus')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'InboundXcmpStatus') != null
  }
}

export class XcmpQueueOutboundXcmpMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The messages outbound in a given XCMP channel.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OutboundXcmpMessages') === 'f8f791196403322746e9b911cdffc1dfb7880ff624b4765b5515d8264f7df7b2'
  }

  /**
   *  The messages outbound in a given XCMP channel.
   */
  async getAsV1(key1: number, key2: number): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'OutboundXcmpMessages', key1, key2)
  }

  async getManyAsV1(keys: [number, number][]): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'OutboundXcmpMessages', keys)
  }

  async getAllAsV1(): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'OutboundXcmpMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OutboundXcmpMessages') != null
  }
}

export class XcmpQueueOutboundXcmpStatusStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The non-empty XCMP channels in order of becoming non-empty, and the index of the first
   *  and last outbound message. If the two indices are equal, then it indicates an empty
   *  queue and there must be a non-`Ok` `OutboundStatus`. We assume queues grow no greater
   *  than 65535 items. Queue indices for normal messages begin at one; zero is reserved in
   *  case of the need to send a high-priority signal message this block.
   *  The bool is true if there is a signal message waiting to be sent.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OutboundXcmpStatus') === '2284f25ad36d908dd9054d516baba1c7da89eb5dbefc09e2f88eaad6bd217ebf'
  }

  /**
   *  The non-empty XCMP channels in order of becoming non-empty, and the index of the first
   *  and last outbound message. If the two indices are equal, then it indicates an empty
   *  queue and there must be a non-`Ok` `OutboundStatus`. We assume queues grow no greater
   *  than 65535 items. Queue indices for normal messages begin at one; zero is reserved in
   *  case of the need to send a high-priority signal message this block.
   *  The bool is true if there is a signal message waiting to be sent.
   */
  async getAsV1(): Promise<[number, v1.OutboundStatus, boolean, number, number][]> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'OutboundXcmpStatus')
  }

  /**
   *  The non-empty XCMP channels in order of becoming non-empty, and the index of the first
   *  and last outbound message. If the two indices are equal, then it indicates an empty
   *  queue and there must be a non-`Ok` `OutboundStatus`. We assume queues grow no greater
   *  than 65535 items. Queue indices for normal messages begin at one; zero is reserved in
   *  case of the need to send a high-priority signal message this block.
   *  The bool is true if there is a signal message waiting to be sent.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OutboundXcmpStatus') === '0803a0634571a8cfdaa8b16757a06e235664ceb84c144cf0d5953fd2dd0f7f3a'
  }

  /**
   *  The non-empty XCMP channels in order of becoming non-empty, and the index of the first
   *  and last outbound message. If the two indices are equal, then it indicates an empty
   *  queue and there must be a non-`Ok` `OutboundStatus`. We assume queues grow no greater
   *  than 65535 items. Queue indices for normal messages begin at one; zero is reserved in
   *  case of the need to send a high-priority signal message this block.
   *  The bool is true if there is a signal message waiting to be sent.
   */
  async getAsV5(): Promise<v5.OutboundChannelDetails[]> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'OutboundXcmpStatus')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OutboundXcmpStatus') != null
  }
}

export class XcmpQueueOverweightStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The messages that exceeded max individual message weight budget.
   * 
   *  These message stay in this storage map until they are manually dispatched via
   *  `service_overweight`.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'Overweight') === '2eb096a3f66cc2d3a7f63f9f097c63bad7d960c4949a759a34865c7919f65122'
  }

  /**
   *  The messages that exceeded max individual message weight budget.
   * 
   *  These message stay in this storage map until they are manually dispatched via
   *  `service_overweight`.
   */
  async getAsV5(key: bigint): Promise<[number, number, Uint8Array] | undefined> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'Overweight', key)
  }

  async getManyAsV5(keys: bigint[]): Promise<([number, number, Uint8Array] | undefined)[]> {
    assert(this.isV5)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'Overweight', keys.map(k => [k]))
  }

  async getAllAsV5(): Promise<([number, number, Uint8Array])[]> {
    assert(this.isV5)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'Overweight')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'Overweight') != null
  }
}

export class XcmpQueueOverweightCountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The number of overweight messages ever recorded in `Overweight`. Also doubles as the next
   *  available free overweight index.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OverweightCount') === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
  }

  /**
   *  The number of overweight messages ever recorded in `Overweight`. Also doubles as the next
   *  available free overweight index.
   */
  async getAsV5(): Promise<bigint> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'OverweightCount')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'OverweightCount') != null
  }
}

export class XcmpQueueQueueConfigStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The configuration which controls the dynamics of the outbound queue.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'QueueConfig') === '4eee4c318310895e220c6e665c876bf76f75ef8f5530bcd8f8ea1d5b966ff46f'
  }

  /**
   *  The configuration which controls the dynamics of the outbound queue.
   */
  async getAsV1(): Promise<v1.QueueConfigData> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'QueueConfig')
  }

  /**
   *  The configuration which controls the dynamics of the outbound queue.
   */
  get isV5() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'QueueConfig') === 'bc17b84c06c7e0df3f2684c76020e6d76ff231be948076edbe6751b00937b0b1'
  }

  /**
   *  The configuration which controls the dynamics of the outbound queue.
   */
  async getAsV5(): Promise<v5.QueueConfigData> {
    assert(this.isV5)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'QueueConfig')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'QueueConfig') != null
  }
}

export class XcmpQueueQueueSuspendedStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Whether or not the XCMP queue is suspended from executing incoming XCMs or not.
   */
  get isV10() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'QueueSuspended') === '1b6fbf1674d189f761a7ac63093bf5c755bf073dd9d9f0dbe657289f92575db5'
  }

  /**
   *  Whether or not the XCMP queue is suspended from executing incoming XCMs or not.
   */
  async getAsV10(): Promise<boolean> {
    assert(this.isV10)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'QueueSuspended')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'QueueSuspended') != null
  }
}

export class XcmpQueueSignalMessagesStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Any signal messages waiting to be sent.
   */
  get isV1() {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'SignalMessages') === 'f278d7d239e9ac4cbb0509cc885124fd45c3f5b75452aba0391701e1a886debb'
  }

  /**
   *  Any signal messages waiting to be sent.
   */
  async getAsV1(key: number): Promise<Uint8Array> {
    assert(this.isV1)
    return this._chain.getStorage(this.blockHash, 'XcmpQueue', 'SignalMessages', key)
  }

  async getManyAsV1(keys: number[]): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'SignalMessages', keys.map(k => [k]))
  }

  async getAllAsV1(): Promise<(Uint8Array)[]> {
    assert(this.isV1)
    return this._chain.queryStorage(this.blockHash, 'XcmpQueue', 'SignalMessages')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('XcmpQueue', 'SignalMessages') != null
  }
}
