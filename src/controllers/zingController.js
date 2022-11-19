const { ZingMp3 } = require("zingmp3-api-full")

class zingController {
  getTop100 = async (req, res) => {
    const data = await ZingMp3.getChartHome()

    res.status(200).send({ success: true, data: data })
  }

  getConcreteLyric = async (req, res) => {
    const data = await ZingMp3.getSong("IWZ97FCD")

    res.status(200).send({ success: true, data: data })
  }
}

module.exports = new zingController()
