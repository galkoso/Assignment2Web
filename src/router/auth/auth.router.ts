import { Router } from "express";
import { refreshAccessToken } from "./auth.handler";

export const createAuthRouter = () => {
    const router = Router();

    /**
     * @openapi
     * /api/auth/refresh:
     *   get:
     *     summary: Refresh access token
     *     description: Issues a new access token using a refresh token.
     *     tags:
     *       - Auth
     *     responses:
     *       200:
     *         description: OK
     *       401:
     *         description: Unauthorized
     */
    router.get('/refresh', refreshAccessToken());

    return router;
};