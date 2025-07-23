import { initBackgroundService } from "./backgroundService";

initBackgroundService();

export { startServices } from "./backgroundService";

export {
  authenticate,
  revokeAuth as revokeGDriveConnection,
  refreshConnection,
} from "./auth/googleAuth";

export {
  authenticate as authenticateOneDrive,
  validateToken,
  refreshConnection as refreshOneDriveConnection,
  getValidToken as getOneDriveValidToken,
  revokeAuth as revokeOneDriveConnection,
} from "./auth/oneDriveAuth";

export {
  authenticateDropbox,
  revokeDropboxAuth,
  refreshDropboxConnection,
} from "./auth/dropboxAuth";

export { setChromeLocal, getChromeLocal } from "./db/localDdOperations";

export { initializeStates } from "./stateInitializer";
