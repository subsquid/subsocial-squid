import assert from "assert"
import * as marshal from "./marshal"

export class SpacePermissions {
    private _manageRoles!: boolean | undefined | null
    private _representSpaceInternally!: boolean | undefined | null
    private _representSpaceExternally!: boolean | undefined | null
    private _updateSpace!: boolean | undefined | null
    private _createSubspaces!: boolean | undefined | null
    private _updateOwnSubspaces!: boolean | undefined | null
    private _deleteOwnSubspaces!: boolean | undefined | null
    private _hideOwnSubspaces!: boolean | undefined | null
    private _updateAnySubspace!: boolean | undefined | null
    private _deleteAnySubspace!: boolean | undefined | null
    private _hideAnySubspace!: boolean | undefined | null
    private _createPosts!: boolean | undefined | null
    private _updateOwnPosts!: boolean | undefined | null
    private _deleteOwnPosts!: boolean | undefined | null
    private _hideOwnPosts!: boolean | undefined | null
    private _updateAnyPost!: boolean | undefined | null
    private _deleteAnyPost!: boolean | undefined | null
    private _hideAnyPost!: boolean | undefined | null
    private _createComments!: boolean | undefined | null
    private _updateOwnComments!: boolean | undefined | null
    private _deleteOwnComments!: boolean | undefined | null
    private _hideOwnComments!: boolean | undefined | null
    private _hideAnyComment!: boolean | undefined | null
    private _upvote!: boolean | undefined | null
    private _downvote!: boolean | undefined | null
    private _share!: boolean | undefined | null
    private _overrideSubspacePermissions!: boolean | undefined | null
    private _overridePostPermissions!: boolean | undefined | null
    private _suggestEntityStatus!: boolean | undefined | null
    private _updateEntityStatus!: boolean | undefined | null
    private _updateSpaceSettings!: boolean | undefined | null

