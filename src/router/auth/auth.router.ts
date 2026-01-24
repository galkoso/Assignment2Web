import { Router } from "express";
import { refreshAccessToken } from "./auth.handler";

export const createAuthRouter = () => {
    const router = Router();

    router.get('/refresh', refreshAccessToken());

    return router;
};