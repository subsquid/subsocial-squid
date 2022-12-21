import {
  PostsCreatePostCall,
  PostsForceCreatePostCall,
  PostsMovePostCall,
  PostsUpdatePostCall,
  ProfilesSetProfileCall,
  ReactionsCreatePostReactionCall,
  ReactionsDeletePostReactionCall,
  ReactionsForceCreatePostReactionCall,
  ReactionsForceDeletePostReactionCall,
  ReactionsUpdatePostReactionCall,
  SpacesCreateSpaceCall,
  SpacesForceCreateSpaceCall,
  SpacesUpdateSpaceCall
} from '../../types/generated/calls';
import { PostKind, ReactionKind } from '../../model';

import {
  CreatePostCallParsedData,
  UpdatePostCallParsedData,
  EventContext,
  MovePostCallParsedData,
  CreateSpaceCallParsedData,
  UpdateSpaceCallParsedData,
  PostReactionCreateCallParsedData,
  PostReactionUpdateCallParsedData,
  PostReactionDeleteCallParsedData
} from '../../common/types';
import {
  getContentSrcDecorated,
  getReactionKindDecorated,
  getSpacePermissionsDecorated
} from '../decorators';
import * as v13 from '../../types/generated/v13';
import { addressSs58ToString } from '../../common/utils';

function ensureSpaceId(srcVal: bigint | undefined) {
  return srcVal !== null && srcVal !== undefined ? srcVal.toString() : srcVal;
}

export function parsePostCreatedCallArgs(
  ctx: EventContext
): CreatePostCallParsedData {
  let callInst: PostsCreatePostCall | PostsForceCreatePostCall | null = null;
  let extensionData: v13.PostExtension | null = null;
  let response: CreatePostCallParsedData = {
    ipfsSrc: null,
    otherSrc: null,
    none: false,
    forced: false,
    forcedData: null,
    spaceId: undefined,
    postKind: PostKind.RegularPost,
    originalPost: null,
    parentPostId: null,
    rootPostId: null
  };

  switch (ctx.event.call!.name) {
    case 'Posts.force_create_post': {
      callInst = new PostsForceCreatePostCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

      const { extension, content, spaceIdOpt, created, hidden, owner } =
        callInst.asV13;
      extensionData = extension;

      response = {
        ...response,
        ...getContentSrcDecorated(content),
        forced: true,
        spaceId: ensureSpaceId(spaceIdOpt),
        forcedData: {
          account: addressSs58ToString(created.account),
          block: created.block,
          time: new Date(Number.parseInt(created.time.toString())),
          owner: addressSs58ToString(owner),
          hidden
        }
      };
      break;
    }
    default: {
      callInst = new PostsCreatePostCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

      const { extension, content, spaceIdOpt } = callInst.asV13;

      extensionData = extension;
      response = {
        ...response,
        ...getContentSrcDecorated(content),
        spaceId: ensureSpaceId(spaceIdOpt)
      };
    }
  }

  response.postKind = PostKind[extensionData.__kind];
  switch (extensionData.__kind) {
    case PostKind.Comment:
      response.rootPostId = extensionData.value.rootPostId
        ? extensionData.value.rootPostId.toString()
        : null;
      if (response.rootPostId)
        response.parentPostId = extensionData.value.parentId
          ? extensionData.value.parentId.toString()
          : null;
      break;
    case PostKind.SharedPost:
      response.originalPost = extensionData.value.toString();
      break;
    default:
  }

  return response;
}
export function parsePostUpdatedCallArgs(
  ctx: EventContext
): UpdatePostCallParsedData {
  const callInst: PostsUpdatePostCall = new PostsUpdatePostCall(
    ctx,
    ctx.event.call!
  );
  const {
    update: { spaceId, content, hidden }
  } = callInst.asV13;

  return {
    ...getContentSrcDecorated(content),
    spaceId:
      spaceId !== null && spaceId !== undefined ? spaceId.toString() : spaceId,
    hidden
  };
}

export function parsePostMoveCallArgs(
  ctx: EventContext
): MovePostCallParsedData {
  const callInst: PostsMovePostCall = new PostsMovePostCall(
    ctx,
    ctx.event.call!
  );
  const { postId, newSpaceId } = callInst.asV13;

  return {
    toSpace:
      newSpaceId !== null && newSpaceId !== undefined
        ? newSpaceId.toString()
        : newSpaceId,
    postId: postId.toString()
  };
}

