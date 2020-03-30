import express from 'express';
import expressJwt from 'express-jwt';
import topicPageCtrl from '../controllers/topicPage.controller';
import config from '../../config/config';
import loadFullUser from '../middleware/loadFullUser.middleware';

const router = express.Router();


router.route('/recentPages')
  .get(topicPageCtrl.recentPages);

router.route('/:slug')
  .get(topicPageCtrl.showContent)
  .put(expressJwt({ secret: config.jwtSecret }), topicPageCtrl.update);

router.route('/:slug/publish')
  .put(expressJwt({ secret: config.jwtSecret }), topicPageCtrl.publish);

router.route('/:slug/unpublish')
  .put(expressJwt({ secret: config.jwtSecret }), topicPageCtrl.unpublish);

router.route('/:slug/edit')
  .get(expressJwt({ secret: config.jwtSecret }), topicPageCtrl.get);

router.route('/:slug/images')
  .get(expressJwt({ secret: config.jwtSecret }), topicPageCtrl.getImages)
  .post(
    expressJwt({ secret: config.jwtSecret }),
    loadFullUser,
    topicPageCtrl.signS3ImageUpload
  );

router.route('/:slug/images/:imageId')
  .delete(expressJwt({ secret: config.jwtSecret }), topicPageCtrl.deleteImage);
export default router;