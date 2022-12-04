const { ZingMp3 } = require("zingmp3-api-full")

class zingController {
  getTop100 = async (req, res) => {
    const data = await ZingMp3.getChartHome()
    res.status(200).send({ success: true, data: data })
  }

  getDetailSong = async (req, res) => {
    const { idSong } = req.query
    const detail = await ZingMp3.getSong(idSong)
    res.status(200).json({ detail })
  }

  search = async (req, res) => {
    const { search } = req.query
    const data = await ZingMp3.search(search)
    res.status(200).json({
      data
    })
  }

  getListMusic = async (req, res) => {
    const musics = await ZingMp3.getListArtistSong()
    const artists = await ZingMp3.getArtist("sontungmtp")
    const search = await ZingMp3.getListArtistSong("IWZ9ZD8A", "1", "15")
    const top100 = await ZingMp3.getTop100()
    const home = await ZingMp3.getHome()
    res.status(200).json({
      home
    })
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
    const data = await ZingMp3.getSong("ZWFEOE7O")
    res
      .status(200)
      .send({ success: true, data: { data, zingChartID, songFix } })
  }

  getRandomSongList = async (req, res) => {
    const home = await ZingMp3.getHome()
    const itemMain = home?.data?.items?.filter(
      (val) => val.sectionType === "new-release"
    )
    const listSong = itemMain[0].items.all


    const getSongDetail = async (songIDs) => {
      let songDetail
      for (let i = 0; i < songIDs.length; i++) {
        songDetail = await ZingMp3.getSong(songIDs[i])
        if (songDetail.err == 0) {
          break
        }
      }
      return songDetail
    }
    let newList = []
    for (let i = 0; i < listSong.length; i++) {
      let songConcrete = await getSongDetail(listSong[i].genreIds)
      console.log("songConcrete", songConcrete)
      if (songConcrete.err == 0) {
        newList.push({ ...listSong[i], url: songConcrete.data[128] })
      }
    }
    res.status(200).send({ success: true, data: newList })
  }
}

module.exports = new zingController()
