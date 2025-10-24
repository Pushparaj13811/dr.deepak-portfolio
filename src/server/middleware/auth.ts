import { getSessionFromRequest, getUserFromSession } from "../auth/session";
import type { AdminUser } from "../../types";

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Response | Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const sessionId = getSessionFromRequest(req);

    if (!sessionId) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = getUserFromSession(sessionId);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired session" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Attach user to request
    const authReq = req as AuthenticatedRequest;
    authReq.user = user;

    return handler(authReq);
  };
}

export function optionalAuth(handler: (req: AuthenticatedRequest) => Response | Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const sessionId = getSessionFromRequest(req);

    if (sessionId) {
      const user = getUserFromSession(sessionId);
      if (user) {
        const authReq = req as AuthenticatedRequest;
        authReq.user = user;
      }
    }

    return handler(req as AuthenticatedRequest);
  };
}
