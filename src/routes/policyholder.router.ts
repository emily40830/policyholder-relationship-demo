import { Router } from "express";
import { PolicyHolderController } from "../controllers";

const policyholdersRouter = Router();

policyholdersRouter.get(
  "/:code/top",
  PolicyHolderController.getTopPolicyHolderByCode
);
policyholdersRouter.get("/", PolicyHolderController.getPolicyHolder);

export default policyholdersRouter;
