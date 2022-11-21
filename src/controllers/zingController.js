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

  getListLink = async (req, res) => {
    const zingChart = await ZingMp3.getChartHome()
    let zingChartID = zingChart.data.RTChart.items.map((val) => val.genreIds[1])
    zingChartID = [...new Set(zingChartID)]
    zingChartID = zingChartID.filter((val) => val)
    let songFix = []
    // console.log(zingChartID)
    for (let i = 0; i < zingChartID.length; i++) {
      let dataSong = await ZingMp3.getSong(zingChartID[i])
      if (dataSong.err === 0) songFix.push(dataSong)
    }
    // console.log("songFix", songFix)
    const data = await ZingMp3.getSong("IWZ97FCD")
    res
      .status(200)
      .send({ success: true, data: { data, zingChartID, songFix } })
  }
}

module.exports = new zingController()
