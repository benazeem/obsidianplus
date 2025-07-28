import {
  loadDropboxState,
  loadGoogleDriveState,
  loadObsidianState,
  loadOneDriveState,
  loadUIState,
} from "@/features";
import {type AppDispatch } from "@/store";
import setNotification from "@/utils/Notification";

export const initializeStates = async (dispatch: AppDispatch) => {
  try {
    // Execute sequentially to avoid race conditions
    await dispatch(loadObsidianState()).unwrap();
    await dispatch(loadGoogleDriveState()).unwrap();
    await dispatch(loadOneDriveState()).unwrap();
    await dispatch(loadDropboxState()).unwrap();
    await dispatch(loadUIState()).unwrap();
  } catch (error) {
    setNotification(
      "Failed to initialize states: " + error,
      "error"
    );
  }
};