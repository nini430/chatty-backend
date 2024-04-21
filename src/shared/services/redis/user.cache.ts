import { ServerError } from '@/globals/helpers/error-handler';
import { Helpers } from '@/globals/helpers/helpers';
import BaseCache from '@/services/redis/base.cache';
import { UserDocument } from '@/user/interfaces/user.interface';


export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
    this.client.connect();
  }

  public async saveUserToCache(key: string, uuid: string, createdUser: UserDocument): Promise<void> {
    const createdAt = new Date();
      const {_id, uId, username , email, avatarColor, blocked, blockedBy, postsCount, profilePicture, followersCount,followingCount,notifications, work, location, school, quote, bgImageId, bgImageVersion, social} = createdUser;
      const dataToSave={
        '_id': `${_id}`,
      'uId': `${uId}`,
      'username': `${username}`,
      'email': `${email}`,
      'avatarColor': `${avatarColor}`,
      'createdAt': `${createdAt}`,
      'postsCount': `${postsCount}`,
      'blocked': JSON.stringify(blocked),
      'blockedBy': JSON.stringify(blockedBy),
      'profilePicture': `${profilePicture}`,
      'followersCount': `${followersCount}`,
      'followingCount': `${followingCount}`,
      'notifications': JSON.stringify(notifications),
      'social': JSON.stringify(social),
      'work': `${work}`,
      'location': `${location}`,
      'school': `${school}`,
      'quote': `${quote}`,
      'bgImageId': `${bgImageId}`,
      'bgImageVersion': `${bgImageVersion}`
      };

      try{
          await this.client.ZADD('user', {score: parseInt(uuid, 10), value: `${key}`});
          await this.client.HSET(`users:${key}`, dataToSave);
          this.log.info('User redis added, success!!');
        }catch(err) {
        this.log.error(err);
        throw new ServerError('Server error. try again');
      }
  }

  public async getUserFromCache(key: string) {
    const response = await this.client.hGetAll(`users:${key}`) as unknown as UserDocument;
    response.createdAt = new Date(Helpers.parseJSON(`${response.createdAt}`));
    response.postsCount = Helpers.parseJSON(`${response.postsCount}`);
    response.blocked = Helpers.parseJSON(`${response.blocked}`);
    response.blockedBy = Helpers.parseJSON(`${response.blockedBy}`);
    response.notifications = Helpers.parseJSON(`${response.notifications}`);
    response.social = Helpers.parseJSON(`${response.social}`);
    response.followersCount = Helpers.parseJSON(`${response.followersCount}`);
    response.followingCount = Helpers.parseJSON(`${response.followingCount}`);
    response.bgImageId = Helpers.parseJSON(`${response.bgImageId}`);
    response.bgImageVersion = Helpers.parseJSON(`${response.bgImageVersion}`);
    response.profilePicture = Helpers.parseJSON(`${response.profilePicture}`);
    response.work = Helpers.parseJSON(`${response.work}`);
    response.school = Helpers.parseJSON(`${response.school}`);
    response.location = Helpers.parseJSON(`${response.location}`);
    response.quote = Helpers.parseJSON(`${response.quote}`);

    return response;

  }
}
