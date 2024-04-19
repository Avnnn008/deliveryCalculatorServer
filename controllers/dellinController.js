require("dotenv").config();

const dellinController = async (req, res) => {
  try {
    const { from, to, weight, width, length, height } = req.body;
    const dellinResponse = await fetch(
      "https://api.dellin.ru/v2/calculator.json ",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appkey: process.env.DELLIN_KEY,
          delivery: {
            deliveryType: {
              type: "auto",
            },
            arrival: {
              variant: "address",
              address: {
                search: to,
              },
              time: {
                worktimeStart: "09:00",
                worktimeEnd: "18:00",
              },
            },
            derival: {
              variant: "address",
              produceDate: new Date(Date.now() + 86400000)
                .toISOString()
                .split("T")[0],
              address: {
                search: from,
              },
              time: {
                worktimeStart: "09:00",
                worktimeEnd: "18:00",
              },
            },
          },
          cargo: {
            length,
            width,
            height,
            totalVolume: length * width * height,
            totalWeight: weight,
          },
        }),
      }
    );
    const dellinData = await dellinResponse.json();
    if (dellinData.metadata.status !== 200) {
      return res
        .status(400)
        .json({
          error:
            dellinData.errors[0].title + "| " + dellinData.errors[0].detail,
        });
    }
    return res.status(200).json({ data: dellinData.data });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ error: "Не удалось рассчитать стоимость и сроки доставки" });
  }
};

module.exports = dellinController;