    constructor(props?: Partial<Omit<SpacePermissions, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._manageRoles = json.manageRoles == null ? undefined : marshal.boolean.fromJSON(json.manageRoles)
            this._representSpaceInternally = json.representSpaceInternally == null ? undefined : marshal.boolean.fromJSON(json.representSpaceInternally)
            this._representSpaceExternally = json.representSpaceExternally == null ? undefined : marshal.boolean.fromJSON(json.representSpaceExternally)
            this._updateSpace = json.updateSpace == null ? undefined : marshal.boolean.fromJSON(json.updateSpace)
            this._createSubspaces = json.createSubspaces == null ? undefined : marshal.boolean.fromJSON(json.createSubspaces)
            this._updateOwnSubspaces = json.updateOwnSubspaces == null ? undefined : marshal.boolean.fromJSON(json.updateOwnSubspaces)
            this._deleteOwnSubspaces = json.deleteOwnSubspaces == null ? undefined : marshal.boolean.fromJSON(json.deleteOwnSubspaces)
            this._hideOwnSubspaces = json.hideOwnSubspaces == null ? undefined : marshal.boolean.fromJSON(json.hideOwnSubspaces)
            this._updateAnySubspace = json.updateAnySubspace == null ? undefined : marshal.boolean.fromJSON(json.updateAnySubspace)
            this._deleteAnySubspace = json.deleteAnySubspace == null ? undefined : marshal.boolean.fromJSON(json.deleteAnySubspace)
            this._hideAnySubspace = json.hideAnySubspace == null ? undefined : marshal.boolean.fromJSON(json.hideAnySubspace)
            this._createPosts = json.createPosts == null ? undefined : marshal.boolean.fromJSON(json.createPosts)
            this._updateOwnPosts = json.updateOwnPosts == null ? undefined : marshal.boolean.fromJSON(json.updateOwnPosts)
            this._deleteOwnPosts = json.deleteOwnPosts == null ? undefined : marshal.boolean.fromJSON(json.deleteOwnPosts)
            this._hideOwnPosts = json.hideOwnPosts == null ? undefined : marshal.boolean.fromJSON(json.hideOwnPosts)
            this._updateAnyPost = json.updateAnyPost == null ? undefined : marshal.boolean.fromJSON(json.updateAnyPost)
            this._deleteAnyPost = json.deleteAnyPost == null ? undefined : marshal.boolean.fromJSON(json.deleteAnyPost)
            this._hideAnyPost = json.hideAnyPost == null ? undefined : marshal.boolean.fromJSON(json.hideAnyPost)
            this._createComments = json.createComments == null ? undefined : marshal.boolean.fromJSON(json.createComments)
            this._updateOwnComments = json.updateOwnComments == null ? undefined : marshal.boolean.fromJSON(json.updateOwnComments)
            this._deleteOwnComments = json.deleteOwnComments == null ? undefined : marshal.boolean.fromJSON(json.deleteOwnComments)
            this._hideOwnComments = json.hideOwnComments == null ? undefined : marshal.boolean.fromJSON(json.hideOwnComments)
            this._hideAnyComment = json.hideAnyComment == null ? undefined : marshal.boolean.fromJSON(json.hideAnyComment)
            this._upvote = json.upvote == null ? undefined : marshal.boolean.fromJSON(json.upvote)
            this._downvote = json.downvote == null ? undefined : marshal.boolean.fromJSON(json.downvote)
            this._share = json.share == null ? undefined : marshal.boolean.fromJSON(json.share)
            this._overrideSubspacePermissions = json.overrideSubspacePermissions == null ? undefined : marshal.boolean.fromJSON(json.overrideSubspacePermissions)
            this._overridePostPermissions = json.overridePostPermissions == null ? undefined : marshal.boolean.fromJSON(json.overridePostPermissions)
            this._suggestEntityStatus = json.suggestEntityStatus == null ? undefined : marshal.boolean.fromJSON(json.suggestEntityStatus)
            this._updateEntityStatus = json.updateEntityStatus == null ? undefined : marshal.boolean.fromJSON(json.updateEntityStatus)
            this._updateSpaceSettings = json.updateSpaceSettings == null ? undefined : marshal.boolean.fromJSON(json.updateSpaceSettings)
        }
    }

    get manageRoles(): boolean | undefined | null {
        return this._manageRoles
    }

    set manageRoles(value: boolean | undefined | null) {
        this._manageRoles = value
    }

    get representSpaceInternally(): boolean | undefined | null {
        return this._representSpaceInternally
    }

    set representSpaceInternally(value: boolean | undefined | null) {
        this._representSpaceInternally = value
    }

    get representSpaceExternally(): boolean | undefined | null {
        return this._representSpaceExternally
    }

    set representSpaceExternally(value: boolean | undefined | null) {
        this._representSpaceExternally = value
    }

    get updateSpace(): boolean | undefined | null {
        return this._updateSpace
    }

    set updateSpace(value: boolean | undefined | null) {
        this._updateSpace = value
    }

    get createSubspaces(): boolean | undefined | null {
        return this._createSubspaces
    }

    set createSubspaces(value: boolean | undefined | null) {
        this._createSubspaces = value
    }

    get updateOwnSubspaces(): boolean | undefined | null {
        return this._updateOwnSubspaces
    }

    set updateOwnSubspaces(value: boolean | undefined | null) {
        this._updateOwnSubspaces = value
    }

    get deleteOwnSubspaces(): boolean | undefined | null {
        return this._deleteOwnSubspaces
    }

    set deleteOwnSubspaces(value: boolean | undefined | null) {
        this._deleteOwnSubspaces = value
    }

    get hideOwnSubspaces(): boolean | undefined | null {
        return this._hideOwnSubspaces
    }

    set hideOwnSubspaces(value: boolean | undefined | null) {
        this._hideOwnSubspaces = value
    }

    get updateAnySubspace(): boolean | undefined | null {
        return this._updateAnySubspace
    }

    set updateAnySubspace(value: boolean | undefined | null) {
        this._updateAnySubspace = value
    }

    get deleteAnySubspace(): boolean | undefined | null {
        return this._deleteAnySubspace
    }

    set deleteAnySubspace(value: boolean | undefined | null) {
        this._deleteAnySubspace = value
    }

    get hideAnySubspace(): boolean | undefined | null {
        return this._hideAnySubspace
    }

    set hideAnySubspace(value: boolean | undefined | null) {
        this._hideAnySubspace = value
    }

    get createPosts(): boolean | undefined | null {
        return this._createPosts
    }

    set createPosts(value: boolean | undefined | null) {
        this._createPosts = value
    }

    get updateOwnPosts(): boolean | undefined | null {
        return this._updateOwnPosts
    }

    set updateOwnPosts(value: boolean | undefined | null) {
        this._updateOwnPosts = value
    }

    get deleteOwnPosts(): boolean | undefined | null {
        return this._deleteOwnPosts
    }

    set deleteOwnPosts(value: boolean | undefined | null) {
        this._deleteOwnPosts = value
    }

    get hideOwnPosts(): boolean | undefined | null {
        return this._hideOwnPosts
    }

    set hideOwnPosts(value: boolean | undefined | null) {
        this._hideOwnPosts = value
    }

    get updateAnyPost(): boolean | undefined | null {
        return this._updateAnyPost
    }

    set updateAnyPost(value: boolean | undefined | null) {
        this._updateAnyPost = value
    }

    get deleteAnyPost(): boolean | undefined | null {
        return this._deleteAnyPost
    }

    set deleteAnyPost(value: boolean | undefined | null) {
        this._deleteAnyPost = value
    }

    get hideAnyPost(): boolean | undefined | null {
        return this._hideAnyPost
    }

    set hideAnyPost(value: boolean | undefined | null) {
        this._hideAnyPost = value
    }

    get createComments(): boolean | undefined | null {
        return this._createComments
    }

    set createComments(value: boolean | undefined | null) {
        this._createComments = value
    }

    get updateOwnComments(): boolean | undefined | null {
        return this._updateOwnComments
    }

    set updateOwnComments(value: boolean | undefined | null) {
        this._updateOwnComments = value
    }

    get deleteOwnComments(): boolean | undefined | null {
        return this._deleteOwnComments
    }

    set deleteOwnComments(value: boolean | undefined | null) {
        this._deleteOwnComments = value
    }

    get hideOwnComments(): boolean | undefined | null {
        return this._hideOwnComments
    }

    set hideOwnComments(value: boolean | undefined | null) {
        this._hideOwnComments = value
    }

    get hideAnyComment(): boolean | undefined | null {
        return this._hideAnyComment
    }

    set hideAnyComment(value: boolean | undefined | null) {
        this._hideAnyComment = value
    }

    get upvote(): boolean | undefined | null {
        return this._upvote
    }

    set upvote(value: boolean | undefined | null) {
        this._upvote = value
    }

    get downvote(): boolean | undefined | null {
        return this._downvote
    }

    set downvote(value: boolean | undefined | null) {
        this._downvote = value
    }

    get share(): boolean | undefined | null {
        return this._share
    }

    set share(value: boolean | undefined | null) {
        this._share = value
    }

    get overrideSubspacePermissions(): boolean | undefined | null {
        return this._overrideSubspacePermissions
    }

    set overrideSubspacePermissions(value: boolean | undefined | null) {
        this._overrideSubspacePermissions = value
    }

    get overridePostPermissions(): boolean | undefined | null {
        return this._overridePostPermissions
    }

    set overridePostPermissions(value: boolean | undefined | null) {
        this._overridePostPermissions = value
    }

    get suggestEntityStatus(): boolean | undefined | null {
        return this._suggestEntityStatus
    }

    set suggestEntityStatus(value: boolean | undefined | null) {
        this._suggestEntityStatus = value
    }

    get updateEntityStatus(): boolean | undefined | null {
        return this._updateEntityStatus
    }

    set updateEntityStatus(value: boolean | undefined | null) {
        this._updateEntityStatus = value
    }

    get updateSpaceSettings(): boolean | undefined | null {
        return this._updateSpaceSettings
    }

    set updateSpaceSettings(value: boolean | undefined | null) {
        this._updateSpaceSettings = value
    }

    toJSON(): object {
        return {
            manageRoles: this.manageRoles,
            representSpaceInternally: this.representSpaceInternally,
            representSpaceExternally: this.representSpaceExternally,
            updateSpace: this.updateSpace,
            createSubspaces: this.createSubspaces,
            updateOwnSubspaces: this.updateOwnSubspaces,
            deleteOwnSubspaces: this.deleteOwnSubspaces,
            hideOwnSubspaces: this.hideOwnSubspaces,
            updateAnySubspace: this.updateAnySubspace,
            deleteAnySubspace: this.deleteAnySubspace,
            hideAnySubspace: this.hideAnySubspace,
            createPosts: this.createPosts,
            updateOwnPosts: this.updateOwnPosts,
            deleteOwnPosts: this.deleteOwnPosts,
            hideOwnPosts: this.hideOwnPosts,
            updateAnyPost: this.updateAnyPost,
            deleteAnyPost: this.deleteAnyPost,
            hideAnyPost: this.hideAnyPost,
            createComments: this.createComments,
            updateOwnComments: this.updateOwnComments,
            deleteOwnComments: this.deleteOwnComments,
            hideOwnComments: this.hideOwnComments,
            hideAnyComment: this.hideAnyComment,
            upvote: this.upvote,
            downvote: this.downvote,
            share: this.share,
            overrideSubspacePermissions: this.overrideSubspacePermissions,
            overridePostPermissions: this.overridePostPermissions,
            suggestEntityStatus: this.suggestEntityStatus,
            updateEntityStatus: this.updateEntityStatus,
            updateSpaceSettings: this.updateSpaceSettings,
        }
    }
}
