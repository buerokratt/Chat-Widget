import { useCallback } from "react";
import { useNotificationsClient } from "@buerokratt-ria/notifications/react";
import { useAppDispatch } from "../store";
import { customJwtExtend } from "../slices/authentication-slice";

const useExtendJwt = (): (() => Promise<void>) => {
  const dispatch = useAppDispatch();
  const notificationsClient = useNotificationsClient();

  return useCallback(async () => {
    const result = await dispatch(customJwtExtend());

    if (customJwtExtend.fulfilled.match(result)) {
      notificationsClient.reconnect();
    }
  }, [dispatch, notificationsClient]);
};

export default useExtendJwt;
