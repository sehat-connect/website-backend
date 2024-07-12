"use strict";

const router = require("express").Router();
const { CommunityController } = require("@api/controller");
const Auth = require("@middleware/authorization");

router.post(
    "/heading",
    Auth.isAuthenticated(),
    CommunityController.createHeading
);
router.get("/heading", Auth.isAuthenticated(), CommunityController.getHeading);
router.put(
    "/heading/:id",
    Auth.isAuthenticated(),
    CommunityController.updateHeading
);

// CREATE COMMUNITY
router.post("/", Auth.isAuthenticated(), CommunityController.create);
router.get("/", Auth.isAuthenticated(), CommunityController.get);
router.put("/:id", Auth.isAuthenticated(), CommunityController.update);
router.delete("/:id", Auth.isAuthenticated(), CommunityController.remove);

// CREATE POST
router.post(
    "/communityPost",
    Auth.isAuthenticated(),
    CommunityController.createPost
);
router.get(
    "/communityPost",
    Auth.isAuthenticated(),
    CommunityController.getPost
);
router.put(
    "/communityPost/:id",
    Auth.isAuthenticated(),
    CommunityController.updatePost
);
router.delete(
    "/communityPost/:id",
    Auth.isAuthenticated(),
    CommunityController.removePost
);

router.patch(
    "/communityPost/:id",
    Auth.isAuthenticated(),
    CommunityController.HidePost
);
router.post(
    "/communityPost/report",
    Auth.isAuthenticated(),
    CommunityController.ReportPost
);

router.post(
    "/communityPostHide",
    Auth.isAuthenticated(),
    CommunityController.ReportHide
);
router.get(
    "/communityPostHideList",
    Auth.isAuthenticated(),
    CommunityController.getHideList
);

// REPLY
router.post(
    "/postReplay",
    Auth.isAuthenticated(),
    CommunityController.createPostReplay
);
router.get(
    "/postReplay",
    Auth.isAuthenticated(),
    CommunityController.getReplay
);
router.delete(
    "/postReplay/:id",
    Auth.isAuthenticated(),
    CommunityController.removeReplay
);

// POST LIKE
router.post(
    "/postLike",
    Auth.isAuthenticated(),
    CommunityController.createLike
);
router.get("/postLike", Auth.isAuthenticated(), CommunityController.getLike);
router.delete(
    "/postLike/:id",
    Auth.isAuthenticated(),
    CommunityController.removeLike
);

// POST SUPPORT
router.post(
    "/postSupport",
    Auth.isAuthenticated(),
    CommunityController.createSupport
);
router.get(
    "/postSupport",
    Auth.isAuthenticated(),
    CommunityController.getSupport
);
router.delete(
    "/postSupport/:id",
    Auth.isAuthenticated(),
    CommunityController.removeSupport
);

// POST APPLAUSE
router.post(
    "/postApplause",
    Auth.isAuthenticated(),
    CommunityController.createApplause
);
router.get(
    "/postApplause",
    Auth.isAuthenticated(),
    CommunityController.getApplause
);
router.delete(
    "/postApplause/:id",
    Auth.isAuthenticated(),
    CommunityController.removeApplause
);

// JOIN COMMUNITY
router.post(
    "/joinCommunity",
    Auth.isAuthenticated(),
    CommunityController.createJoinCommunity
);

router.patch(
    "/joinCommunity/:id",
    Auth.isAuthenticated(),
    CommunityController.updateJoinCommunity
);
router.get(
    "/joinCommunity",
    Auth.isAuthenticated(),
    CommunityController.joinCommunityList
);
router.delete(
    "/joinCommunity/:id",
    Auth.isAuthenticated(),
    CommunityController.removeJoinCommunity
);

// COMMUNITY DETAIL
router.get("/communityPostList", CommunityController.communityPostList);

router.get("/pageData", CommunityController.getData);
router.get("/search", CommunityController.searchData);





// get all community user

router.get("/communityUser", CommunityController.getCommunityUser);

router.delete("/DeleteJoinCommunity/:id", Auth.isAuthenticated(), CommunityController.DeleteJoinCommunity);


router.get( "/allPost",  Auth.isAuthenticated(), CommunityController.getallPost);






// testing
router.get("/likeCount", CommunityController.likeCount);

// only testing purpose this route
router.get("/communityDetail", CommunityController.communityDetail);


module.exports = router;
