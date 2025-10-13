import { RequestHandler } from "express";
import History, { historyType } from "#/models/history";
import { paginationQuery } from "#/@types/misc";
import { date } from "yup";

export const updateHistory: RequestHandler = async (req, res) => {
  const oldHistory = await History.findOne({ owner: req.user.id });

  const { audio, progress, date } = req.body;

  const history: historyType = { audio, progress, date };

  if (!oldHistory) {
    await History.create({
      owner: req.user.id,
      last: history,
      all: [history],
    });
    return res.json({ success: true });
  }

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const histories = await History.aggregate([
    {
      $match: { owner: req.user.id },
    },
    { $unwind: "$all" },
    {
      $match: {
        "all.date": {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    },
    {
      $project: {
        _id: 0,
        audioId: "$all.audio",
      },
    },
  ]);

  const sameDayHistory = histories.find(
    ({ audioId }) => audioId.toString() === audio
  );

  if (sameDayHistory) {
    await History.findOneAndUpdate(
      {
        owner: req.user.id,
        "all.audio": audio,
      },
      {
        $set: {
          "all.$.progress": progress,
          "all.$.date": date,
        },
      }
    );
  } else {
    await History.findByIdAndUpdate(oldHistory._id, {
      $push: { all: { $each: [history], $position: 0 } },
      $set: { $last: history },
    });
  }

  return res.json({ sucess: true });
};

export const removeHistory: RequestHandler = async (req, res) => {
  // '/history?histories=["sadmlkas]&all=yes'
  const removeAll = req.query.all === "yes";

  if (removeAll) {
    await History.findOneAndDelete({ owner: req.user.id });
    return res.json({ success: true });
  }

  const histories = req.query.histories as string;
  const ids = JSON.parse(histories) as string[];

  await History.findOneAndUpdate(
    { owner: req.user.id },
    {
      $pull: { all: { _id: ids } },
    }
  );
  res.json({ sucess: true });
};

export const getHistories: RequestHandler = async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;
  const histories = await History.aggregate([
    { $match: { owner: req.user.id } },
    {
      $project: {
        all: {
          $slice: ["$all", parseInt(limit) * parseInt(limit)],
        },
      },
    },
    { $unwind: "$all" },
    {
      $lookup: {
        from: "audios",
        localField: "all.audio",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    { $unwind: "$audioInfo" },
    {
      $project: {
        _id: 0,
        id: "$all._id",
        audioId: "$audioInfo._id",
        date: "$all.date",
        title: "$audioINfo.title",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        audios: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$id",
        date: "$_id",
        audio: "$$ROOT.audios",
      },
    },
    {
      $sort: { date: -1 },
    },
  ]);

  res.json({ histories });
};

export const getRecentlyPlayed: RequestHandler = async (req, res) => {
  const match = { $match: { owner: req.user.id } };
  const sliceMatch = {
    $project: {
      myHistory: { $slice: ["$all", 10] },
    },
  };
  const dateSort = {
    $project: {
      histories: {
        $sortArray: {
          input: "$myHistory",
          sortBy: { date: -1 },
        },
      },
    },
  };

  const unwindWithIndex = {
    $unwind: { path: "$histories", includeArrayIndex: "index" },
  };

  const audioLookup = {
    $lookup: {
      from: "audios",
      localField: "histories.audio",
      foreignField: "_id",
      as: "audioInfo",
    },
  };
  const unwindAudioInfo = {
    $unwind: "$audioInfo",
  };
  const userLookup = {
    $lookup: {
      from: "users",
      localField: "audioInfo.owner",
      foreignField: "_id",
      as: "owner",
    },
  };

  const unwindUser = { $unwind: "$owner" };

  const projectResult = {
    $project: {
      _id: 0,
      id: "$audioInfo._id",
      title: "$histories.title",
      about: "$histories.about",
      file: "$histories.file.url",
      poster: "$histories.poster.url",
      category: "histories.category",
      owner: { name: "$owner.name", id: "$owner.Id" },
      date: "$histories.date",
      progress: "$histories.progress",
      index: "$index"
    },
  };

  const audios = await History.aggregate([
    match,
    sliceMatch,
    dateSort,
    unwindWithIndex,
    audioLookup,
    unwindAudioInfo,
    userLookup,
    unwindUser,
    projectResult,
  ]);
  res.json({audios});
};
