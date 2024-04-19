const DeliveryApiTokens = require("../models/deliveryTokens");
require("dotenv").config();

const cdekController = async (req, res) => {
  try {
    const { from, to, weight, width, height, length } = req.body;
    const token = await DeliveryApiTokens.findOne({ name: "cdek" });
    let updatedToken;
    if (!token || token.expiresIn < Date.now()) {
      const cdekTokenResponse = await fetch(
        `https://api.edu.cdek.ru/v2/oauth/token?grant_type=client_credentials&client_id=${process.env.CDEK_ACCOUNT}&client_secret=${process.env.CDEK_PASSWORD}`,
        { method: "POST" }
      );
      const cdekTokenData = await cdekTokenResponse.json();
      const expiresIn = Date.now() + cdekTokenData.expires_in - 10;
      const newToken = cdekTokenData.access_token;
      updatedToken = newToken;
      if (!token) {
        const newTokenInDB = new DeliveryApiTokens({
          name: "cdek",
          token: newToken,
          expiresIn,
        });
        await newTokenInDB.save();
      } else {
        await DeliveryApiTokens.findOneAndUpdate(
          { name: "cdek" },
          { token: newToken, expiresIn }
        );
      }
    }
    const createPackages = () => {
      if (!height || !width || !length)
        return {
          weight,
        };
      else return { height, length, weight, width };
    };
    const cdekResponse = await fetch(
      "https://api.edu.cdek.ru/v2/calculator/tarifflist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${updatedToken ? updatedToken : token.token}`,
        },
        body: JSON.stringify({
          currency: 1,
          type: 2,
          lang: "rus",
          from_location: {
            postal_code: from,
          },
          to_location: {
            postal_code: to,
          },
          packages: [createPackages()],
        }),
      }
    );
    const cdekData = await cdekResponse.json();

    res.status(200).json({ cdekData });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ error: "Не удалось рассчитать стоимость и сроки доставки" });
  }
};

module.exports = cdekController;
