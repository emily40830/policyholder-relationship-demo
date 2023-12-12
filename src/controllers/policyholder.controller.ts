import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { isEmpty } from "ramda";

const prismaClient = new PrismaClient();

type PolicyHolder = {
  code: string;
  name: string;
  depth: number;
  registration_date: Date;
  introducer_code: string | null;
};

function padDigits(number: number, digits: number): string {
  return (
    Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number
  );
}

class PolicyHolderController {
  public static getPolicyHolder: RequestHandler = async (req, res) => {
    const targetCode = Number(req.query.code);

    if (isNaN(targetCode)) {
      res.status(400).send({
        message: "invalid code",
        result: null,
      });
      return;
    }

    try {
      const policyholderResp = await prismaClient.policyholder.findUnique({
        where: { code: targetCode },
      });

      if (isEmpty(policyholderResp) || policyholderResp === null) {
        res.status(404).send({
          message: `${targetCode} doesn't exist`,
          result: null,
        });
        return;
      }

      const leftSide = await PolicyHolderController.getChildernPolicyHolders(
        policyholderResp.leftIntroducedCode,
        policyholderResp.depth,
        4
      );
      const rightSide = await PolicyHolderController.getChildernPolicyHolders(
        policyholderResp.rightIntroducedCode,
        policyholderResp.depth,
        4
      );

      const newPolicyHolder: PolicyHolder = {
        code: padDigits(policyholderResp.code, 10),
        name: policyholderResp.name,
        depth: policyholderResp.depth,
        registration_date: policyholderResp.registrationDate,
        introducer_code: policyholderResp.introducerCode
          ? padDigits(policyholderResp.introducerCode, 10)
          : null,
      };

      res.status(200).send({
        message: "successfully get policyholder",
        result: { ...newPolicyHolder, l: leftSide, r: rightSide },
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
    const code = req.params.code;
    const targetCode = Number(code);

    if (isNaN(targetCode)) {
      res.status(400).send({
        message: "invalid code",
        result: null,
      });
      return;
    }

    try {
      const policyholder = await prismaClient.policyholder.findUnique({
        where: { code: targetCode },
      });

      if (isEmpty(policyholder) || policyholder === null) {
        res.status(404).send({
          message: `${targetCode} doesn't exist`,
          result: null,
        });
        return;
      }
      if (!policyholder.parentIntroducerCode) {
        res.status(404).send({
          message: `${targetCode} is the top of full structure`,
          result: null,
        });
        return;
      }

      const parentPolicyHolder = await prismaClient.policyholder.findUnique({
        where: { code: policyholder.parentIntroducerCode },
      });

      if (isEmpty(parentPolicyHolder) || parentPolicyHolder === null) {
        res.status(404).send({
          message: `top PolicyHolder ${padDigits(
            policyholder.parentIntroducerCode,
            10
          )} doesn't exist`,
          result: null,
        });
        return;
      }

      const leftSide = await PolicyHolderController.getChildernPolicyHolders(
        parentPolicyHolder.leftIntroducedCode,
        parentPolicyHolder.depth,
        4
      );
      const rightSide = await PolicyHolderController.getChildernPolicyHolders(
        parentPolicyHolder.rightIntroducedCode,
        parentPolicyHolder.depth,
        4
      );

      const newParentPolicyHolder: PolicyHolder = {
        code: padDigits(parentPolicyHolder.code, 10),
        name: parentPolicyHolder.name,
        depth: parentPolicyHolder.depth,
        registration_date: parentPolicyHolder.registrationDate,
        introducer_code: parentPolicyHolder.introducerCode
          ? padDigits(parentPolicyHolder.introducerCode, 10)
          : null,
      };

      res.status(200).send({
        message: `successfully get top from policyholder ${code}`,
        result: { ...newParentPolicyHolder, l: leftSide, r: rightSide },
      });
    } catch (error) {
      res.status(500).send({
        message: (error as Error).message,
        result: null,
      });
      return;
    }
  };

  private static getChildernPolicyHolders: (
    code: number | null,
    depth: number,
    maxDepth: number
  ) => Promise<PolicyHolder[]> = async (code, depth, maxDepth = 4) => {
    if (!code) {
      return [];
    }
    const result: PolicyHolder[] = [];
    const queue: number[] = [];
    queue.push(code);
    let currentDepth = depth;
    const targetDepth = maxDepth + depth - 1;
    while (queue.length > 0 && currentDepth <= targetDepth) {
      const targetCode = queue.shift();
      const targetResp = await prismaClient.policyholder.findUnique({
        where: { code: targetCode },
      });
      if (!targetResp) {
        continue;
      }
      const newTarget: PolicyHolder = {
        code: padDigits(targetResp.code, 10),
        name: targetResp.name,
        depth: targetResp.depth,
        registration_date: targetResp.registrationDate,
        introducer_code: targetResp.introducerCode
          ? padDigits(targetResp.introducerCode, 10)
          : null,
      };
      result.push(newTarget);
      if (targetResp?.leftIntroducedCode) {
        queue.push(targetResp?.leftIntroducedCode);
      }
      if (targetResp?.rightIntroducedCode) {
        queue.push(targetResp?.rightIntroducedCode);
      }
      currentDepth += 1;
    }
    return result;
  };
}

export default PolicyHolderController;