export function parseSpaceCreateCallArgs(
  ctx: EventContext
): CreateSpaceCallParsedData {
  let callInst: SpacesCreateSpaceCall | SpacesForceCreateSpaceCall | null =
    null;
  let response: CreateSpaceCallParsedData = {
    ipfsSrc: null,
    otherSrc: null,
    none: false,
    forced: false,
    forcedData: null,
    permissions: getSpacePermissionsDecorated()
  };

  switch (ctx.event.call!.name) {
    case 'Spaces.force_create_space': {
      callInst = new SpacesForceCreateSpaceCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);
      const { spaceId, created, owner, hidden, content, permissionsOpt } =
        callInst.asV13;
      response = {
        ...response,
        ...getContentSrcDecorated(content),
        forced: true,
        forcedData: {
          account: addressSs58ToString(created.account),
          block: created.block,
          time: new Date(Number.parseInt(created.time.toString())),
          owner: addressSs58ToString(owner),
          hidden
        },
        permissions: getSpacePermissionsDecorated(permissionsOpt)
      };
      break;
    }
    default: {
      callInst = new SpacesCreateSpaceCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);
      const { content, permissionsOpt } = callInst.asV13;
      response = {
        ...response,
        ...getContentSrcDecorated(content),
        permissions: getSpacePermissionsDecorated(permissionsOpt)
      };
    }
  }
  return response;
}

export function parseSpaceUpdateCallArgs(
  ctx: EventContext
): UpdateSpaceCallParsedData {
  let callInst: SpacesUpdateSpaceCall = new SpacesUpdateSpaceCall(
    ctx,
    ctx.event.call!
  );
  const {
    update: { content, permissions, hidden }
  } = callInst.asV13;

  return {
    ...getContentSrcDecorated(content),
    permissions: getSpacePermissionsDecorated(
      permissions.__kind === 'Some' ? permissions.value : undefined
    ),
    hidden: hidden ?? false
  };
}

export function parsePostReactionCreateCallArgs(
  ctx: EventContext
): PostReactionCreateCallParsedData {
  let callInst:
    | ReactionsCreatePostReactionCall
    | ReactionsForceCreatePostReactionCall
    | null = null;

  let response: PostReactionCreateCallParsedData = {
    forced: false,
    forcedData: null,
    reactionKind: ReactionKind.Upvote,
    postId: ''
  };

  switch (ctx.event.call!.name) {
    case 'Reactions.force_create_post_reaction': {
      callInst = new ReactionsForceCreatePostReactionCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

      const { who, postId, reactionId, reactionKind, created } = callInst.asV13;
      response = {
        ...response,
        forced: true,
        forcedData: {
          account: addressSs58ToString(created.account),
          block: created.block,
          time: new Date(Number.parseInt(created.time.toString()))
        },
        reactionKind: getReactionKindDecorated(reactionKind),
        postId: postId.toString()
      };
      break;
    }
    default: {
      callInst = new ReactionsCreatePostReactionCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);
      const { postId, kind } = callInst.asV13;
      response = {
        ...response,
        reactionKind: getReactionKindDecorated(kind),
        postId: postId.toString()
      };
    }
  }

  return response;
}

export function parsePostReactionUpdateCallArgs(
  ctx: EventContext
): PostReactionUpdateCallParsedData {
  const callInst: ReactionsUpdatePostReactionCall =
    new ReactionsUpdatePostReactionCall(ctx, ctx.event.call!);

  const { postId, reactionId, newKind } = callInst.asV13;

  return {
    newReactionKind: getReactionKindDecorated(newKind),
    postId: postId.toString(),
    reactionId: reactionId.toString()
  };
}

export function parsePostReactionDeleteCallArgs(
  ctx: EventContext
): PostReactionDeleteCallParsedData {
  let callInst:
    | ReactionsDeletePostReactionCall
    | ReactionsForceDeletePostReactionCall
    | null = null;

  let response: PostReactionDeleteCallParsedData = {
    forced: false,
    forcedData: null,
    reactionId: '',
    postId: ''
  };

  switch (ctx.event.call!.name) {
    case 'Reactions.force_delete_post_reaction': {
      callInst = new ReactionsForceDeletePostReactionCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

      const { who, postId, reactionId } = callInst.asV13;
      response = {
        ...response,
        forced: true,
        forcedData: {
          account: addressSs58ToString(who)
        },
        reactionId: reactionId.toString(),
        postId: postId.toString()
      };
      break;
    }
    default: {
      callInst = new ReactionsDeletePostReactionCall(ctx, ctx.event.call!);
      if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

      const { postId, reactionId } = callInst.asV13;
      response = {
        ...response,
        reactionId: reactionId.toString(),
        postId: postId.toString()
      };
    }
  }

  return response;
}
