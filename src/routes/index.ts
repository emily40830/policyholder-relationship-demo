import { Router } from "express";
import policyholdersRouter from "./policyholder.router";

const apiRouter = Router();

apiRouter.use("/policyholders", policyholdersRouter);

export default apiRouter;
