import { NextApiRequest, NextApiResponse } from "next";
import { Accessory } from "../../../entities/Accessory";
import { AccessorySet } from "../../../entities/AccessorySet";
import { Merchant } from "../../../entities/Merchant";
import initDB from "../../../utils/initDB";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("> API: /api/accessorySets/create hit");
  await initDB.check();
  if (req.method === "POST" && req.body.ids) {
    // Get Merchant
    const merchant = await Merchant.findOne({
      shopName: req.cookies.shopOrigin,
    });

    // Remove duplicates
    req.body.ids = req.body.ids.filter(
      (id) => !merchant.accessorySets.map((set) => set.baseProduct).includes(id)
    );

    await Promise.all(
      req.body.ids.map(async (id) => {
        return await AccessorySet.create({
          baseProduct: id,
          merchant: merchant,
        }).save();
      })
    );

    const updatedMerchant = await Merchant.findOne({
      shopName: req.cookies.shopOrigin,
    });
    res.status(200).json(updatedMerchant.accessorySets);
  } else {
    res.status(400).end();
  }
}

export default handler;
