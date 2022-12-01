import {
  PostsCreatePostCall,
  PostsForceCreatePostCall,
  PostsMovePostCall,
  PostsUpdatePostCall,
  ProfilesSetProfileCall,
  ReactionsCreatePostReactionCall,
  ReactionsDeletePostReactionCall,
  ReactionsUpdatePostReactionCall,
  SpacesCreateSpaceCall,
  SpacesForceCreateSpaceCall,
  SpacesUpdateSpaceCall
} from '../../types/generated/calls';
import { PostKind } from '../../model';

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
} from '../types';
import {
  getContentSrcDecorated,
  getReactionKindDecorated,
  getSpacePermissionsDecorated
} from '../decorators';
import * as v13 from '../../types/generated/v13';

export function parsePostCreatedCallArgs(
  ctx: EventContext
): CreatePostCallParsedData {
  let callInst: PostsCreatePostCall | PostsForceCreatePostCall | null = null;

  switch (ctx.event.call!.name) {
    case 'Posts.force_create_post':
      callInst = new PostsForceCreatePostCall(ctx, ctx.event.call!);
      break;
    default:
      callInst = new PostsCreatePostCall(ctx, ctx.event.call!);
  }
  if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

  const { extension, content } = callInst.asV13;
  const response: CreatePostCallParsedData = {
    ...getContentSrcDecorated(content),
    postKind: PostKind[extension.__kind],
    originalPost: null,
    parentPostId: null,
    rootPostId: null
  };

  switch (extension.__kind) {
    case PostKind.Comment:
      response.rootPostId = extension.value.rootPostId
        ? extension.value.rootPostId.toString()
        : null;
      if (response.rootPostId)
        response.parentPostId = extension.value.parentId
          ? extension.value.parentId.toString()
          : null;
      break;
    case PostKind.SharedPost:
      response.originalPost = extension.value.toString();
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

  switch (ctx.event.call!.name) {
    case 'Spaces.force_create_space':
      callInst = new SpacesForceCreateSpaceCall(ctx, ctx.event.call!);
      break;
    default:
      callInst = new SpacesCreateSpaceCall(ctx, ctx.event.call!);
  }
  if (!callInst) throw Error(`Unexpected call ${ctx.event.call!.name}`);

  const { content, permissionsOpt } = callInst.asV13;

  return {
    ...getContentSrcDecorated(content),
    permissions: getSpacePermissionsDecorated(permissionsOpt)
  };
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
  const callInst: ReactionsCreatePostReactionCall =
    new ReactionsCreatePostReactionCall(ctx, ctx.event.call!);

  const { postId, kind } = callInst.asV13;

  return {
    reactionKind: getReactionKindDecorated(kind),
    postId: postId.toString()
  };
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
  const callInst: ReactionsDeletePostReactionCall =
    new ReactionsDeletePostReactionCall(ctx, ctx.event.call!);

  const { postId, reactionId } = callInst.asV13;

  return {
    postId: postId.toString(),
    reactionId: reactionId.toString()
  };
}
