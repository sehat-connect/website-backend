"use strict";

const router = require("express").Router();
const { PHRController } = require("@api/controller");
const Auth = require("@middleware/authorization");

// AUTO APPROVAL
router.post(
    "/autoApproval",
    Auth.isAuthenticated(),
    PHRController.saveAutoApproval
);
router.get(
    "/autoApproval",
    Auth.isAuthenticated(),
    PHRController.getAutoApproval
);
router.patch(
    "/autoApproval/:id",
    Auth.isAuthenticated(),
    PHRController.updateAutoApprovalStatus
);

// SUBSCRIPTIONS
router.post(
    "/subscription",
    Auth.isAuthenticated(),
    PHRController.saveSubscription
);
router.get(
    "/subscription",
    Auth.isAuthenticated(),
    PHRController.getSubscription
);
router.patch(
    "/subscription/:id",
    Auth.isAuthenticated(),
    PHRController.updateSubscriptionStatus
);

// CARE CONTEXTS
router.post(
    "/careContext",
    Auth.isAuthenticated(),
    PHRController.saveCareContext
);
router.get(
    "/careContext",
    Auth.isAuthenticated(),
    PHRController.getCareContexts
);

module.exports = router;
