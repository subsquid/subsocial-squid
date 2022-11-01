import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result} from './support'
import * as v13 from './v13'

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
