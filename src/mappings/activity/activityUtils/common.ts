// import { Post } from '../../../model';
// import { Ctx } from '../../../processor';
//
// export async function getPostOwnerId(post: Post, ctx: Ctx): Promise<string> {
//   // let ownerId = post.ownedByAccount.id; // Regular Post
//   //
//   // if (post.rootPost && post.rootPost.id) {
//   //   const rootPost = await ctx.store.get(
//   //     Post,
//   //     post.rootPost ? post.rootPost.id : null,
//   //     false
//   //   );
//   //   ownerId = rootPost ? rootPost.ownedByAccount.id : ownerId; // Comment Post
//   // } else if (post.parentPost && post.parentPost.id) {
//   //   const parentPost = await ctx.store.get(
//   //     Post,
//   //     post.parentPost ? post.parentPost.id : null,
//   //     false
//   //   );
//   //
//   //   ownerId = parentPost ? parentPost.ownedByAccount.id : ownerId; // Reply Post
//   // }
//   //
//   // return ownerId;
// }
