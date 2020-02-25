import Post from '../models/post.model';
import PostSubscription from '../models/postSubscription.model';
import { saveAndNotifyUser } from '../controllers/notification.controller';

async function getPostFromThread(entityId) {
  return Post.findOne({ thread: entityId }).lean();
}

async function subscribePostFromEntity(entityId, user) {
  const post = await getPostFromThread(entityId);
  if (!post) return undefined;
  subscribePost(post, user);
  return post;
}

async function notifySubscribersFromEntity(entityId, user, payload) {
  const post = await getPostFromThread(entityId);
  if (!post) return;
  await notifySubscribers(post, user, payload);
}

async function subscribePost(post, user) { // Forumthread ID
  const data = {
    user: user._id,
    post: post._id
  };

  const options = {
    upsert: true,
    setDefaultsOnInsert: true
  };

  await PostSubscription.findOneAndUpdate(data, data, options);
  return post;
}

async function notifySubscribers(post, user, payload) {
  // get everyone that we need to notify
  const users = await PostSubscription.find({ post: post._id })
    .where('user').ne(user._id) // ignore own user
    .select('user')
    .lean()
    .exec()
    .map(s => s.user);

  if (!users.length) return;

  // save and sends an update with all the latest notifications
  users.forEach((u) => {
    saveAndNotifyUser(payload, u);
  });
}

export default {
  subscribePostFromEntity,
  notifySubscribersFromEntity,
  subscribePost,
  notifySubscribers
};
