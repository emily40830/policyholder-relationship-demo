import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string, number } from "yup";
import { isEmpty } from "ramda";

const prismaClient = new PrismaClient();

class PolicyHolderController {
  public static getPolicyHolder: RequestHandler = async (req, res) => {
    let targetCode = 1;
    const querySchema = object({
      code: number().integer().optional().default(1),
    });
    try {
      await querySchema.validate(req.query);
    } catch (error) {
      res.status(400).send({
        message: (error as Error).message,
        result: null,
      });
      return;
    }
    const { code } = await querySchema.cast(req.query);
    targetCode = code;

    try {
      const policyholder = await prismaClient.policyholder.findUnique({
        where: { code: targetCode },
      });

      if (isEmpty(policyholder) || policyholder === null) {
        res.status(404).send({
          message: `${code} doesn't exist`,
          result: null,
        });
        return;
      }
      res.status(200).send({
        message: "successfully get policyholder",
        result: policyholder,
      });
    } catch (error) {
      res.status(500).send({
        message: (error as Error).message,
        result: null,
      });
      return;
    }
  };

  public static getTopPolicyHolderByCode: RequestHandler = async (req, res) => {
    // validate input
    let targetCode = 1;
    const paramsSchema = object({
      code: number().integer().required(),
    });
    try {
      await paramsSchema.validate(req.params);
    } catch (error) {
      res.status(400).send({
        message: (error as Error).message,
        result: null,
      });
      return;
    }
    const { code } = await paramsSchema.cast(req.params);
    targetCode = code;

    try {
      const policyholder = await prismaClient.policyholder.findUnique({
        where: { code: targetCode },
      });

      if (isEmpty(policyholder) || policyholder === null) {
        res.status(404).send({
          message: `${code} doesn't exist`,
          result: null,
        });
        return;
      }
      res.status(200).send({
        message: `successfully get top from policyholder ${code}`,
        result: policyholder,
      });
    } catch (error) {
      res.status(500).send({
        message: (error as Error).message,
        result: null,
      });
      return;
    }
  };
}

export default PolicyHolderController;
